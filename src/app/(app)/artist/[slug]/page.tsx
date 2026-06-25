import { getArtistProfile } from '@/lib/lastfm/aggregators/artist-profile';
import { ArtistView } from '@/components/discovery/ArtistView';
import { PageContainer } from '@/components/shell/PageContainer';
import { notFound } from 'next/navigation';
import { LastFmError } from '@/lib/lastfm/client';
import { Metadata } from 'next';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    return { title: `${decodeURIComponent(slug)} — Artista` };
}

export default async function ArtistPage({ params }: PageProps) {
    const { slug } = await params;

    let data;
    try {
        data = await getArtistProfile(slug);
    } catch (err) {
        if (err instanceof LastFmError) notFound();
        throw err;
    }

    return (
        <PageContainer>
            <ArtistView
                name={data.artist.name}
                heroImage={data.heroImage}
                listeners={data.artist.stats?.listeners ?? '0'}
                playcount={data.artist.stats?.playcount ?? '0'}
                bio={data.bio}
                tags={data.tags}
                similar={data.similar}
            />
        </PageContainer>
    );
}
