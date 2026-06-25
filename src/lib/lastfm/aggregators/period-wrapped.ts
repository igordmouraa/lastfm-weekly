import { PeriodWrappedData, LastFmPeriod } from '@/types/lastfm';
import { getUserInfo, getTopArtists, getTopTracks, getTopAlbums, mapTopArtists, mapTopTracks, mapTopAlbums } from '../user';
import { getPeriodScrobbleCount } from '../periods';
import { enrichWithImages } from '../resolve-image';

export async function getPeriodWrapped(username: string, period: LastFmPeriod): Promise<PeriodWrappedData> {
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
