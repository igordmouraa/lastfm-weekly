import { SignJWT, jwtVerify } from 'jose';

export const SESSION_COOKIE_NAME = 'hub_session';
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 year

function getSecretKey(): Uint8Array {
    const secret = process.env.SESSION_SECRET;
    if (!secret || secret.length < 32) {
        throw new Error('SESSION_SECRET must be set and at least 32 characters');
    }
    return new TextEncoder().encode(secret);
}

export async function createSessionToken(username: string): Promise<string> {
    return new SignJWT({ sub: username.toLowerCase() })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
        .sign(getSecretKey());
}

export async function verifySessionToken(token: string): Promise<string | null> {
    try {
        const { payload } = await jwtVerify(token, getSecretKey());
        const sub = payload.sub;
        return typeof sub === 'string' && sub.length > 0 ? sub : null;
    } catch {
        return null;
    }
}

export function normalizeUsername(username: string): string {
    return username.trim().toLowerCase();
}

export function isValidUsername(username: string): boolean {
    const normalized = normalizeUsername(username);
    return normalized.length >= 2 && normalized.length <= 50 && /^[a-z0-9_-]+$/i.test(normalized);
}

export function isSessionConfigured(): boolean {
    const secret = process.env.SESSION_SECRET;
    return Boolean(secret && secret.length >= 32);
}
