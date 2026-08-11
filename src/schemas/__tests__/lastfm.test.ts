import { describe, it, expect } from 'vitest';
import { RecentTracksResponseSchema, TopArtistsResponseSchema } from '@/schemas/lastfm';

describe('RecentTracksResponseSchema', () => {
    it('valida payload correto', () => {
        const payload = {
            recenttracks: {
                track: [],
                '@attr': { user: 'x', page: '1', totalPages: '1', total: '0', perPage: '200' },
            },
        };
        expect(RecentTracksResponseSchema.safeParse(payload).success).toBe(true);
    });

    it('falha se @attr.totalPages ausente', () => {
        const payload = { recenttracks: { track: [], '@attr': { user: 'x', page: '1' } } };
        expect(RecentTracksResponseSchema.safeParse(payload).success).toBe(false);
    });
});

describe('TopArtistsResponseSchema', () => {
    it('valida artista único (normalização array)', () => {
        const payload = {
            topartists: {
                artist: { name: 'Radiohead', playcount: '100' },
                '@attr': { user: 'x', period: '7day' },
            },
        };
        expect(TopArtistsResponseSchema.safeParse(payload).success).toBe(true);
    });

    it('valida lista de artistas', () => {
        const payload = {
            topartists: {
                artist: [
                    { name: 'Radiohead', playcount: '100' },
                    { name: 'Pixies', playcount: '50' },
                ],
                '@attr': { user: 'x', period: '7day' },
            },
        };
        expect(TopArtistsResponseSchema.safeParse(payload).success).toBe(true);
    });

    it('falha se artista sem name', () => {
        const payload = {
            topartists: {
                artist: { playcount: '100' },
            },
        };
        expect(TopArtistsResponseSchema.safeParse(payload).success).toBe(false);
    });

    it('aceita @attr sem period (resposta real da API)', () => {
        const payload = {
            topartists: {
                artist: [{ name: 'Radiohead', playcount: '100' }],
                '@attr': { user: 'igordmouraa' },
            },
        };
        expect(TopArtistsResponseSchema.safeParse(payload).success).toBe(true);
    });
});
