// types/lastfm.ts

export interface LastFmImage {
    size: string;
    "#text": string;
}

export interface LastFmArtist {
    name: string;
    playcount?: string;
    mbid?: string;
    url?: string;
    image?: LastFmImage[]; // Opcional, pois nem sempre temos a imagem do artista no recentTracks
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
    // AQUI está a imagem do álbum que aparece na música
    image: LastFmImage[];
    album?: {
        "#text": string;
        mbid?: string;
    };
    date?: {
        uts: string;
        "#text": string;
    };
}

export interface LastFmUser {
    name: string;
    image: LastFmImage[];
    country?: string; // Opcional para evitar erros
    playcount: string;
}

// Resposta da API user.getInfo
export interface LastFmUserInfoResponse {
    user: LastFmUser;
}

// Resposta da API user.getRecentTracks (Estrutura completa para uso se necessário)
export interface RecentTracksResponse {
    recenttracks: {
        track: LastFmTrack[];
        '@attr': {
            user: string;
            page: string;
            perPage: string;
            totalPages: string;
            total: string;
        };
    };
}

// Estrutura final que vai para o Front-end
export interface WeeklyData {
    user: LastFmUser;
    artists: LastFmArtist[];
    tracks: LastFmTrack[];
    totalScrobbles: number;
}