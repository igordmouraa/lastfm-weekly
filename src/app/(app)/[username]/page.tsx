import { getDashboardData } from '@/lib/lastfm/aggregators/dashboard';
import { buildDashboardWeeklyPreview } from '@/lib/lastfm/aggregators/dashboard-weekly';
import { DashboardHub } from '@/components/dashboard/DashboardHub';
import { PageContainer } from '@/components/shell/PageContainer';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LastFmError } from '@/lib/lastfm/client';

interface PageProps {
    params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { username } = await params;
    return {
        title: `${username} — Dashboard`,
        description: `Dashboard musical de ${username}.`,
    };
}

export default async function ProfilePage({ params }: PageProps) {
    const { username } = await params;

    let data;
    let weekly;
    try {
        data = await getDashboardData(username, '7day');
        weekly = await buildDashboardWeeklyPreview(data);
    } catch (err) {
        if (err instanceof LastFmError) notFound();
        throw err;
    }

    return (
        <PageContainer>
            <DashboardHub data={data} weekly={weekly} username={username} />
        </PageContainer>
    );
}
