import { getChartsData } from '@/lib/lastfm/aggregators/charts';
import { LastFmError } from '@/lib/lastfm/client';
import { ChartsView } from '@/components/discovery/ChartsView';
import { PageContainer } from '@/components/shell/PageContainer';
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';

export const revalidate = 3600;

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

    let artists: Awaited<ReturnType<typeof getChartsData>>['artists'] = [];
    let tracks: Awaited<ReturnType<typeof getChartsData>>['tracks'] = [];

    try {
        const data = await getChartsData(20, { resolveImages: false });
        artists = data.artists;
        tracks = data.tracks;
    } catch (error) {
        // CI / build sem key válida (ou Last.fm fora): mantém o shell da página
        if (!(error instanceof LastFmError)) throw error;
    }

    return (
        <PageContainer fullWidth>
            <ChartsView artists={artists} tracks={tracks} />
        </PageContainer>
    );
}
