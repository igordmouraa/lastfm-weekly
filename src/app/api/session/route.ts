import { NextResponse } from 'next/server';
import { getUserInfo } from '@/lib/lastfm/user';
import { LastFmError } from '@/lib/lastfm/client';
import {
    clearSessionCookie,
    getCurrentUser,
    setSessionCookie,
} from '@/lib/session/cookies';
import { isValidUsername, normalizeUsername, isSessionConfigured } from '@/lib/session/index';

export async function GET() {
    const username = await getCurrentUser();
    return NextResponse.json({ username });
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

    try {
        await getUserInfo(username);
    } catch (err) {
        if (err instanceof LastFmError && (err.status === 6 || err.status === 404)) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        throw err;
    }

    await setSessionCookie(username);
    return NextResponse.json({ username });
}

export async function DELETE() {
    await clearSessionCookie();
    return NextResponse.json({ ok: true });
}
