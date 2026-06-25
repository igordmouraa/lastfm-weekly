import { getTopArtists } from '../user';

export interface CompareResult {
    user1: string;
    user2: string;
    overlap: string[];
    overlapCount: number;
    user1Unique: number;
    user2Unique: number;
    overlapPercent: number;
}

export async function compareUsers(user1: string, user2: string, limit = 50): Promise<CompareResult> {
    const [artists1, artists2] = await Promise.all([
        getTopArtists(user1, 'overall', limit),
        getTopArtists(user2, 'overall', limit),
    ]);

    const set1 = new Set(artists1.map((a) => a.name.toLowerCase()));
    const set2 = new Set(artists2.map((a) => a.name.toLowerCase()));

    const overlap = artists1
        .filter((a) => set2.has(a.name.toLowerCase()))
        .map((a) => a.name);

    const overlapCount = overlap.length;
    const union = new Set([...set1, ...set2]).size;

    return {
        user1,
        user2,
        overlap,
        overlapCount,
        user1Unique: set1.size - overlapCount,
        user2Unique: set2.size - overlapCount,
        overlapPercent: union > 0 ? Math.round((overlapCount / union) * 100) : 0,
    };
}
