'use client';

import { useCurrentUser as useSessionCurrentUser } from './SessionProvider';
import { useViewedUser as usePathViewedUser } from './AppShellWithUser';

/** @deprecated Prefer useCurrentUser / useViewedUser directly */
export function useUserContext() {
    return {
        currentUser: useSessionCurrentUser(),
        viewedUser: usePathViewedUser(),
        nowPlaying: null,
    };
}

export { useCurrentUser, useSessionStatus } from './SessionProvider';
export { useViewedUser } from './AppShellWithUser';

/** @deprecated Use useCurrentUser or useViewedUser */
export function useLegacyUsername() {
    const currentUser = useSessionCurrentUser();
    const viewedUser = usePathViewedUser();
    return currentUser ?? viewedUser;
}
