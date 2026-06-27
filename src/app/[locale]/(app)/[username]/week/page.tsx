import { getUserWeeklyWrapped } from '@/lib/lastfm/aggregators/weekly';
import { WeekPageClient } from '@/components/wrapped/WeekPageClient';
import { PageContainer } from '@/components/shell/PageContainer';
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';

export const revalidate = 600;

interface PageProps {
    params: Promise<{ locale: string; username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale, username } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata.pages.week' });
    return { title: t('title', { username }) };
}

export default async function WeekPage({ params }: PageProps) {
    const { locale, username } = await params;
    setRequestLocale(locale as Locale);
    const t = await getTranslations('metadata.pages.week');
    const data = await getUserWeeklyWrapped(username);

    return (
        <PageContainer fullWidth className="relative" title={t('heading')} description={t('description')}>
            <WeekPageClient data={data} username={username} />
        </PageContainer>
    );
}
