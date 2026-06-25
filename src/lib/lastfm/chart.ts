import { asArray, fetchLastFm } from './client';
import {
    ArtistInfoResponse,
    ArtistSimilarResponse,
    ArtistTopTagsResponse,
    TagTopArtistsResponse,
    TagTopAlbumsResponse,
    ChartTopArtistsResponse,
    ChartTopTracksResponse,
    GeoTopArtistsResponse,
    TrackInfoResponse,
} from '@/types/lastfm';

export async function getArtistInfo(name: string) {
    const data = await fetchLastFm<ArtistInfoResponse>(
        'artist.getInfo',
        { artist: name, autocorrect: '1' },
        { revalidate: 86400, tags: [`lastfm:artist:${name}:info`] }
    );
    return data.artist;
}

export async function getTrackInfo(artist: string, track: string) {
    const data = await fetchLastFm<TrackInfoResponse>(
        'track.getInfo',
        { artist, track, autocorrect: '1' },
        { revalidate: 86400, tags: [`lastfm:track:${artist}:${track}:info`] }
    );
    return data.track;
}

export async function getArtistSimilar(name: string, limit = 20) {
    const data = await fetchLastFm<ArtistSimilarResponse>(
        'artist.getSimilar',
        { artist: name, limit: String(limit), autocorrect: '1' },
        { revalidate: 86400 }
    );
    return asArray(data.similarartists?.artist);
}

export async function getArtistTopTags(name: string) {
    const data = await fetchLastFm<ArtistTopTagsResponse>(
        'artist.getTopTags',
        { artist: name, autocorrect: '1' },
        { revalidate: 86400, tags: [`lastfm:artist:${name}:tags`] }
    );
    return asArray(data.toptags?.tag);
}

export async function getTagTopArtists(tag: string, limit = 50) {
    const data = await fetchLastFm<TagTopArtistsResponse>(
        'tag.getTopArtists',
        { tag, limit: String(limit) },
        { revalidate: 3600 }
    );
    return asArray(data.topartists?.artist);
}

export async function getTagTopAlbums(tag: string, limit = 50) {
    const data = await fetchLastFm<TagTopAlbumsResponse>(
        'tag.getTopAlbums',
        { tag, limit: String(limit) },
        { revalidate: 3600 }
    );
    return asArray(data.albums?.album);
}

export async function getGlobalTopArtists(limit = 50) {
    const data = await fetchLastFm<ChartTopArtistsResponse>(
        'chart.getTopArtists',
        { limit: String(limit) },
        { revalidate: 3600 }
    );
    return asArray(data.artists?.artist);
}

export async function getGlobalTopTracks(limit = 50) {
    const data = await fetchLastFm<ChartTopTracksResponse>(
        'chart.getTopTracks',
        { limit: String(limit) },
        { revalidate: 3600 }
    );
    return asArray(data.tracks?.track);
}

export async function getGeoTopArtists(country: string, limit = 50) {
    const data = await fetchLastFm<GeoTopArtistsResponse>(
        'geo.getTopArtists',
        { country, limit: String(limit) },
        { revalidate: 3600 }
    );
    return asArray(data.topartists?.artist);
}
