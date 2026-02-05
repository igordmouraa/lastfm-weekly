import {
    LastFmImage,
    LastFmArtist,
    LastFmTrack,
    UserResponse,
    TopArtistsResponse,
    TopTracksResponse,
    TrackInfoResponse,
    ArtistInfoResponse,
    WeeklyData
} from "@/types/lastfm";

const API_KEY = process.env.NEXT_PUBLIC_LASTFM_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_LASTFM_API_URL;

const hasValidImage = (images: LastFmImage[] | undefined): boolean => {
    return Array.isArray(images) && images.some(img => img['#text'] && img['#text'].trim() !== '');
};

export async function getLastFmData<T>(method: string, params: Record<string, string>): Promise<T | null> {
    const query = new URLSearchParams({
        method,
        api_key: API_KEY!,
        format: 'json',
        ...params
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
        const res = await fetch(`${BASE_URL}?${query.toString()}`, {
            signal: controller.signal,
            headers: { 'User-Agent': 'LastfmWeekly/1.0' },
            next: { revalidate: 0 }
        });
        clearTimeout(timeoutId);

        if (!res.ok) return null;

        const data = await res.json();

        if ((data as any).error) return null;

        return data as T;
    } catch {
        return null;
    }
}

async function getBetterTrackImage(artist: string, trackName: string, originalImage: LastFmImage[]) {
    const data = await getLastFmData<TrackInfoResponse>('track.getInfo', {
        artist,
        track: trackName,
        autocorrect: '1'
    });

    const albumImage = data?.track?.album?.image;

    if (hasValidImage(albumImage)) {
        return albumImage!;
    }

    return originalImage;
}

async function getBetterArtistImage(artistName: string, originalImage: LastFmImage[]) {
    const data = await getLastFmData<ArtistInfoResponse>('artist.getInfo', {
        artist: artistName,
        autocorrect: '1'
    });

    const artistImage = data?.artist?.image;

    if (hasValidImage(artistImage)) {
        return artistImage!;
    }

    return originalImage;
}

export async function getUserWeeklyWrapped(username: string): Promise<WeeklyData> {
    const [userInfo, topArtistsRes, topTracksRes] = await Promise.all([
        getLastFmData<UserResponse>('user.getInfo', { user: username }),
        getLastFmData<TopArtistsResponse>('user.getTopArtists', { user: username, period: '7day', limit: '5' }),
        getLastFmData<TopTracksResponse>('user.getTopTracks', { user: username, period: '7day', limit: '5' }),
    ]);

    if (!userInfo?.user || !topArtistsRes?.topartists || !topTracksRes?.toptracks) {
        throw new Error("Falha fatal ao carregar dados iniciais.");
    }

    const rawArtists = topArtistsRes.topartists.artist;
    const artists = Array.isArray(rawArtists) ? rawArtists : [rawArtists];

    const rawTracks = topTracksRes.toptracks.track;
    const tracks = Array.isArray(rawTracks) ? rawTracks : [rawTracks];

    const tracksWithImages = await Promise.all(tracks.map(async (track: LastFmTrack) => {
        const betterImage = await getBetterTrackImage(track.artist.name, track.name, track.image);
        return { ...track, image: betterImage };
    }));

    const artistsWithImages = await Promise.all(artists.map(async (artist: LastFmArtist) => {
        const betterImage = await getBetterArtistImage(artist.name, artist.image);
        return { ...artist, image: betterImage };
    }));

    const totalScrobbles = artistsWithImages.reduce((acc: number, artist: LastFmArtist) => acc + (parseInt(artist.playcount || '0') || 0), 0);

    return {
        user: userInfo.user,
        artists: artistsWithImages,
        tracks: tracksWithImages,
        totalScrobbles: totalScrobbles,
        period: 'Últimos 7 Dias'
    };
}