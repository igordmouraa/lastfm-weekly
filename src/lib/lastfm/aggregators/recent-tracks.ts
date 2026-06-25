import { format } from 'date-fns';
import { LastFmImage, LastFmTrack } from '@/types/lastfm';
import { hasValidImageURL } from '@/lib/images';

export interface ProcessedTracks {
    tracksMap: Map<string, { name: string; artist: string; image: LastFmImage[]; count: number }>;
    artistsMap: Map<string, { name: string; count: number; image: LastFmImage[] }>;
    albumsMap: Map<string, { name: string; artist: string; image: LastFmImage[]; count: number }>;
    dailyMap: Map<string, number>;
    artistDailyMap: Map<string, Map<string, number>>;
}

export function processRecentTracks(trackList: LastFmTrack[]): ProcessedTracks {
    const tracksMap = new Map<string, { name: string; artist: string; image: LastFmImage[]; count: number }>();
    const artistsMap = new Map<string, { name: string; count: number; image: LastFmImage[] }>();
    const albumsMap = new Map<string, { name: string; artist: string; image: LastFmImage[]; count: number }>();
    const dailyMap = new Map<string, number>();
    const artistDailyMap = new Map<string, Map<string, number>>();

    trackList.forEach((track) => {
        const artistName = (track.artist as { '#text'?: string; name?: string })['#text'] ?? track.artist.name ?? '';
        const trackName = track.name;
        const trackKey = `${trackName}-${artistName}`;
        const currentTrackHasImage = hasValidImageURL(track.image);

        if (!tracksMap.has(trackKey)) {
            tracksMap.set(trackKey, { name: trackName, artist: artistName, image: track.image, count: 0 });
        }
        const trackEntry = tracksMap.get(trackKey)!;
        trackEntry.count += 1;
        if (!hasValidImageURL(trackEntry.image) && currentTrackHasImage) {
            trackEntry.image = track.image;
        }

        if (!artistsMap.has(artistName)) {
            artistsMap.set(artistName, { name: artistName, count: 0, image: [] });
        }
        const artistEntry = artistsMap.get(artistName)!;
        artistEntry.count += 1;
        if (!hasValidImageURL(artistEntry.image) && currentTrackHasImage) {
            artistEntry.image = track.image;
        }

        const albumName = track.album?.['#text'];
        if (albumName) {
            const albumKey = `${albumName}-${artistName}`;
            if (!albumsMap.has(albumKey)) {
                albumsMap.set(albumKey, { name: albumName, artist: artistName, image: track.image, count: 0 });
            }
            const albumEntry = albumsMap.get(albumKey)!;
            albumEntry.count += 1;
            if (!hasValidImageURL(albumEntry.image) && currentTrackHasImage) {
                albumEntry.image = track.image;
            }
        }

        if (track.date?.uts) {
            const dateStr = format(new Date(parseInt(track.date.uts, 10) * 1000), 'yyyy-MM-dd');
            dailyMap.set(dateStr, (dailyMap.get(dateStr) || 0) + 1);
            if (!artistDailyMap.has(artistName)) {
                artistDailyMap.set(artistName, new Map());
            }
            const artistDays = artistDailyMap.get(artistName)!;
            artistDays.set(dateStr, (artistDays.get(dateStr) || 0) + 1);
        }
    });

    return { tracksMap, artistsMap, albumsMap, dailyMap, artistDailyMap };
}
