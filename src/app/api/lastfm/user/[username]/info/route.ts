import { NextRequest, NextResponse } from 'next/server';
import { getUserInfo } from '@/lib/lastfm/user';
import { LastFmError } from '@/lib/lastfm/client';

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ username: string }> }
) {
    const { username } = await params;

    try {
        const user = await getUserInfo(username);
        return NextResponse.json(user, {
            headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate=7200' },
        });
    } catch (err) {
        if (err instanceof LastFmError) {
            const status = err.status === 6 ? 404 : 502;
            return NextResponse.json({ error: 'Usuário não encontrado.' }, { status });
        }
        return NextResponse.json({ error: 'Erro ao buscar usuário.' }, { status: 500 });
    }
}
