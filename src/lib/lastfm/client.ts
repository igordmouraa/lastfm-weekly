import { z } from 'zod';
import { RecentTracksResponseSchema } from '@/schemas/lastfm';

const API_BASE = 'https://ws.audioscrobbler.com/2.0/';

export class LastFmError extends Error {
    constructor(
        public status: number,
        public method: string,
        message?: string
    ) {
        super(message ?? `Last.fm ${method} failed: ${status}`);
        this.name = 'LastFmError';
    }
}

export function asArray<T>(value: T | T[] | undefined | null): T[] {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
}

export async function fetchLastFm<T>(
    method: string,
    params: Record<string, string>,
    options?: { revalidate?: number; tags?: string[]; schema?: z.ZodType }
): Promise<T> {
    const apiKey = process.env.LASTFM_API_KEY;
    if (!apiKey) {
        throw new LastFmError(0, method, 'LASTFM_API_KEY not configured');
    }

    const url = new URL(API_BASE);
    url.searchParams.set('method', method);
    url.searchParams.set('api_key', apiKey);
    url.searchParams.set('format', 'json');
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

    const res = await fetch(url.toString(), {
        next: {
            revalidate: options?.revalidate ?? 300,
            tags: options?.tags ?? [`lastfm:${params.user ?? method}`],
        },
    });

    if (!res.ok) {
        throw new LastFmError(res.status, method);
    }

    const data = await res.json();
    if (data.error) {
        throw new LastFmError(Number(data.error), method, data.message);
    }

    if (options?.schema) {
        const parsed = options.schema.safeParse(data);
        if (!parsed.success) {
            console.warn(`[lastfm] Schema diverge em "${method}":`, parsed.error.issues);
            // retorna dado cru para não quebrar o fluxo
        }
    }

    return data as T;
}

export async function fetchAllRecentTracks(
    user: string,
    from: string,
    to: string
): Promise<import('@/types/lastfm').LastFmTrack[]> {
    const all: import('@/types/lastfm').LastFmTrack[] = [];
    let page = 1;
    let totalPages = 1;

    do {
        const data = await fetchLastFm<import('@/types/lastfm').RecentTracksResponse>(
            'user.getRecentTracks',
            { user, from, to, page: String(page), limit: '1000' },
            {
                revalidate: 120,
                tags: [`lastfm:user:${user}:recent`],
                schema: RecentTracksResponseSchema,
            }
        );
        all.push(...asArray(data.recenttracks.track));
        totalPages = parseInt(data.recenttracks['@attr'].totalPages, 10) || 1;
        if (page < totalPages) {
            await new Promise((r) => setTimeout(r, 250));
        }
        page++;
    } while (page <= totalPages);

    return all;
}
