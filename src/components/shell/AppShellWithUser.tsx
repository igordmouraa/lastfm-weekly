'use client';

import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useMemo, useSyncExternalStore } from 'react';
import { UserProvider } from './UserContext';
import { AppShell } from './AppShell';
import { getStoredUsername, setStoredUsername } from '@/lib/session-user';

const GLOBAL_ROUTES = new Set(['charts', 'compare', 'gallery', 'tags', 'artist', 'tag']);
const USER_CHANGE_EVENT = 'lastfm-hub-user-change';

function extractUsernameFromPath(pathname: string): string | null {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length === 0) return null;
    if (GLOBAL_ROUTES.has(parts[0])) return null;
    try {
        return decodeURIComponent(parts[0]);
    } catch {
        return parts[0];
    }
}

function subscribeStoredUser(onChange: () => void) {
    window.addEventListener(USER_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(USER_CHANGE_EVENT, onChange);
}

function getStoredUserSnapshot(): string | null {
    return getStoredUsername();
}

export function AppShellWithUser({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const pathUser = useMemo(() => extractUsernameFromPath(pathname), [pathname]);
    const storedUser = useSyncExternalStore(subscribeStoredUser, getStoredUserSnapshot, () => null);

    useEffect(() => {
        if (pathUser) {
            setStoredUsername(pathUser);
            window.dispatchEvent(new Event(USER_CHANGE_EVENT));
        }
    }, [pathUser]);

    const username = pathUser ?? storedUser;

    return (
        <UserProvider username={username}>
            <AppShell>{children}</AppShell>
        </UserProvider>
    );
}
