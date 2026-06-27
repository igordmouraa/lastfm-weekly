import { TagsHub } from '@/components/discovery/TagsHub';
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
    const t = await getTranslations({ locale, namespace: 'metadata.pages.tags' });
    return {
        title: t('title'),
        description: t('description'),
    };
}

export default async function TagsPage({ params }: PageProps) {
    const { locale } = await params;
    setRequestLocale(locale as Locale);

    return (
        <PageContainer>
            <TagsHub />
        </PageContainer>
    );
}
