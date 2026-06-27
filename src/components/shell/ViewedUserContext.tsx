'use client';

import { createContext, useContext, ReactNode } from 'react';

const ViewedUserContext = createContext<string | null>(null);

export function ViewedUserProvider({
    viewedUser,
    children,
}: {
    viewedUser: string | null;
    children: ReactNode;
}) {
    return (
        <ViewedUserContext.Provider value={viewedUser}>{children}</ViewedUserContext.Provider>
    );
}

export function useViewedUser() {
    return useContext(ViewedUserContext);
}
