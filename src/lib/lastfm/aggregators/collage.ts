import { subDays, getUnixTime } from 'date-fns';
import { getImageUrl } from '@/lib/images';
import { CollageAlbum, CollageDays, parseDays, parseGridSize } from '@/lib/semaninha-params';
import { getCachedAlbumCover, resolveCoversBatch } from '../images';
import { fetchAllRecentTracks } from '../client';
import { getTopAlbums } from '../user';
import { processRecentTracks } from './recent-tracks';
import { cacheAggregator } from '../server-cache';

export type { CollageAlbum, CollageDays };
export { parseDays, parseGridSize };

export interface CollageOptions {
    username: string;
    days: CollageDays;
    count: number;
    resolveCovers?: boolean;
}

async function fetchCollageAlbums(opts: CollageOptions): Promise<CollageAlbum[]> {
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
            imageUrl: getImageUrl(a.image, 'large'),
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
                imageUrl: getImageUrl(a.image, 'large'),
            }));
    }

    if (opts.resolveCovers === false) {
        return albums;
    }

    return resolveCoversBatch(albums, (album) => getCachedAlbumCover(album.artist, album.name));
}

export const getCollageAlbums = cacheAggregator(
    'collage',
    fetchCollageAlbums,
    {
        revalidate: 300,
        tags: (opts) => [
            `lastfm:user:${opts.username}:collage`,
            `lastfm:user:${opts.username}:collage:${opts.days}:${opts.count}`,
        ],
    }
);
