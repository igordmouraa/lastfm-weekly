import {
    WeeklyData,
    DailyTagData,
    RecentTracksResponse,
    LastFmImage,
} from '@/types/lastfm';
import { startOfWeek, endOfWeek, getUnixTime, format, subWeeks } from 'date-fns';
import { fetchLastFm, asArray } from '../client';
import { getUserInfo } from '../user';
import { processRecentTracks } from './recent-tracks';
import { enrichWithImages } from '../resolve-image';
import { cacheAggregator } from '../server-cache';
import { fetchArtistTagsMap, weightTagsFromArtistMap } from './weekly-tags';

async function fetchUserWeeklyWrapped(username: string): Promise<WeeklyData> {
    const now = new Date();
    const fromDate = startOfWeek(now, { weekStartsOn: 5 });
    const toDate = endOfWeek(now, { weekStartsOn: 5 });
    const prevFromDate = startOfWeek(subWeeks(now, 1), { weekStartsOn: 5 });
    const prevToDate = endOfWeek(subWeeks(now, 1), { weekStartsOn: 5 });

    const from = getUnixTime(fromDate).toString();
    const to = getUnixTime(toDate).toString();
    const prevFrom = getUnixTime(prevFromDate).toString();
    const prevTo = getUnixTime(prevToDate).toString();

    const recentOpts = { revalidate: 120, tags: [`lastfm:user:${username}:recent`] as string[] };

    const [user, recentTracksData, prevRecentTracksData] = await Promise.all([
        getUserInfo(username),
        fetchLastFm<RecentTracksResponse>(
            'user.getRecentTracks',
            { user: username, from, to, limit: '1000' },
            recentOpts
        ),
        fetchLastFm<RecentTracksResponse>(
            'user.getRecentTracks',
            { user: username, from: prevFrom, to: prevTo, limit: '1000' },
            recentOpts
        ),
    ]);

    const trackList = asArray(recentTracksData.recenttracks.track);
    const prevTrackList = asArray(prevRecentTracksData.recenttracks.track);
    const weeklyScrobbles = parseInt(recentTracksData.recenttracks['@attr'].total, 10) || trackList.length;
    const prevWeeklyScrobbles = parseInt(prevRecentTracksData.recenttracks['@attr'].total, 10) || prevTrackList.length;

    const currentWeek = processRecentTracks(trackList);
    const prevWeek = processRecentTracks(prevTrackList);

    const sortedTracks = Array.from(currentWeek.tracksMap.values()).sort((a, b) => b.count - a.count).slice(0, 5);
    const sortedArtists = Array.from(currentWeek.artistsMap.values()).sort((a, b) => b.count - a.count).slice(0, 5);
    const sortedAlbums = Array.from(currentWeek.albumsMap.values()).sort((a, b) => b.count - a.count).slice(0, 5);

    const dailyStats = Array.from(currentWeek.dailyMap.entries())
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));

    const busiestDay = dailyStats.length > 0
        ? dailyStats.reduce((max, cur) => (cur.count > max.count ? cur : max), dailyStats[0])
        : null;

    const prevDailyStats = Array.from(prevWeek.dailyMap.entries())
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));

    const prevWeekData = {
        totalScrobbles: prevWeeklyScrobbles,
        uniqueArtistCount: prevWeek.artistsMap.size,
        uniqueAlbumCount: prevWeek.albumsMap.size,
        uniqueTrackCount: prevWeek.tracksMap.size,
        dailyStats: prevDailyStats,
        artistNames: Array.from(prevWeek.artistsMap.keys()),
        albumKeys: Array.from(prevWeek.albumsMap.keys()),
        trackKeys: Array.from(prevWeek.tracksMap.keys()),
    };

    const allArtistsSorted = Array.from(currentWeek.artistsMap.values()).sort((a, b) => b.count - a.count);
    const artistTagsMap = await fetchArtistTagsMap(allArtistsSorted, 5);
    const topTags = weightTagsFromArtistMap(allArtistsSorted, artistTagsMap);
    const topTagNames = topTags.map((t) => t.name);
    const allDates = Array.from(currentWeek.dailyMap.keys()).sort();

    const dailyTagData: DailyTagData[] = allDates.map((date) => {
        const dayData: DailyTagData = { date: format(new Date(date + 'T12:00:00'), 'd MMM') };
        topTagNames.forEach((tag) => { dayData[tag] = 0; });
        currentWeek.artistDailyMap.forEach((dayMap, artistName) => {
            const artistDayCount = dayMap.get(date) || 0;
            if (artistDayCount > 0) {
                const tags = artistTagsMap.get(artistName) || [];
                tags.forEach((tag, idx) => {
                    if (topTagNames.includes(tag)) {
                        const weight = artistDayCount * (1 - idx * 0.15);
                        dayData[tag] = (dayData[tag] as number) + Math.round(weight);
                    }
                });
            }
        });
        return dayData;
    });

    const artistItems = sortedArtists.map((a) => ({
        name: a.name,
        playcount: a.count.toString(),
        image: [] as LastFmImage[],
    }));
    const albumItems = sortedAlbums.map((a) => ({
        name: a.name,
        artist: a.artist,
        playcount: a.count.toString(),
        image: a.image,
    }));
    const trackItems = sortedTracks.map((t) => ({
        name: t.name,
        artist: t.artist,
        playcount: t.count.toString(),
        image: t.image,
    }));

    const [enrichedArtists, enrichedAlbums, enrichedTracks] = await Promise.all([
        enrichWithImages(artistItems, 'artist'),
        enrichWithImages(albumItems, 'album', (a) => a.artist),
        enrichWithImages(trackItems, 'track', (t) => t.artist),
    ]);

    return {
        user: {
            name: user.name,
            image: user.image,
            playcount: user.playcount,
            country: user.country || 'Unknown',
        },
        tracks: enrichedTracks.map((t) => ({
            name: t.name,
            artist: { name: t.artist },
            image: t.image,
            imageUrl: t.imageUrl,
            playcount: t.playcount,
        })),
        artists: enrichedArtists.map((a) => ({
            name: a.name,
            playcount: a.playcount,
            image: a.image,
            imageUrl: a.imageUrl,
        })),
        albums: enrichedAlbums.map((a) => ({
            name: a.name,
            artist: a.artist,
            image: a.image,
            imageUrl: a.imageUrl,
            playcount: a.playcount,
        })),
        dailyStats,
        busiestDay,
        totalScrobbles: weeklyScrobbles,
        uniqueArtistCount: currentWeek.artistsMap.size,
        uniqueAlbumCount: currentWeek.albumsMap.size,
        uniqueTrackCount: currentWeek.tracksMap.size,
        prevWeekData,
        topTags,
        dailyTagData,
    };
}

export const getUserWeeklyWrapped = cacheAggregator(
    'weekly',
    fetchUserWeeklyWrapped,
    {
        revalidate: 600,
        tags: (username) => [`lastfm:user:${username}:weekly`],
    }
);
