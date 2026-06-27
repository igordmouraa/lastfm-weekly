import { cookies } from 'next/headers';
import {
    SESSION_COOKIE_NAME,
    SESSION_MAX_AGE_SECONDS,
    createSessionToken,
    verifySessionToken,
} from './index';

function cookieOptions() {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
        maxAge: SESSION_MAX_AGE_SECONDS,
    };
}

export async function getCurrentUser(): Promise<string | null> {
    if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
        return null;
    }
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;
    return verifySessionToken(token);
}

export async function setSessionCookie(username: string): Promise<void> {
    const token = await createSessionToken(username);
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, cookieOptions());
}

export async function clearSessionCookie(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
}
