'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    ReactNode,
} from 'react';

export type SessionStatus = 'loading' | 'authenticated' | 'guest';

interface SessionContextValue {
    currentUser: string | null;
    avatarUrl: string | null;
    sessionStatus: SessionStatus;
    refreshSession: () => Promise<string | null>;
    setSession: (username: string, avatarUrl: string | null) => void;
    clearSession: () => void;
}

const SessionContext = createContext<SessionContextValue>({
    currentUser: null,
    avatarUrl: null,
    sessionStatus: 'loading',
    refreshSession: async () => null,
    setSession: () => {},
    clearSession: () => {},
});

interface SessionResponse {
    username: string | null;
    avatarUrl: string | null;
}

let sessionFetchPromise: Promise<SessionResponse> | null = null;

async function fetchSession(): Promise<SessionResponse> {
    if (sessionFetchPromise) return sessionFetchPromise;

    sessionFetchPromise = (async () => {
        try {
            const res = await fetch('/api/session');
            if (!res.ok) return { username: null, avatarUrl: null };
            return res.json() as Promise<SessionResponse>;
        } finally {
            sessionFetchPromise = null;
        }
    })();

    return sessionFetchPromise;
}

export function SessionProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [sessionStatus, setSessionStatus] = useState<SessionStatus>('loading');

    const applySession = useCallback((data: SessionResponse) => {
        setCurrentUser(data.username);
        setAvatarUrl(data.avatarUrl);
        setSessionStatus(data.username ? 'authenticated' : 'guest');
        return data.username;
    }, []);

    const refreshSession = useCallback(async (): Promise<string | null> => {
        try {
            const data = await fetchSession();
            return applySession(data);
        } catch {
            applySession({ username: null, avatarUrl: null });
            return null;
        }
    }, [applySession]);

    const clearSession = useCallback(() => {
        setCurrentUser(null);
        setAvatarUrl(null);
        setSessionStatus('guest');
    }, []);

    const setSession = useCallback((username: string, url: string | null) => {
        setCurrentUser(username);
        setAvatarUrl(url);
        setSessionStatus('authenticated');
    }, []);

    useEffect(() => {
        let cancelled = false;

        void fetchSession().then((data) => {
            if (!cancelled) applySession(data);
        });

        return () => {
            cancelled = true;
        };
    }, [applySession]);

    const value = useMemo(
        () => ({ currentUser, avatarUrl, sessionStatus, refreshSession, setSession, clearSession }),
        [currentUser, avatarUrl, sessionStatus, refreshSession, setSession, clearSession]
    );

    return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
    return useContext(SessionContext);
}

export function useCurrentUser() {
    return useContext(SessionContext).currentUser;
}

export function useSessionStatus() {
    return useContext(SessionContext).sessionStatus;
}
