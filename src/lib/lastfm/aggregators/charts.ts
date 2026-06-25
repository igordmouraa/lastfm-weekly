import { getGlobalTopArtists, getGlobalTopTracks } from '../chart';
import { enrichWithImages } from '../resolve-image';

export async function getChartsData(limit = 20) {
    const [artists, tracks] = await Promise.all([
        getGlobalTopArtists(limit),
        getGlobalTopTracks(limit),
    ]);

    const mappedArtists = artists.map((a) => ({
        name: a.name,
        playcount: a.playcount,
        image: a.image,
    }));

    const mappedTracks = tracks.map((t) => ({
        name: t.name,
        playcount: t.playcount,
        image: t.image,
        artist:
            t.artist?.name ??
            (t.artist as { '#text'?: string })?.['#text'] ??
            '',
    }));

    const [enrichedArtists, enrichedTracks] = await Promise.all([
        enrichWithImages(mappedArtists, 'artist'),
        enrichWithImages(mappedTracks, 'track', (t) => t.artist),
    ]);

    return {
        artists: enrichedArtists.map((a) => ({
            name: a.name,
            playcount: a.playcount,
            imageUrl: a.imageUrl,
        })),
        tracks: enrichedTracks.map((t, i) => ({
            name: t.name,
            playcount: mappedTracks[i]?.playcount,
            imageUrl: t.imageUrl,
            artist: mappedTracks[i]?.artist ?? '',
        })),
    };
}
