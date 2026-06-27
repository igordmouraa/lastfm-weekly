import { getChartsData } from '@/lib/lastfm/aggregators/charts';
import { ChartsView } from '@/components/discovery/ChartsView';
import { PageContainer } from '@/components/shell/PageContainer';
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata.pages.charts' });
    return {
        title: t('title'),
        description: t('description'),
    };
}

export default async function ChartsPage({ params }: PageProps) {
    const { locale } = await params;
    setRequestLocale(locale as Locale);

    const data = await getChartsData(20);

    return (
        <PageContainer fullWidth>
            <ChartsView artists={data.artists} tracks={data.tracks} />
        </PageContainer>
    );
}
