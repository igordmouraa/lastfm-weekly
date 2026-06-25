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

export function getPeriodLabel(period: LastFmPeriod): string {
    const labels: Record<LastFmPeriod, string> = {
        '7day': '7 dias',
        '1month': '1 mês',
        '3month': '3 meses',
        '6month': '6 meses',
        '12month': '12 meses',
        overall: 'Sempre',
    };
    return labels[period];
}

export const WRAPPED_PERIODS = ['1month', '3month', '6month', '12month'] as const;
export type WrappedPeriod = (typeof WRAPPED_PERIODS)[number];

export const WRAPPED_PERIOD_OPTIONS: { value: WrappedPeriod; label: string }[] = [
    { value: '1month', label: '1 mês' },
    { value: '3month', label: '3 meses' },
    { value: '6month', label: '6 meses' },
    { value: '12month', label: '12 meses' },
];

export function parseWrappedPeriod(value: string | null | undefined): WrappedPeriod {
    if (value && WRAPPED_PERIODS.includes(value as WrappedPeriod)) {
        return value as WrappedPeriod;
    }
    return '1month';
}

export function formatPeriodRange(period: WrappedPeriod): string {
    const range = periodToUnixRange(period);
    if (!range) return '';
    const from = new Date(range.from * 1000);
    const to = new Date(range.to * 1000);
    const fmt = (d: Date) =>
        d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' });
    return `${fmt(from)} — ${fmt(to)}`;
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
