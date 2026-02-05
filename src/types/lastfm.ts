export interface LastFmImage {
    size: string;
    "#text": string;
}

export interface LastFmArtist {
    name: string;
    playcount?: string;
    mbid?: string;
    url?: string;
    image: LastFmImage[];
}

export interface LastFmTrack {
    name: string;
    playcount?: string;
    mbid?: string;
    url?: string;
    artist: {
        name: string;
        mbid?: string;
        url?: string;
    };
    image: LastFmImage[];
}

export interface LastFmUser {
    name: string;
    image: LastFmImage[];
    country: string;
    playcount: string;
}

export interface UserResponse {
    user: LastFmUser;
    error?: number;
    message?: string;
}

export interface TopArtistsResponse {
    topartists: {
        artist: LastFmArtist[];
    };
    error?: number;
    message?: string;
}

export interface TopTracksResponse {
    toptracks: {
        track: LastFmTrack[];
    };
    error?: number;
    message?: string;
}

export interface TrackInfoResponse {
    track: {
        album?: {
            image: LastFmImage[];
        };
    };
    error?: number;
    message?: string;
}

export interface ArtistInfoResponse {
    artist: {
        image: LastFmImage[];
    };
    error?: number;
    message?: string;
}

export interface WeeklyData {
    user: LastFmUser;
    artists: LastFmArtist[];
    tracks: LastFmTrack[];
    totalScrobbles: number;
    period: string;
}