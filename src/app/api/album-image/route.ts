import { NextRequest, NextResponse } from 'next/server';
import { resolveAlbumCover } from '@/lib/lastfm/images';

export async function GET(request: NextRequest) {
    const artist = request.nextUrl.searchParams.get('artist');
    const album = request.nextUrl.searchParams.get('album');

    if (!artist || !album) {
        return NextResponse.json({ imageUrl: null }, { status: 400 });
    }

    const imageUrl = await resolveAlbumCover(artist, album);
    return NextResponse.json(
        { imageUrl },
        { headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=86400' } }
    );
}
