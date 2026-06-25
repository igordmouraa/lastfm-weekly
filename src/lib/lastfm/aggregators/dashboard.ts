import { DashboardData, LastFmPeriod } from '@/types/lastfm';
import {
    getUserInfo,
    getTopArtists,
    getTopTracks,
    getTopAlbums,
    getUserTopTags,
    mapTopArtists,
    mapTopTracks,
    mapTopAlbums,
} from '../user';
import { getPeriodScrobbleCount } from '../periods';
import { getNowPlaying } from './now-playing';
import { enrichWithImages, getValidImageUrl } from '../resolve-image';

export async function getDashboardData(
    username: string,
    period: LastFmPeriod = '7day'
): Promise<DashboardData> {
    const [user, artists, tracks, albums, tags, periodScrobbles, nowPlaying] = await Promise.all([
        getUserInfo(username),
        getTopArtists(username, period, 5),
        getTopTracks(username, period, 5),
        getTopAlbums(username, period, 9),
        getUserTopTags(username, 12),
        getPeriodScrobbleCount(username, period),
        getNowPlaying(username),
    ]);

    const mappedArtists = mapTopArtists(artists);
    const mappedTracks = mapTopTracks(tracks);
    const mappedAlbums = mapTopAlbums(albums);

    const [enrichedArtists, enrichedAlbums] = await Promise.all([
        enrichWithImages(mappedArtists, 'artist'),
        enrichWithImages(
            mappedAlbums.slice(0, 9).map((a) => ({
                name: a.name,
                artist: a.artist,
                image: a.image,
            })),
            'album',
            (item) => item.artist
        ),
    ]);

    const collagePreview = enrichedAlbums.map((a, i) => ({
        name: a.name,
        artist: mappedAlbums[i]?.artist ?? a.artist ?? '',
        playcount: parseInt(mappedAlbums[i]?.playcount ?? '0', 10),
        imageUrl: a.imageUrl ?? getValidImageUrl(mappedAlbums[i]?.image),
    }));

    return {
        user,
        period,
        artists: enrichedArtists,
        tracks: mappedTracks,
        albums: mappedAlbums,
        tags,
        periodScrobbles,
        collagePreview,
        totalScrobbles: parseInt(user.playcount, 10) || 0,
        nowPlaying,
    };
}
