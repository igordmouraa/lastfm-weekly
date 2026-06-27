import { getUserFriends } from '@/lib/lastfm/user';
import { FriendsView } from '@/components/social/FriendsView';
import { PageContainer } from '@/components/shell/PageContainer';
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';

interface PageProps {
    params: Promise<{ locale: string; username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale, username } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata.pages.friends' });
    return { title: t('title', { username }) };
}

export default async function FriendsPage({ params }: PageProps) {
    const { locale, username } = await params;
    setRequestLocale(locale as Locale);
    const friends = await getUserFriends(username);

    return (
        <PageContainer>
            <FriendsView username={username} friends={friends} />
        </PageContainer>
    );
}
