import { getDashboardData } from '@/lib/lastfm/aggregators/dashboard';
import { buildDashboardWeeklyPreview } from '@/lib/lastfm/aggregators/dashboard-weekly';
import { DashboardHub } from '@/components/dashboard/DashboardHub';
import { PageContainer } from '@/components/shell/PageContainer';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LastFmError } from '@/lib/lastfm/client';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';

export const revalidate = 300;

interface PageProps {
    params: Promise<{ locale: string; username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale, username } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata.pages.dashboard' });
    return {
        title: t('title', { username }),
        description: t('description', { username }),
    };
}

export default async function ProfilePage({ params }: PageProps) {
    const { locale, username } = await params;
    setRequestLocale(locale as Locale);

    let data;
    let weekly;
    try {
        data = await getDashboardData(username, '7day');
        weekly = buildDashboardWeeklyPreview(data);
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
