import { ProfileData, LastFmPeriod } from '@/types/lastfm';
import { getUserInfo, getTopArtists, getTopTracks, getTopAlbums, getUserTopTags, mapTopArtists, mapTopTracks, mapTopAlbums } from '../user';
import { getPeriodScrobbleCount } from '../periods';

export async function getProfileData(username: string, period: LastFmPeriod = '7day'): Promise<ProfileData> {
    const [user, artists, tracks, albums, tags, totalScrobbles] = await Promise.all([
        getUserInfo(username),
        getTopArtists(username, period, 10),
        getTopTracks(username, period, 10),
        getTopAlbums(username, period, 10),
        getUserTopTags(username, 15),
        getPeriodScrobbleCount(username, period),
    ]);

    return {
        user,
        period,
        artists: mapTopArtists(artists),
        tracks: mapTopTracks(tracks),
        albums: mapTopAlbums(albums),
        tags,
        totalScrobbles,
    };
}
