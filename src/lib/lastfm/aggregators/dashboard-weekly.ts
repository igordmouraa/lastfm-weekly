import { DashboardData, PrevWeekData, WeeklyData, WeightedTag } from '@/types/lastfm';
import { getArtistTopTags } from '../chart';
import { enrichWithImages } from '../resolve-image';

const EMPTY_PREV_WEEK: PrevWeekData = {
    totalScrobbles: 0,
    uniqueArtistCount: 0,
    uniqueAlbumCount: 0,
    uniqueTrackCount: 0,
    dailyStats: [],
    artistNames: [],
    albumKeys: [],
    trackKeys: [],
};

async function computeWeeklyTopTags(
    artists: { name: string; playcount?: string }[]
): Promise<WeightedTag[]> {
    const tagWeightMap = new Map<string, number>();

    const results = await Promise.all(
        artists.slice(0, 3).map(async (artist) => {
            try {
                const tags = await getArtistTopTags(artist.name);
                const count = parseInt(artist.playcount ?? '0', 10) || 1;
                return { count, tags };
            } catch {
                return { count: 1, tags: [] as { name: string; count?: number }[] };
            }
        })
    );

    results.forEach(({ count, tags }) => {
        tags
            .filter((t) => t.name && (t.count ?? 0) > 0)
            .slice(0, 5)
            .forEach((tag, idx) => {
                const weight = count * (1 - idx * 0.15);
                const key = tag.name.toLowerCase();
                tagWeightMap.set(key, (tagWeightMap.get(key) || 0) + weight);
            });
    });

    return Array.from(tagWeightMap.entries())
        .map(([name, tagCount]) => ({ name, count: Math.round(tagCount) }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 7);
}

/** Preview leve para o dashboard — evita o aggregator completo da cápsula. */
export async function buildDashboardWeeklyPreview(data: DashboardData): Promise<WeeklyData> {
    const topTags = await computeWeeklyTopTags(data.artists);

    const trackItems = data.tracks.map((t) => ({
        name: t.name,
        playcount: t.playcount,
        image: t.image,
        artist: t.artist?.name ?? '',
        album: t.album?.['#text'],
    }));

    const albumItems = data.albums.slice(0, 5).map((a) => ({
        name: a.name,
        playcount: a.playcount,
        image: a.image,
        artist: typeof a.artist === 'string' ? a.artist : '',
    }));

    const [enrichedTracks, enrichedAlbums] = await Promise.all([
        enrichWithImages(trackItems, 'track', (t) => t.artist),
        enrichWithImages(albumItems, 'album', (a) => a.artist),
    ]);

    return {
        user: data.user,
        artists: data.artists,
        tracks: enrichedTracks.map((t) => ({
            name: t.name,
            artist: { name: t.artist },
            image: t.image,
            imageUrl: t.imageUrl,
            playcount: t.playcount,
        })),
        albums: enrichedAlbums.map((a) => ({
            name: a.name,
            artist: a.artist,
            image: a.image,
            imageUrl: a.imageUrl,
            playcount: a.playcount,
        })),
        dailyStats: [],
        busiestDay: null,
        totalScrobbles: data.periodScrobbles,
        uniqueArtistCount: data.artists.length,
        uniqueAlbumCount: data.albums.length,
        uniqueTrackCount: data.tracks.length,
        prevWeekData: EMPTY_PREV_WEEK,
        topTags,
        dailyTagData: [],
    };
}
