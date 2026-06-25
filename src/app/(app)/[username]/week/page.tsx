import { getUserWeeklyWrapped } from '@/lib/lastfm/aggregators/weekly';
import { WeekPageClient } from '@/components/wrapped/WeekPageClient';
import { PageContainer } from '@/components/shell/PageContainer';
import { Metadata } from 'next';

interface PageProps {
    params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { username } = await params;
    return { title: `Cápsula Semanal — ${username}` };
}

export default async function WeekPage({ params }: PageProps) {
    const { username } = await params;
    const data = await getUserWeeklyWrapped(username);
    return (
        <PageContainer
            fullWidth
            className="relative"
            title="Cápsula Musical"
            description="Seus últimos 7 dias em formato story."
        >
            <WeekPageClient data={data} username={username} />
        </PageContainer>
    );
}
