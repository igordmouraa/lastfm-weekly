import { cache } from 'react';
import {
    LastFmUser,
    LastFmPeriod,
    LastFmArtist,
    LastFmTrack,
    LastFmAlbum,
    LastFmTag,
} from '@/types/lastfm';
import { fetchLastFm, asArray, LastFmError } from './client';
import {
    LastFmUserInfoResponse,
    TopArtistsResponse,
    TopTracksResponse,
    TopAlbumsResponse,
    TopTagsResponse,
    FriendsResponse,
} from '@/types/lastfm';

export { LastFmError };

export const getUserInfo = cache(async (username: string): Promise<LastFmUser> => {
    const data = await fetchLastFm<LastFmUserInfoResponse>(
        'user.getInfo',
        { user: username },
        { revalidate: 3600, tags: [`lastfm:user:${username}:info`] }
    );
    return { ...data.user, country: data.user.country || 'Unknown' };
});

export const getTopArtists = cache(async (username: string, period: LastFmPeriod = '7day', limit = 50) => {
    const data = await fetchLastFm<TopArtistsResponse>(
        'user.getTopArtists',
        { user: username, period, limit: String(limit) },
        { revalidate: 600, tags: [`lastfm:user:${username}:top:${period}`] }
    );
    return asArray(data.topartists?.artist);
});

export const getTopTracks = cache(async (username: string, period: LastFmPeriod = '7day', limit = 50) => {
    const data = await fetchLastFm<TopTracksResponse>(
        'user.getTopTracks',
        { user: username, period, limit: String(limit) },
        { revalidate: 600, tags: [`lastfm:user:${username}:top:${period}`] }
    );
    return asArray(data.toptracks?.track);
});

export const getTopAlbums = cache(async (username: string, period: LastFmPeriod = '7day', limit = 50) => {
    const data = await fetchLastFm<TopAlbumsResponse>(
        'user.getTopAlbums',
        { user: username, period, limit: String(limit) },
        { revalidate: 600, tags: [`lastfm:user:${username}:top:${period}`] }
    );
    return asArray(data.topalbums?.album);
});

export const getUserTopTags = cache(async (username: string, limit = 20): Promise<LastFmTag[]> => {
    const data = await fetchLastFm<TopTagsResponse>(
        'user.getTopTags',
        { user: username, limit: String(limit) },
        { revalidate: 3600, tags: [`lastfm:user:${username}:tags`] }
    );
    return asArray(data.toptags?.tag);
});

export const getUserFriends = cache(async (username: string, limit = 50) => {
    const data = await fetchLastFm<FriendsResponse>(
        'user.getFriends',
        { user: username, limit: String(limit) },
        { revalidate: 3600, tags: [`lastfm:user:${username}:friends`] }
    );
    return asArray(data.friends?.user);
});

export function mapTopArtists(artists: LastFmArtist[]) {
    return artists.map((a) => ({
        name: a.name,
        playcount: a.playcount ?? '0',
        image: a.image ?? [],
        url: a.url,
        mbid: a.mbid,
    }));
}

export function mapTopTracks(tracks: LastFmTrack[]) {
    return tracks.map((t) => ({
        name: t.name,
        playcount: t.playcount ?? '0',
        image: t.image ?? [],
        artist: { name: t.artist.name ?? (t.artist as { '#text'?: string })['#text'] ?? '' },
        album: t.album,
        url: t.url,
    }));
}

export function mapTopAlbums(albums: LastFmAlbum[]) {
    return albums.map((a) => ({
        name: a.name,
        artist: typeof a.artist === 'string'
            ? a.artist
            : (a.artist as { name?: string; '#text'?: string })?.name
                ?? (a.artist as { '#text'?: string })?.['#text']
                ?? '',
        playcount: a.playcount ?? '0',
        image: a.image ?? [],
        url: a.url,
    }));
}
