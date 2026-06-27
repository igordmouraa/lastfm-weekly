import { PeriodWrappedData, LastFmPeriod } from '@/types/lastfm';
import { getUserInfo, getTopArtists, getTopTracks, getTopAlbums, mapTopArtists, mapTopTracks, mapTopAlbums } from '../user';
import { getPeriodScrobbleCount } from '../periods';
import { enrichWithImages } from '../resolve-image';
import { cacheAggregator } from '../server-cache';

export interface PeriodWrappedOptions {
    resolveImages?: boolean;
}

async function fetchPeriodWrapped(
    username: string,
    period: LastFmPeriod,
    options: PeriodWrappedOptions = {}
): Promise<PeriodWrappedData> {
    const resolveImages = options.resolveImages !== false;

    const [user, artists, tracks, albums, totalScrobbles] = await Promise.all([
        getUserInfo(username),
        getTopArtists(username, period, 10),
        getTopTracks(username, period, 10),
        getTopAlbums(username, period, 10),
        getPeriodScrobbleCount(username, period),
    ]);

    const mappedArtists = mapTopArtists(artists);
    const mappedTracks = mapTopTracks(tracks);
    const mappedAlbums = mapTopAlbums(albums);

    if (!resolveImages) {
        return {
            user,
            period,
            artists: mappedArtists.map((a) => ({ ...a, imageUrl: null })),
            tracks: mappedTracks.map((t) => ({ ...t, imageUrl: undefined })),
            albums: mappedAlbums.map((a) => ({ ...a, imageUrl: null })),
            totalScrobbles,
        };
    }

    const [enrichedArtists, enrichedAlbums, enrichedTracks] = await Promise.all([
        enrichWithImages(mappedArtists, 'artist'),
        enrichWithImages(mappedAlbums, 'album', (a) => a.artist),
        enrichWithImages(
            mappedTracks.map((t) => ({ name: t.name, artist: t.artist?.name, image: t.image })),
            'track',
            (t) => t.artist
        ),
    ]);

    return {
        user,
        period,
        artists: enrichedArtists,
        tracks: mappedTracks.map((t, i) => ({ ...t, imageUrl: enrichedTracks[i]?.imageUrl ?? undefined })),
        albums: enrichedAlbums,
        totalScrobbles,
    };
}

export const getPeriodWrapped = cacheAggregator(
    'period-wrapped',
    fetchPeriodWrapped,
    {
        revalidate: 600,
        tags: (username, period) => [`lastfm:user:${username}:wrapped:${period}`],
    }
);
