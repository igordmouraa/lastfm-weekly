import { cache } from 'react';
import { LastFmPeriod } from '@/types/lastfm';
import { fetchLastFm } from './client';
import { RecentTracksResponse } from '@/types/lastfm';

const PERIOD_DAYS: Record<Exclude<LastFmPeriod, 'overall'>, number> = {
    '7day': 7,
    '1month': 30,
    '3month': 90,
    '6month': 180,
    '12month': 365,
};

export function periodToUnixRange(period: LastFmPeriod): { from: number; to: number } | null {
    if (period === 'overall') return null;
    const days = PERIOD_DAYS[period];
    const to = Math.floor(Date.now() / 1000);
    const from = to - days * 86400;
    return { from, to };
}

export const getPeriodScrobbleCount = cache(async (username: string, period: LastFmPeriod): Promise<number> => {
    if (period === 'overall') {
        const { getUserInfo } = await import('./user');
        const user = await getUserInfo(username);
        return parseInt(user.playcount, 10) || 0;
    }

    const range = periodToUnixRange(period);
    if (!range) return 0;

    const data = await fetchLastFm<RecentTracksResponse>(
        'user.getRecentTracks',
        { user: username, from: String(range.from), to: String(range.to), limit: '1' },
        { revalidate: 600, tags: [`lastfm:user:${username}:scrobbles:${period}`] }
    );

    return parseInt(data.recenttracks['@attr'].total, 10) || 0;
});
