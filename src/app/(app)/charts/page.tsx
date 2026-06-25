import { getChartsData } from '@/lib/lastfm/aggregators/charts';
import { ChartsView } from '@/components/discovery/ChartsView';
import { PageContainer } from '@/components/shell/PageContainer';
import { Metadata } from 'next';

export const revalidate = 3600;

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
