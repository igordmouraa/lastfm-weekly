import { LastFmImage } from '@/types/lastfm';
import { getImageUrl, isLastFmPlaceholder } from '@/lib/images';
import { resolveArtistCover, resolveAlbumCover, resolveTrackCover } from './images';
import { getArtistInfo, getTrackInfo } from './chart';

export function isLastFmPlaceholderUrl(url: string | null | undefined): boolean {
    return isLastFmPlaceholder(url);
}

export function getValidImageUrl(images: LastFmImage[] | undefined): string | null {
    const url = getImageUrl(images);
    if (!url || isLastFmPlaceholder(url)) return null;
    return url;
}

export type EntityImageType = 'artist' | 'album' | 'track';

export interface ResolveEntityImageParams {
    type: EntityImageType;
    name: string;
    artist?: string;
    album?: string;
    lastFmImages?: LastFmImage[];
}

function albumNameFromTrackInfo(album?: { title?: string; '#text'?: string }): string | undefined {
    return album?.title ?? album?.['#text'];
}

/** Faixas: prioriza capa do álbum — imagens de top tracks no Last.fm costumam ser do artista. */
async function resolveTrackImage(params: ResolveEntityImageParams): Promise<string | null> {
    const artist = params.artist;
    if (!artist) return null;

    let album = params.album;

    if (!album) {
        try {
            const info = await getTrackInfo(artist, params.name);
            album = albumNameFromTrackInfo(info.album);
            const fromAlbumImages = getValidImageUrl(info.album?.image);
            if (fromAlbumImages) return fromAlbumImages;
        } catch {
            // segue para fallbacks externos
        }
    }

    if (album) {
        const albumCover = await resolveAlbumCover(artist, album);
        if (albumCover) return albumCover;
    }

    const trackCover = await resolveTrackCover(artist, params.name);
    if (trackCover) return trackCover;

    const fromLastFm = getValidImageUrl(params.lastFmImages);
    if (fromLastFm) return fromLastFm;

    return resolveArtistCover(artist);
}

export async function resolveEntityImage(params: ResolveEntityImageParams): Promise<string | null> {
    if (params.type === 'track' && params.artist) {
        return resolveTrackImage(params);
    }

    const fromLastFm = getValidImageUrl(params.lastFmImages);
    if (fromLastFm) return fromLastFm;

    if (params.type === 'artist') {
        try {
            const info = await getArtistInfo(params.name);
            const fromInfo = getValidImageUrl(info.image);
            if (fromInfo) return fromInfo;
        } catch {
            // segue para fallbacks externos
        }
        return resolveArtistCover(params.name);
    }

    if (params.type === 'album' && params.artist) {
        return resolveAlbumCover(params.artist, params.name);
    }

    return null;
}

export async function enrichWithImages<T extends { name: string; imageUrl?: string | null; image?: LastFmImage[]; artist?: string; album?: string }>(
    items: T[],
    type: EntityImageType,
    getArtist?: (item: T) => string | undefined
): Promise<(T & { imageUrl: string | null })[]> {
    const result: (T & { imageUrl: string | null })[] = [];

    for (let i = 0; i < items.length; i += 5) {
        const batch = items.slice(i, i + 5);
        const resolved = await Promise.all(
            batch.map(async (item) => {
                const artist = getArtist?.(item) ?? (typeof item.artist === 'string' ? item.artist : undefined);

                if (type === 'track') {
                    const url = await resolveEntityImage({
                        type: 'track',
                        name: item.name,
                        artist,
                        album: item.album,
                        lastFmImages: item.image,
                    });
                    return { ...item, imageUrl: url };
                }

                const existing = item.imageUrl ?? getValidImageUrl(item.image);
                if (existing) return { ...item, imageUrl: existing };

                const url = await resolveEntityImage({
                    type,
                    name: item.name,
                    artist,
                    album: item.album,
                    lastFmImages: item.image,
                });
                return { ...item, imageUrl: url };
            })
        );
        result.push(...resolved);
    }

    return result;
}
