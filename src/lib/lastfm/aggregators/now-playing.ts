import { cache } from 'react';
import { fetchLastFm, asArray } from '../client';
import { getValidImageUrl } from '../resolve-image';
import { RecentTracksResponse, LastFmTrack } from '@/types/lastfm';

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

function parseTrack(track: LastFmTrack): NowPlayingData {
    const isLive = track['@attr']?.nowplaying === 'true';
    const artist =
        (track.artist as { '#text'?: string; name?: string })['#text'] ??
        track.artist.name ??
        '';
    const album = track.album?.['#text'];

    return {
        isLive,
        track: {
            name: track.name,
            artist,
            album,
            imageUrl: getValidImageUrl(track.image),
            url: track.url,
        },
        lastPlayedAt: isLive || !track.date?.uts ? null : new Date(parseInt(track.date.uts, 10) * 1000),
    };
}

export const getNowPlaying = cache(async (username: string): Promise<NowPlayingData> => {
    try {
        const data = await fetchLastFm<RecentTracksResponse>(
            'user.getRecentTracks',
            { user: username, limit: '1' },
            { revalidate: 30, tags: [`lastfm:user:${username}:nowplaying`] }
        );

        const tracks = asArray(data.recenttracks.track);
        if (tracks.length === 0) {
            return { isLive: false, track: null, lastPlayedAt: null };
        }

        const parsed = parseTrack(tracks[0]);
        return parsed;
    } catch {
        return { isLive: false, track: null, lastPlayedAt: null };
    }
});
