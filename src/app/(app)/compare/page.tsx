import { PageContainer } from '@/components/shell/PageContainer';
import { CompareView } from '@/components/social/CompareView';
import { compareUsers } from '@/lib/lastfm/aggregators/compare';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Comparar — Weekster Hub',
    description: 'Compare taste overlap entre dois usuários Last.fm.',
};

interface PageProps {
    searchParams: Promise<{ user1?: string; user2?: string }>;
}

export default async function ComparePage({ searchParams }: PageProps) {
    const { user1, user2 } = await searchParams;
    const result = user1 && user2 ? await compareUsers(user1, user2) : null;

    return (
        <PageContainer fullWidth>
            <CompareView user1={user1} user2={user2} result={result} />
        </PageContainer>
    );
}
