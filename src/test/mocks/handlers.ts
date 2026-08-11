import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

export const handlers = [
    http.get('https://ws.audioscrobbler.com/2.0/', ({ request }) => {
        const url = new URL(request.url);
        const method = url.searchParams.get('method');

        if (method === 'user.getTopArtists') {
            return HttpResponse.json({
                topartists: {
                    artist: [{ name: 'Radiohead', playcount: '100', image: [] }],
                    '@attr': { user: 'testuser', period: '7day' },
                },
            });
        }

        if (method === 'user.getRecentTracks') {
            return HttpResponse.json({
                recenttracks: {
                    track: [],
                    '@attr': {
                        user: 'testuser',
                        page: '1',
                        perPage: '200',
                        totalPages: '1',
                        total: '0',
                    },
                },
            });
        }

        return HttpResponse.json({ error: 6, message: 'User not found' });
    }),

    http.get('https://api.deezer.com/search/album', () =>
        HttpResponse.json({
            data: [{ cover_xl: 'https://cdn-images.dzcdn.net/images/cover/abc/1000x1000.jpg' }],
        })
    ),

    http.get('https://api.deezer.com/search/artist', () =>
        HttpResponse.json({
            data: [{ picture_xl: 'https://cdn-images.dzcdn.net/images/artist/abc/1000x1000.jpg' }],
        })
    ),

    http.get('https://itunes.apple.com/search', () =>
        HttpResponse.json({
            results: [{ artworkUrl100: 'https://is1-ssl.mzstatic.com/image/thumb/abc/100x100bb.jpg' }],
        })
    ),
];

export const server = setupServer(...handlers);
