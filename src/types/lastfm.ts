export interface LastFmImage {
    size: string;
    "#text": string;
}

export interface LastFmArtist {
    name: string;
    playcount?: string;
    mbid?: string;
    url?: string;
    image?: LastFmImage[];
    rank?: string;
    listeners?: string;
    streamable?: string;
}

export interface LastFmAlbum {
    name: string;
    artist: string | { name?: string; '#text'?: string };
    playcount?: string;
    image?: LastFmImage[];
    url?: string;
    mbid?: string;
}

export interface DailyStats {
    date: string;
    count: number;
}

export interface LastFmTrack {
    name: string;
    playcount?: string;
    mbid?: string;
    url?: string;
    artist: {
        name?: string;
        '#text'?: string;
        mbid?: string;
        url?: string;
    };
    image: LastFmImage[];
    album?: {
        "#text": string;
        mbid?: string;
    };
    date?: {
        uts: string;
        '#text': string;
    };
    '@attr'?: { nowplaying?: string };
}

export interface LastFmUser {
    name: string;
    image: LastFmImage[];
    country?: string;
    playcount: string;
    registered?: { unixtime: string; '#text': string };
    url?: string;
}

export interface LastFmTag {
    name: string;
    count?: number;
    url?: string;
}

export type LastFmPeriod = '7day' | '1month' | '3month' | '6month' | '12month' | 'overall';

export interface LastFmUserInfoResponse {
    user: LastFmUser;
}

export interface RecentTracksResponse {
    recenttracks: {
        track: LastFmTrack | LastFmTrack[];
        '@attr': {
            user: string;
            page: string;
            perPage: string;
            totalPages: string;
            total: string;
        };
    };
}

export interface TopArtistsResponse {
    topartists: {
        artist: LastFmArtist | LastFmArtist[];
        '@attr'?: { user: string; period: string };
    };
}

export interface TopTracksResponse {
    toptracks: {
        track: LastFmTrack | LastFmTrack[];
        '@attr'?: { user: string; period: string };
    };
}

export interface TopAlbumsResponse {
    topalbums: {
        album: LastFmAlbum | LastFmAlbum[];
        '@attr'?: { user: string; period: string };
    };
}

export interface TopTagsResponse {
    toptags: {
        tag: LastFmTag | LastFmTag[];
    };
}

export interface ArtistTopTagsResponse {
    toptags: {
        tag: LastFmTag | LastFmTag[];
        '@attr'?: { artist: string };
    };
}

export interface ArtistInfoResponse {
    artist: LastFmArtist & {
        bio?: { summary: string; content: string };
        stats?: { listeners: string; playcount: string };
    };
}

export interface TrackInfoResponse {
    track: {
        name: string;
        image?: LastFmImage[];
        album?: {
            title?: string;
            '#text'?: string;
            image?: LastFmImage[];
        };
    };
}

export interface ArtistSimilarResponse {
    similarartists: {
        artist: LastFmArtist | LastFmArtist[];
    };
}

export interface TagTopArtistsResponse {
    topartists: {
        artist: LastFmArtist | LastFmArtist[];
    };
}

export interface TagTopAlbumsResponse {
    albums: {
        album: LastFmAlbum | LastFmAlbum[];
    };
}

export interface ChartTopArtistsResponse {
    artists: {
        artist: LastFmArtist | LastFmArtist[];
    };
}

export interface ChartTopTracksResponse {
    tracks: {
        track: LastFmTrack | LastFmTrack[];
    };
}

export interface GeoTopArtistsResponse {
    topartists: {
        artist: LastFmArtist | LastFmArtist[];
    };
}

export interface LastFmFriend {
    name: string;
    realname?: string;
    image?: LastFmImage[];
}

export interface FriendsResponse {
    friends: {
        user: LastFmFriend | LastFmFriend[];
    };
}

export interface PrevWeekData {
    totalScrobbles: number;
    uniqueArtistCount: number;
    uniqueAlbumCount: number;
    uniqueTrackCount: number;
    dailyStats: DailyStats[];
    artistNames: string[];
    albumKeys: string[];
    trackKeys: string[];
}

export interface WeightedTag {
    name: string;
    count: number;
}

export interface DailyTagData {
    date: string;
    [tagName: string]: string | number;
}

export interface WeeklyData {
    user: LastFmUser;
    artists: LastFmArtist[];
    tracks: LastFmTrack[];
    albums: LastFmAlbum[];
    dailyStats: DailyStats[];
    busiestDay: { date: string; count: number } | null;
    totalScrobbles: number;
    uniqueArtistCount: number;
    uniqueAlbumCount: number;
    uniqueTrackCount: number;
    prevWeekData: PrevWeekData;
    topTags: WeightedTag[];
    dailyTagData: DailyTagData[];
}

export interface ProfileData {
    user: LastFmUser;
    period: LastFmPeriod;
    artists: LastFmArtist[];
    tracks: LastFmTrack[];
    albums: LastFmAlbum[];
    tags: LastFmTag[];
    totalScrobbles: number;
}

export interface PeriodWrappedData {
    user: LastFmUser;
    period: LastFmPeriod;
    artists: (LastFmArtist & { imageUrl?: string | null })[];
    tracks: (LastFmTrack & { imageUrl?: string | null })[];
    albums: (LastFmAlbum & { imageUrl?: string | null })[];
    totalScrobbles: number;
}

export interface CollagePreviewItem {
    name: string;
    artist: string;
    playcount: number;
    imageUrl: string | null;
}

export interface NowPlayingData {
    isLive: boolean;
    track: {
        name: string;
        artist: string;
        album?: string;
        imageUrl: string | null;
        url?: string;
    } | null;
    lastPlayedAt: Date | null;
}

export interface DashboardData {
    user: LastFmUser;
    period: LastFmPeriod;
    artists: (LastFmArtist & { imageUrl?: string | null })[];
    tracks: LastFmTrack[];
    albums: LastFmAlbum[];
    tags: LastFmTag[];
    periodScrobbles: number;
    totalScrobbles: number;
    collagePreview: CollagePreviewItem[];
    nowPlaying: NowPlayingData;
}
