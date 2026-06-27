import { getPeriodWrapped } from '@/lib/lastfm/aggregators/period-wrapped';
import { PeriodWrappedHub } from '@/components/wrapped/PeriodWrappedHub';
import { PageContainer } from '@/components/shell/PageContainer';
import { parseWrappedPeriod, getPeriodLabel } from '@/lib/lastfm/periods';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LastFmError } from '@/lib/lastfm/client';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';

interface PageProps {
    params: Promise<{ locale: string; username: string }>;
    searchParams: Promise<{ period?: string }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
    const { locale, username } = await params;
    const { period: periodParam } = await searchParams;
    const period = parseWrappedPeriod(periodParam);
    const t = await getTranslations({ locale, namespace: 'metadata.pages.wrapped' });
    return {
        title: t('title', { period: getPeriodLabel(period, locale as Locale), username }),
    };
}

export default async function WrappedPage({ params, searchParams }: PageProps) {
    const { locale, username } = await params;
    setRequestLocale(locale as Locale);
    const { period: periodParam } = await searchParams;
    const period = parseWrappedPeriod(periodParam);

    let data;
    try {
        data = await getPeriodWrapped(username, period);
    } catch (err) {
        if (err instanceof LastFmError) notFound();
        throw err;
    }

    return (
        <PageContainer>
            <PeriodWrappedHub data={data} username={username} />
        </PageContainer>
    );
}
