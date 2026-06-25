import { NextResponse } from 'next/server';
import { getNowPlaying } from '@/lib/lastfm/aggregators/now-playing';

interface RouteParams {
    params: Promise<{ username: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
    const { username } = await params;
    const data = await getNowPlaying(username);

    return NextResponse.json(
        {
            ...data,
            lastPlayedAt: data.lastPlayedAt?.toISOString() ?? null,
        },
        { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' } }
    );
}
