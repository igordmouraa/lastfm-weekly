import { PageContainer } from '@/components/shell/PageContainer';
import { CompareView } from '@/components/social/CompareView';
import { compareUsers } from '@/lib/lastfm/aggregators/compare';
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';

interface PageProps {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ user1?: string; user2?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata.pages.compare' });
    return {
        title: t('title'),
        description: t('description'),
    };
}

export default async function ComparePage({ params, searchParams }: PageProps) {
    const { locale } = await params;
    setRequestLocale(locale as Locale);
    const { user1, user2 } = await searchParams;
    const result = user1 && user2 ? await compareUsers(user1, user2) : null;

    return (
        <PageContainer fullWidth>
            <CompareView user1={user1} user2={user2} result={result} />
        </PageContainer>
    );
}
