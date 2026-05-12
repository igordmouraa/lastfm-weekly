import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface DeezerArtist {
    id: number;
    name: string;
    picture_medium: string;
    picture_big: string;
    picture_xl: string;
}

interface DeezerSearchResponse {
    data: DeezerArtist[];
    total: number;
}

/**
 * Busca a imagem de um artista pela Deezer API (gratuita, sem autenticação).
 * Uso: GET /api/artist-image?name=Steely%20Dan
 * Retorna: { imageUrl: string | null }
 */
export async function GET(request: NextRequest) {
    const artistName = request.nextUrl.searchParams.get('name');

    if (!artistName) {
        return NextResponse.json({ imageUrl: null }, { status: 400 });
    }

    try {
        const res = await fetch(
            `https://api.deezer.com/search/artist?q=${encodeURIComponent(artistName)}&limit=1`,
            { next: { revalidate: 86400 } } // Cache por 24h
        );

        if (!res.ok) {
            return NextResponse.json({ imageUrl: null });
        }

        const data: DeezerSearchResponse = await res.json();

        if (data.data && data.data.length > 0) {
            // Priorizar picture_xl > picture_big > picture_medium
            const artist = data.data[0];
            const imageUrl = artist.picture_xl || artist.picture_big || artist.picture_medium;

            return NextResponse.json(
                { imageUrl },
                {
                    headers: {
                        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
                    },
                }
            );
        }

        return NextResponse.json({ imageUrl: null });
    } catch (error) {
        console.error('Deezer API Error:', error);
        return NextResponse.json({ imageUrl: null });
    }
}
