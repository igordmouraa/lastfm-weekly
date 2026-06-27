import { DashboardData, LastFmPeriod } from '@/types/lastfm';
import {
    getUserInfo,
    getTopArtists,
    getTopTracks,
    getTopAlbums,
    getUserTopTags,
    mapTopArtists,
    mapTopTracks,
    mapTopAlbums,
} from '../user';
import { getPeriodScrobbleCount } from '../periods';
import { getValidImageUrl } from '../resolve-image';
import { cacheAggregator } from '../server-cache';
import { computeWeeklyTagsFromArtists } from './weekly-tags';

/** Last.fm images only — Deezer/iTunes resolve no client via LazyCoverImage. */
function mapWithLastFmImageUrl<T extends { image?: import('@/types/lastfm').LastFmImage[] }>(
    items: T[]
): (T & { imageUrl: string | null })[] {
    return items.map((item) => ({
        ...item,
        imageUrl: getValidImageUrl(item.image),
    }));
}

async function fetchDashboardData(
    username: string,
    period: LastFmPeriod
): Promise<DashboardData> {
    const [user, artists, tracks, albums, tags, periodScrobbles] = await Promise.all([
        getUserInfo(username),
        getTopArtists(username, period, 5),
        getTopTracks(username, period, 5),
        getTopAlbums(username, period, 9),
        getUserTopTags(username, 12),
        getPeriodScrobbleCount(username, period),
    ]);

    const mappedArtists = mapTopArtists(artists);
    const mappedTracks = mapTopTracks(tracks);
    const mappedAlbums = mapTopAlbums(albums);

    const enrichedArtists = mapWithLastFmImageUrl(mappedArtists);
    const enrichedTracks = mapWithLastFmImageUrl(mappedTracks);
    const previewAlbums = mappedAlbums.slice(0, 9);

    const collagePreview = previewAlbums.map((a) => ({
        name: a.name,
        artist:
            typeof a.artist === 'string'
                ? a.artist
                : (a.artist as { name?: string; '#text'?: string })?.name
                    ?? (a.artist as { '#text'?: string })?.['#text']
                    ?? '',
        playcount: parseInt(a.playcount ?? '0', 10),
        imageUrl: getValidImageUrl(a.image),
    }));

    const weeklyTopTags = await computeWeeklyTagsFromArtists(
        mappedArtists.map((a) => ({
            name: a.name,
            count: parseInt(a.playcount ?? '0', 10),
        }))
    );

    return {
        user,
        period,
        artists: enrichedArtists,
        tracks: enrichedTracks.map((t, i) => ({
            ...mappedTracks[i],
            imageUrl: t.imageUrl,
        })),
        albums: mappedAlbums.map((a, i) => ({
            ...a,
            imageUrl: i < 9 ? collagePreview[i]?.imageUrl ?? null : getValidImageUrl(a.image),
        })),
        tags,
        periodScrobbles,
        collagePreview,
        totalScrobbles: parseInt(user.playcount, 10) || 0,
        weeklyTopTags,
    };
}

export const getDashboardData = cacheAggregator(
    'dashboard',
    fetchDashboardData,
    {
        revalidate: 300,
        tags: (username) => [`lastfm:user:${username}:dashboard`],
    }
);
