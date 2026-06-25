import { NextRequest, NextResponse } from 'next/server';
import { getCollageAlbums } from '@/lib/lastfm/aggregators/collage';
import { parseDays, CollageCount } from '@/lib/semaninha-params';
import { LastFmError } from '@/lib/lastfm/client';

interface RouteParams {
    params: Promise<{ username: string }>;
}

const VALID_COUNTS = new Set<CollageCount>([9, 25, 100]);

export async function GET(request: NextRequest, { params }: RouteParams) {
    const { username } = await params;
    const days = parseDays(request.nextUrl.searchParams.get('days') ?? '7');
    const countParam = parseInt(request.nextUrl.searchParams.get('count') ?? '25', 10);
    const count = (VALID_COUNTS.has(countParam as CollageCount) ? countParam : 25) as CollageCount;

    try {
        const albums = await getCollageAlbums({ username, days, count, resolveCovers: true });
        return NextResponse.json(albums, {
            headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
        });
    } catch (err) {
        if (err instanceof LastFmError) {
            const status = err.status === 6 ? 404 : 502;
            return NextResponse.json({ error: 'Não foi possível carregar os álbuns.' }, { status });
        }
        return NextResponse.json({ error: 'Erro ao buscar álbuns.' }, { status: 500 });
    }
}
