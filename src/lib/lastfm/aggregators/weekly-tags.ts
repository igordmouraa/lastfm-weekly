import { WeightedTag } from '@/types/lastfm';
import { getArtistTopTags } from '../chart';

export async function fetchArtistTagsMap(
    artists: Array<{ name: string; count: number }>,
    maxArtists = 5
): Promise<Map<string, string[]>> {
    const artistTagsMap = new Map<string, string[]>();
    const results = await Promise.all(
        artists.slice(0, maxArtists).map(async (artist) => {
            try {
                const tags = await getArtistTopTags(artist.name);
                const filtered = tags
                    .filter((t) => t.name && Number(t.count ?? 0) > 0)
                    .slice(0, 5)
                    .map((t) => t.name.toLowerCase());
                return { name: artist.name, tags: filtered };
            } catch {
                return { name: artist.name, tags: [] as string[] };
            }
        })
    );
    results.forEach((r) => artistTagsMap.set(r.name, r.tags));
    return artistTagsMap;
}

export function weightTagsFromArtistMap(
    artists: Array<{ name: string; count: number }>,
    artistTagsMap: Map<string, string[]>
): WeightedTag[] {
    const tagWeightMap = new Map<string, number>();

    artists.forEach((artist) => {
        const tags = artistTagsMap.get(artist.name) || [];
        tags.forEach((tag, idx) => {
            const weight = artist.count * (1 - idx * 0.15);
            tagWeightMap.set(tag, (tagWeightMap.get(tag) || 0) + weight);
        });
    });

    return Array.from(tagWeightMap.entries())
        .map(([name, count]) => ({ name, count: Math.round(count) }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 7);
}

/** Tags ponderadas pelos top artistas da semana (tags do artista × playcount). */
export async function computeWeeklyTagsFromArtists(
    artists: Array<{ name: string; count: number }>,
    maxArtists = 5
): Promise<WeightedTag[]> {
    const slice = artists.slice(0, maxArtists);
    const artistTagsMap = await fetchArtistTagsMap(slice, maxArtists);
    return weightTagsFromArtistMap(slice, artistTagsMap);
}
