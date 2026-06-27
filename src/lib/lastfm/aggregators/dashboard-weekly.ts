import { DashboardData, PrevWeekData, WeeklyData } from '@/types/lastfm';

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

/** Preview síncrono — weeklyTopTags já calculadas em getDashboardData. */
export function buildDashboardWeeklyPreview(data: DashboardData): WeeklyData {
    return {
        user: data.user,
        artists: data.artists,
        tracks: data.tracks.map((t) => ({
            name: t.name,
            artist: { name: t.artist?.name ?? (t.artist as { '#text'?: string })?.['#text'] ?? '' },
            image: t.image,
            imageUrl: t.imageUrl ?? null,
            playcount: t.playcount,
        })),
        albums: data.albums.slice(0, 5).map((a) => ({
            name: a.name,
            artist: typeof a.artist === 'string' ? a.artist : (a.artist as { name?: string })?.name ?? '',
            image: a.image,
            imageUrl: a.imageUrl ?? null,
            playcount: a.playcount,
        })),
        dailyStats: [],
        busiestDay: null,
        totalScrobbles: data.periodScrobbles,
        uniqueArtistCount: data.artists.length,
        uniqueAlbumCount: data.albums.length,
        uniqueTrackCount: data.tracks.length,
        prevWeekData: EMPTY_PREV_WEEK,
        topTags: data.weeklyTopTags,
        dailyTagData: [],
    };
}
