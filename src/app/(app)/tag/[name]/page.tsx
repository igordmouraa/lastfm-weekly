import { getTagTopArtists, getTagTopAlbums } from '@/lib/lastfm/chart';
import { enrichWithImages } from '@/lib/lastfm/resolve-image';
import { TagView } from '@/components/discovery/TagView';
import { PageContainer } from '@/components/shell/PageContainer';
import { formatTagName } from '@/lib/tags';
import { Metadata } from 'next';

interface PageProps {
    params: Promise<{ name: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { name } = await params;
    return { title: `${formatTagName(decodeURIComponent(name))} — Tag` };
}

export default async function TagPage({ params }: PageProps) {
    const { name } = await params;
    const tag = decodeURIComponent(name);

    const [artists, albums] = await Promise.all([
        getTagTopArtists(tag, 12),
        getTagTopAlbums(tag, 12),
    ]);

    const mappedArtists = artists.map((a) => ({ name: a.name, playcount: a.playcount, image: a.image }));
    const mappedAlbums = albums.map((a) => ({
        name: a.name,
        playcount: a.playcount,
        image: a.image,
        artist:
            typeof a.artist === 'string'
                ? a.artist
                : (a.artist as { name?: string; '#text'?: string })?.name
                    ?? (a.artist as { '#text'?: string })?.['#text']
                    ?? '',
    }));

    const [enrichedArtists, enrichedAlbums] = await Promise.all([
        enrichWithImages(mappedArtists, 'artist'),
        enrichWithImages(mappedAlbums, 'album', (a) => a.artist),
    ]);

    return (
        <PageContainer>
            <TagView
                tag={tag}
                artists={enrichedArtists.map((a) => ({
                    name: a.name,
                    playcount: a.playcount,
                    imageUrl: a.imageUrl,
                }))}
                albums={enrichedAlbums.map((a, i) => ({
                    name: a.name,
                    playcount: a.playcount,
                    imageUrl: a.imageUrl,
                    artist: mappedAlbums[i]?.artist ?? '',
                }))}
            />
        </PageContainer>
    );
}
