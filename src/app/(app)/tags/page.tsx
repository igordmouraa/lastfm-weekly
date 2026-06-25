import { TagsHub } from '@/components/discovery/TagsHub';
import { PageContainer } from '@/components/shell/PageContainer';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Tags — Weekster Hub',
    description: 'Explore gêneros e tags do Last.fm.',
};

export default function TagsPage() {
    return (
        <PageContainer>
            <TagsHub />
        </PageContainer>
    );
}
