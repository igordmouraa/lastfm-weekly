import { NextResponse } from 'next/server';
import { getUserInfo } from '@/lib/lastfm/user';
import { LastFmError } from '@/lib/lastfm/client';
import { getImageUrl, optimizeImageUrl } from '@/lib/images';
import {
    clearSessionCookie,
    getCurrentUser,
    setSessionCookie,
} from '@/lib/session/cookies';
import { isValidUsername, normalizeUsername, isSessionConfigured } from '@/lib/session/index';

function sessionAvatarUrl(images: Parameters<typeof getImageUrl>[0]): string | null {
    const url = getImageUrl(images, 'thumb');
    return url ? optimizeImageUrl(url, 36) : null;
}

async function sessionPayload(username: string | null) {
    if (!username) {
        return { username: null as string | null, avatarUrl: null as string | null };
    }
    try {
        const user = await getUserInfo(username);
        return { username, avatarUrl: sessionAvatarUrl(user.image) };
    } catch {
        return { username, avatarUrl: null as string | null };
    }
}

export async function GET() {
    const username = await getCurrentUser();
    const payload = await sessionPayload(username);
    return NextResponse.json(payload, {
        headers: { 'Cache-Control': 'private, no-cache' },
    });
}

export async function POST(request: Request) {
    let body: { username?: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const raw = body.username?.trim();
    if (!raw || !isValidUsername(raw)) {
        return NextResponse.json({ error: 'Invalid username' }, { status: 400 });
    }

    const username = normalizeUsername(raw);

    if (!isSessionConfigured()) {
        return NextResponse.json({ error: 'Session not configured' }, { status: 503 });
    }

    let user;
    try {
        user = await getUserInfo(username);
    } catch (err) {
        if (err instanceof LastFmError && (err.status === 6 || err.status === 404)) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        throw err;
    }

    await setSessionCookie(username);
    return NextResponse.json({
        username,
        avatarUrl: sessionAvatarUrl(user.image),
    });
}

export async function DELETE() {
    await clearSessionCookie();
    return NextResponse.json({ ok: true });
}
