/** Hash base do ícone estrela genérico do Last.fm (variantes terminam em a, f, etc.) */
const LASTFM_PLACEHOLDER_PREFIX = '2a96cbd8b46e442fc41c2b86b821562';

const FETCH_OPTS: RequestInit = {
    headers: { 'User-Agent': 'lastfm-weekly/1.0' },
    next: { revalidate: 86400 },
};

export function isDeezerPlaceholder(url: string | null | undefined): boolean {
    if (!url) return true;
    return url.includes('/artist//') || url.endsWith('/image');
}

export async function resolveArtistCoverDeezer(artist: string): Promise<string | null> {
    try {
        const res = await fetch(
            `https://api.deezer.com/search/artist?q=${encodeURIComponent(artist)}&limit=1`,
            FETCH_OPTS
        );
        if (!res.ok) return null;
        const data = await res.json();
        const item = data.data?.[0];
        if (!item) return null;

        const url =
            item.picture_xl ||
            item.picture_big ||
            item.picture_medium ||
            item.picture_small ||
            null;

        if (!url || isDeezerPlaceholder(url)) return null;
        return url;
    } catch {
        return null;
    }
}

/** Fallback: capa do álbum mais relevante no iTunes */
export async function resolveArtistCoverItunes(artist: string): Promise<string | null> {
    try {
        const res = await fetch(
            `https://itunes.apple.com/search?term=${encodeURIComponent(artist)}&entity=album&limit=1`,
            FETCH_OPTS
        );
        if (!res.ok) return null;
        const data = await res.json();
        const url = data.results?.[0]?.artworkUrl100 as string | undefined;
        if (!url) return null;
        return url.replace('100x100bb', '600x600bb');
    } catch {
        return null;
    }
}

export async function resolveArtistCover(artist: string): Promise<string | null> {
    const deezer = await resolveArtistCoverDeezer(artist);
    if (deezer) return deezer;
    return resolveArtistCoverItunes(artist);
}

export async function resolveAlbumCover(artist: string, album: string): Promise<string | null> {
    try {
        const q = `album:"${album}" artist:"${artist}"`;
        const res = await fetch(
            `https://api.deezer.com/search/album?q=${encodeURIComponent(q)}&limit=1`,
            FETCH_OPTS
        );
        if (!res.ok) return null;
        const data = await res.json();
        const item = data.data?.[0];
        const url = item?.cover_xl || item?.cover_big || item?.cover_medium || null;
        if (!url) return null;
        return url;
    } catch {
        return null;
    }
}

export async function resolveTrackCoverItunes(artist: string, track: string): Promise<string | null> {
    try {
        const term = `${artist} ${track}`;
        const res = await fetch(
            `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song&limit=1`,
            FETCH_OPTS
        );
        if (!res.ok) return null;
        const data = await res.json();
        const url = data.results?.[0]?.artworkUrl100 as string | undefined;
        if (!url) return null;
        return url.replace('100x100bb', '600x600bb');
    } catch {
        return null;
    }
}

export async function resolveTrackCoverDeezer(artist: string, track: string): Promise<string | null> {
    try {
        const q = `artist:"${artist}" track:"${track}"`;
        const res = await fetch(
            `https://api.deezer.com/search/track?q=${encodeURIComponent(q)}&limit=1`,
            FETCH_OPTS
        );
        if (!res.ok) return null;
        const data = await res.json();
        const item = data.data?.[0];
        const url = item?.album?.cover_xl || item?.album?.cover_big || item?.album?.cover_medium || null;
        if (!url) return null;
        return url;
    } catch {
        return null;
    }
}

export async function resolveTrackCover(artist: string, track: string): Promise<string | null> {
    const deezer = await resolveTrackCoverDeezer(artist, track);
    if (deezer) return deezer;
    return resolveTrackCoverItunes(artist, track);
}

export async function resolveCoversBatch<T extends { imageUrl: string | null }>(
    items: T[],
    resolver: (item: T) => Promise<string | null>,
    batchSize = 5
): Promise<T[]> {
    const resolved: T[] = [];
    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        const results = await Promise.all(
            batch.map(async (item) => {
                if (item.imageUrl) return item;
                const url = await resolver(item);
                return { ...item, imageUrl: url };
            })
        );
        resolved.push(...results);
    }
    return resolved;
}

export { LASTFM_PLACEHOLDER_PREFIX };
