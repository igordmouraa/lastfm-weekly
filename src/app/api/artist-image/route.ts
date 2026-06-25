import { NextRequest, NextResponse } from 'next/server';
import { resolveArtistCover } from '@/lib/lastfm/images';

export async function GET(request: NextRequest) {
    const artistName = request.nextUrl.searchParams.get('name');

    if (!artistName) {
        return NextResponse.json({ imageUrl: null }, { status: 400 });
    }

    const imageUrl = await resolveArtistCover(artistName);
    return NextResponse.json(
        { imageUrl },
        { headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=86400' } }
    );
}
