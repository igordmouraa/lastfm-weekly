'use client';

import { createContext, useContext, ReactNode } from 'react';
import { NowPlayingData } from '@/lib/lastfm/aggregators/now-playing';

interface UserContextValue {
    username: string | null;
    nowPlaying: NowPlayingData | null;
}

const UserContext = createContext<UserContextValue>({ username: null, nowPlaying: null });

export function UserProvider({
    username,
    nowPlaying,
    children,
}: {
    username: string | null;
    nowPlaying?: NowPlayingData | null;
    children: ReactNode;
}) {
    return (
        <UserContext.Provider value={{ username, nowPlaying: nowPlaying ?? null }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUserContext() {
    return useContext(UserContext);
}
