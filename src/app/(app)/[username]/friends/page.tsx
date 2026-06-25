import { getUserFriends } from '@/lib/lastfm/user';
import { FriendsView } from '@/components/social/FriendsView';
import { PageContainer } from '@/components/shell/PageContainer';
import { Metadata } from 'next';

interface PageProps {
    params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { username } = await params;
    return { title: `Amigos — ${username}` };
}

export default async function FriendsPage({ params }: PageProps) {
    const { username } = await params;
    const friends = await getUserFriends(username);

    return (
        <PageContainer>
            <FriendsView username={username} friends={friends} />
        </PageContainer>
    );
}
