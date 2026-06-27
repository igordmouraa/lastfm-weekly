import { NextRequest, NextResponse } from 'next/server';
import { getCachedTrackCover } from '@/lib/lastfm/images';

export async function GET(request: NextRequest) {
    const artist = request.nextUrl.searchParams.get('artist');
    const track = request.nextUrl.searchParams.get('track');

    if (!artist || !track) {
        return NextResponse.json({ imageUrl: null }, { status: 400 });
    }

    const imageUrl = await getCachedTrackCover(artist, track, true);
    return NextResponse.json(
        { imageUrl },
        { headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=86400' } }
    );
}
