import {
    WeeklyData,
    LastFmUserInfoResponse,
    WeightedTag,
    DailyTagData,
    RecentTracksResponse,
    LastFmImage,
} from '@/types/lastfm';
import { startOfWeek, endOfWeek, getUnixTime, format, subWeeks } from 'date-fns';
import { fetchLastFm, asArray } from '../client';
import { processRecentTracks } from './recent-tracks';
import { getArtistTopTags } from '../chart';
import { enrichWithImages } from '../resolve-image';

async function fetchTopArtistTagsMap(
    artists: Array<{ name: string; count: number }>,
    maxArtists = 5
): Promise<Map<string, string[]>> {
    const artistTagsMap = new Map<string, string[]>();
    const results = await Promise.all(
        artists.slice(0, maxArtists).map(async (artist) => {
            try {
                const tags = await getArtistTopTags(artist.name);
                const filtered = tags
                    .filter((t) => t.name && (t.count ?? 0) > 0)
                    .slice(0, 5)
                    .map((t) => t.name.toLowerCase());
                return { name: artist.name, tags: filtered };
            } catch {
                return { name: artist.name, tags: [] as string[] };
            }
        })
    );
    results.forEach((r) => artistTagsMap.set(r.name, r.tags));
    return artistTagsMap;
}

export async function getUserWeeklyWrapped(username: string): Promise<WeeklyData> {
    const now = new Date();
    const fromDate = startOfWeek(now, { weekStartsOn: 5 });
    const toDate = endOfWeek(now, { weekStartsOn: 5 });
    const prevFromDate = startOfWeek(subWeeks(now, 1), { weekStartsOn: 5 });
    const prevToDate = endOfWeek(subWeeks(now, 1), { weekStartsOn: 5 });

    const from = getUnixTime(fromDate).toString();
    const to = getUnixTime(toDate).toString();
    const prevFrom = getUnixTime(prevFromDate).toString();
    const prevTo = getUnixTime(prevToDate).toString();

    const [userInfoData, recentTracksData, prevRecentTracksData] = await Promise.all([
        fetchLastFm<LastFmUserInfoResponse>('user.getInfo', { user: username }),
        fetchLastFm<RecentTracksResponse>('user.getRecentTracks', { user: username, from, to, limit: '1000' }),
        fetchLastFm<RecentTracksResponse>('user.getRecentTracks', { user: username, from: prevFrom, to: prevTo, limit: '1000' }),
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
    const artistTagsMap = await fetchTopArtistTagsMap(allArtistsSorted, 5);

    const tagWeightMap = new Map<string, number>();
    allArtistsSorted.forEach((artist) => {
        const tags = artistTagsMap.get(artist.name) || [];
        tags.forEach((tag, idx) => {
            const weight = artist.count * (1 - idx * 0.15);
            tagWeightMap.set(tag, (tagWeightMap.get(tag) || 0) + weight);
        });
    });

    const topTags: WeightedTag[] = Array.from(tagWeightMap.entries())
        .map(([name, count]) => ({ name, count: Math.round(count) }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 7);

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
            name: userInfoData.user.name,
            image: userInfoData.user.image,
            playcount: userInfoData.user.playcount,
            country: userInfoData.user.country || 'Unknown',
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
