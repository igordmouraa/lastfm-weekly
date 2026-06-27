import { subDays, getUnixTime } from 'date-fns';
import { getImageUrl } from '@/lib/images';
import { CollageAlbum, CollageDays, parseDays, parseGridSize } from '@/lib/semaninha-params';
import { resolveAlbumCover, resolveCoversBatch } from '../images';
import { fetchAllRecentTracks } from '../client';
import { getTopAlbums } from '../user';
import { processRecentTracks } from './recent-tracks';

export type { CollageAlbum, CollageDays };
export { parseDays, parseGridSize };

export interface CollageOptions {
    username: string;
    days: CollageDays;
    count: number;
    resolveCovers?: boolean;
}

export async function getCollageAlbums(opts: CollageOptions): Promise<CollageAlbum[]> {
    let albums: CollageAlbum[];

    if (opts.days === 7) {
        const raw = await getTopAlbums(opts.username, '7day', opts.count);
        albums = raw.slice(0, opts.count).map((a) => ({
            name: a.name,
            artist: typeof a.artist === 'string'
                ? a.artist
                : (a.artist as { name?: string; '#text'?: string })?.name
                    ?? (a.artist as { '#text'?: string })?.['#text']
                    ?? '',
            playcount: parseInt(a.playcount ?? '0', 10),
            imageUrl: getImageUrl(a.image),
        }));
    } else {
        const from = getUnixTime(subDays(new Date(), opts.days)).toString();
        const to = getUnixTime(new Date()).toString();
        const tracks = await fetchAllRecentTracks(opts.username, from, to);
        const { albumsMap } = processRecentTracks(tracks);
        albums = Array.from(albumsMap.values())
            .sort((a, b) => b.count - a.count)
            .slice(0, opts.count)
            .map((a) => ({
                name: a.name,
                artist: a.artist,
                playcount: a.count,
                imageUrl: getImageUrl(a.image),
            }));
    }

    if (opts.resolveCovers === false) {
        return albums;
    }

    return resolveCoversBatch(albums, (album) => resolveAlbumCover(album.artist, album.name));
}
