import { z } from 'zod';

export const LastFmImageSchema = z.object({
    size: z.string(),
    '#text': z.string(),
});

export const LastFmArtistSchema = z.object({
    name: z.string(),
    playcount: z.string().optional(),
    mbid: z.string().optional(),
    url: z.string().optional(),
    image: z.array(LastFmImageSchema).optional(),
    listeners: z.string().optional(),
    streamable: z.string().optional(),
});

export const LastFmAlbumSchema = z.object({
    name: z.string(),
    artist: z.union([
        z.string(),
        z.object({
            name: z.string().optional(),
            '#text': z.string().optional(),
        }),
    ]),
    playcount: z.string().optional(),
    image: z.array(LastFmImageSchema).optional(),
    url: z.string().optional(),
    mbid: z.string().optional(),
});

export const LastFmTrackSchema = z.object({
    name: z.string(),
    playcount: z.string().optional(),
    mbid: z.string().optional(),
    url: z.string().optional(),
    artist: z.object({
        name: z.string().optional(),
        '#text': z.string().optional(),
        mbid: z.string().optional(),
        url: z.string().optional(),
    }),
    image: z.array(LastFmImageSchema).optional().default([]),
    album: z
        .object({
            '#text': z.string(),
            mbid: z.string().optional(),
        })
        .optional(),
    date: z
        .object({
            uts: z.string(),
            '#text': z.string(),
        })
        .optional(),
    '@attr': z.object({ nowplaying: z.string().optional() }).optional(),
});

export const RecentTracksResponseSchema = z.object({
    recenttracks: z.object({
        track: z.union([z.array(LastFmTrackSchema), LastFmTrackSchema]),
        '@attr': z.object({
            user: z.string(),
            page: z.string(),
            perPage: z.string(),
            totalPages: z.string(),
            total: z.string(),
        }),
    }),
});

/** Last.fm às vezes omite `period` (e outros campos) em @attr. */
const TopListAttrSchema = z
    .object({
        user: z.string().optional(),
        period: z.string().optional(),
        page: z.string().optional(),
        perPage: z.string().optional(),
        totalPages: z.string().optional(),
        total: z.string().optional(),
    })
    .optional();

export const TopArtistsResponseSchema = z.object({
    topartists: z.object({
        artist: z.union([z.array(LastFmArtistSchema), LastFmArtistSchema]),
        '@attr': TopListAttrSchema,
    }),
});

export const TopAlbumsResponseSchema = z.object({
    topalbums: z.object({
        album: z.union([z.array(LastFmAlbumSchema), LastFmAlbumSchema]),
        '@attr': TopListAttrSchema,
    }),
});

export const TopTracksResponseSchema = z.object({
    toptracks: z.object({
        track: z.union([z.array(LastFmTrackSchema), LastFmTrackSchema]),
        '@attr': TopListAttrSchema,
    }),
});

export const ArtistInfoResponseSchema = z.object({
    artist: LastFmArtistSchema.extend({
        bio: z.object({ summary: z.string(), content: z.string() }).optional(),
        stats: z.object({ listeners: z.string(), playcount: z.string() }).optional(),
    }),
});

export const TrackInfoResponseSchema = z.object({
    track: z.object({
        name: z.string(),
        image: z.array(LastFmImageSchema).optional(),
        album: z
            .object({
                title: z.string().optional(),
                '#text': z.string().optional(),
                image: z.array(LastFmImageSchema).optional(),
            })
            .optional(),
    }),
});
