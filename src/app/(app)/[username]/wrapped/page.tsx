import { getPeriodWrapped } from '@/lib/lastfm/aggregators/period-wrapped';
import { PeriodWrappedHub } from '@/components/wrapped/PeriodWrappedHub';
import { PageContainer } from '@/components/shell/PageContainer';
import { parseWrappedPeriod, getPeriodLabel } from '@/lib/lastfm/periods';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LastFmError } from '@/lib/lastfm/client';

interface PageProps {
    params: Promise<{ username: string }>;
    searchParams: Promise<{ period?: string }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
    const { username } = await params;
    const { period: periodParam } = await searchParams;
    const period = parseWrappedPeriod(periodParam);
    return { title: `Wrapped · ${getPeriodLabel(period)} — ${username}` };
}

export default async function WrappedPage({ params, searchParams }: PageProps) {
    const { username } = await params;
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
