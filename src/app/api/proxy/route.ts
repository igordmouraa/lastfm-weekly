import { NextRequest, NextResponse } from 'next/server';
import { isAllowedImageHost } from '@/lib/image-hosts';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    const url = request.nextUrl.searchParams.get('url');

    if (!url) {
        return new NextResponse('Missing URL', { status: 400 });
    }

    try {
        const parsed = new URL(url);
        if (!isAllowedImageHost(parsed.hostname)) {
            return new NextResponse('Domain not allowed', { status: 403 });
        }

        const response = await fetch(url, { next: { revalidate: 86400 } });
        if (!response.ok) throw new Error('Failed to fetch image');

        const contentType = response.headers.get('content-type') || 'image/jpeg';
        const arrayBuffer = await response.arrayBuffer();

        return new NextResponse(arrayBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800, immutable',
                'CDN-Cache-Control': 'public, max-age=86400',
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch {
        return new NextResponse('Failed to fetch image', { status: 502 });
    }
}
