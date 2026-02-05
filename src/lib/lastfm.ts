import {
    WeeklyData,
    LastFmUserInfoResponse,
    LastFmImage
} from "@/types/lastfm";
import { startOfWeek, endOfWeek, getUnixTime } from 'date-fns';

const API_KEY = process.env.NEXT_PUBLIC_LASTFM_API_KEY;
const API_BASE = 'https://ws.audioscrobbler.com/2.0/';


interface RecentTrackArtist {
    '#text': string;
    mbid: string;
}

interface RecentTrack {
    artist: RecentTrackArtist;
    name: string;
    image: LastFmImage[];
    album: { '#text': string; mbid: string };
    url: string;
    date?: { uts: string; '#text': string };
    '@attr'?: { nowplaying: string };
}

interface RecentTracksResponse {
    recenttracks: {
        track: RecentTrack[];
        '@attr': {
            user: string;
            page: string;
            perPage: string;
            totalPages: string;
            total: string;
        };
    };
}

async function fetchLastFm<T>(method: string, params: Record<string, string>): Promise<T> {
    const url = new URL(API_BASE);
    url.searchParams.append('method', method);
    url.searchParams.append('api_key', API_KEY || '');
    url.searchParams.append('format', 'json');

    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
    });

    const res = await fetch(url.toString(), {
        next: { revalidate: 30 }
    });

    if (!res.ok) throw new Error(`Last.fm API Error: ${res.statusText}`);
    return res.json() as Promise<T>;
}

const hasValidImageURL = (images: LastFmImage[] | undefined): boolean => {
    if (!images || !Array.isArray(images) || images.length === 0) return false;
    return images.some(img => img['#text'] && img['#text'].trim() !== '');
};

export async function getUserWeeklyWrapped(username: string): Promise<WeeklyData> {
    const now = new Date();

    const fromDate = startOfWeek(now, { weekStartsOn: 5 });
    const toDate = endOfWeek(now, { weekStartsOn: 5 });

    const from = getUnixTime(fromDate).toString();
    const to = getUnixTime(toDate).toString();

    const [userInfoData, recentTracksData] = await Promise.all([
        fetchLastFm<LastFmUserInfoResponse>('user.getInfo', { user: username }),
        fetchLastFm<RecentTracksResponse>('user.getRecentTracks', {
            user: username,
            from,
            to,
            limit: '1000'
        })
    ]);

    const tracksMap = new Map<string, { name: string, artist: string, image: LastFmImage[], count: number }>();
    const artistsMap = new Map<string, { name: string, count: number }>();

    const rawTracks = recentTracksData.recenttracks.track;
    const trackList = Array.isArray(rawTracks) ? rawTracks : (rawTracks ? [rawTracks] : []);

    const apiTotal = recentTracksData.recenttracks['@attr'].total;
    const weeklyScrobbles = parseInt(apiTotal, 10) || trackList.length;

    if (trackList.length > 0) {
        trackList.forEach((track) => {
            const artistName = track.artist['#text'];
            const trackName = track.name;
            const trackKey = `${trackName}-${artistName}`;

            const currentTrackHasImage = hasValidImageURL(track.image);

            if (!tracksMap.has(trackKey)) {
                tracksMap.set(trackKey, {
                    name: trackName,
                    artist: artistName,
                    image: track.image,
                    count: 0
                });
            }

            const trackEntry = tracksMap.get(trackKey)!;
            trackEntry.count += 1;

            const storedEntryHasImage = hasValidImageURL(trackEntry.image);

            if (!storedEntryHasImage && currentTrackHasImage) {
                trackEntry.image = track.image;
            }

            if (!artistsMap.has(artistName)) {
                artistsMap.set(artistName, { name: artistName, count: 0 });
            }
            const artistEntry = artistsMap.get(artistName)!;
            artistEntry.count += 1;
        });
    }

    const sortedTracks = Array.from(tracksMap.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    const sortedArtists = Array.from(artistsMap.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    return {
        user: {
            name: userInfoData.user.name,
            image: userInfoData.user.image,
            playcount: userInfoData.user.playcount,
            country: userInfoData.user.country || 'Unknown'
        },
        tracks: sortedTracks.map(t => ({
            name: t.name,
            artist: { name: t.artist },
            image: t.image,
            playcount: t.count.toString()
        })),
        artists: sortedArtists.map(a => ({
            name: a.name,
            playcount: a.count.toString(),
            image: []
        })),
        totalScrobbles: weeklyScrobbles
    };
}