const STORAGE_KEY = 'lastfm-hub-username';

export function getStoredUsername(): string | null {
    if (typeof window === 'undefined') return null;
    try {
        return sessionStorage.getItem(STORAGE_KEY);
    } catch {
        return null;
    }
}

export function setStoredUsername(username: string): void {
    if (typeof window === 'undefined') return;
    try {
        sessionStorage.setItem(STORAGE_KEY, username);
    } catch {
        // ignore
    }
}

export function clearStoredUsername(): void {
    if (typeof window === 'undefined') return;
    try {
        sessionStorage.removeItem(STORAGE_KEY);
    } catch {
        // ignore
    }
}
