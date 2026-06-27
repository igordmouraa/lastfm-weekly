'use client';

import { createContext, useContext, ReactNode } from 'react';
import { NowPlayingData } from '@/lib/lastfm/aggregators/now-playing';

interface UserContextValue {
    /** Logged-in account (JWT session cookie) */
    currentUser: string | null;
    /** Profile being viewed from URL, if any */
    viewedUser: string | null;
    nowPlaying: NowPlayingData | null;
}

const UserContext = createContext<UserContextValue>({
    currentUser: null,
    viewedUser: null,
    nowPlaying: null,
});

export function UserProvider({
    currentUser,
    viewedUser,
    nowPlaying,
    children,
}: {
    currentUser: string | null;
    viewedUser?: string | null;
    nowPlaying?: NowPlayingData | null;
    children: ReactNode;
}) {
    return (
        <UserContext.Provider
            value={{
                currentUser,
                viewedUser: viewedUser ?? null,
                nowPlaying: nowPlaying ?? null,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export function useUserContext() {
    return useContext(UserContext);
}

export function useCurrentUser() {
    return useContext(UserContext).currentUser;
}

export function useViewedUser() {
    return useContext(UserContext).viewedUser;
}

/** @deprecated Use useCurrentUser or useViewedUser */
export function useLegacyUsername() {
    const { currentUser, viewedUser } = useContext(UserContext);
    return currentUser ?? viewedUser;
}
