import { getChartsData } from '@/lib/lastfm/aggregators/charts';
import { ChartsView } from '@/components/discovery/ChartsView';
import { PageContainer } from '@/components/shell/PageContainer';
import { Metadata } from 'next';

// Avoid build-time prerender: LASTFM_API_KEY may be unavailable during CI/Vercel build.
// Data is still cached for 1h via fetch revalidate in chart.ts.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Charts — Weekster Hub',
    description: 'Charts globais do Last.fm.',
};

export default async function ChartsPage() {
    const data = await getChartsData(20);

    return (
        <PageContainer fullWidth>
            <ChartsView artists={data.artists} tracks={data.tracks} />
        </PageContainer>
    );
}
