import { getArtistInfo, getArtistSimilar, getArtistTopTags } from '../chart';
import { enrichWithImages, resolveEntityImage } from '../resolve-image';

export async function getArtistProfile(slug: string) {
    const name = decodeURIComponent(slug);

    const [artist, similar, tags] = await Promise.all([
        getArtistInfo(name),
        getArtistSimilar(name, 12),
        getArtistTopTags(name),
    ]);

    const [heroImage, similarEnriched] = await Promise.all([
        resolveEntityImage({ type: 'artist', name: artist.name, lastFmImages: artist.image }),
        enrichWithImages(
            similar.map((a) => ({ name: a.name, playcount: a.listeners, image: a.image })),
            'artist'
        ),
    ]);

    const bio = artist.bio?.summary?.replace(/<[^>]+>/g, '').trim() ?? '';

    return {
        artist,
        heroImage,
        bio,
        tags: tags.filter((t) => t.name).slice(0, 10),
        similar: similarEnriched,
    };
}
