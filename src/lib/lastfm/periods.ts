import type { Locale } from '@/i18n/routing';
import { getIntlLocale } from '@/lib/i18n/format';
import { LastFmPeriod } from '@/types/lastfm';
import { periodToUnixRange, getPeriodScrobbleCount } from './periods-core';

export { periodToUnixRange, getPeriodScrobbleCount };

export function getPeriodLabel(period: LastFmPeriod, locale: Locale): string {
    const labels: Record<LastFmPeriod, Record<Locale, string>> = {
        '7day': { 'pt-BR': '7 dias', 'en-US': '7 days' },
        '1month': { 'pt-BR': '1 mês', 'en-US': '1 month' },
        '3month': { 'pt-BR': '3 meses', 'en-US': '3 months' },
        '6month': { 'pt-BR': '6 meses', 'en-US': '6 months' },
        '12month': { 'pt-BR': '12 meses', 'en-US': '12 months' },
        overall: { 'pt-BR': 'Sempre', 'en-US': 'All time' },
    };
    return labels[period][locale];
}

export const WRAPPED_PERIODS = ['1month', '3month', '6month', '12month'] as const;
export type WrappedPeriod = (typeof WRAPPED_PERIODS)[number];

export function getWrappedPeriodOptions(locale: Locale): { value: WrappedPeriod; label: string }[] {
    return WRAPPED_PERIODS.map((value) => ({
        value,
        label: getPeriodLabel(value, locale),
    }));
}

export function parseWrappedPeriod(value: string | null | undefined): WrappedPeriod {
    if (value && WRAPPED_PERIODS.includes(value as WrappedPeriod)) {
        return value as WrappedPeriod;
    }
    return '1month';
}

export function formatPeriodRange(period: WrappedPeriod, locale: Locale): string {
    const range = periodToUnixRange(period);
    if (!range) return '';
    const from = new Date(range.from * 1000);
    const to = new Date(range.to * 1000);
    const fmt = (d: Date) =>
        d.toLocaleDateString(getIntlLocale(locale), { day: 'numeric', month: 'short', year: 'numeric' });
    return `${fmt(from)} — ${fmt(to)}`;
}
