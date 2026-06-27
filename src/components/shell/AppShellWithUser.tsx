'use client';

import { usePathname } from '@/i18n/navigation';
import { ReactNode, useMemo } from 'react';
import { UserProvider } from './UserContext';
import { AppShell } from './AppShell';
import { extractViewedUserFromPath } from '@/lib/session/path';

interface AppShellWithUserProps {
    currentUser: string | null;
    children: ReactNode;
}

export function AppShellWithUser({ currentUser, children }: AppShellWithUserProps) {
    const pathname = usePathname();
    const viewedUser = useMemo(() => extractViewedUserFromPath(pathname), [pathname]);

    return (
        <UserProvider currentUser={currentUser} viewedUser={viewedUser}>
            <AppShell>{children}</AppShell>
        </UserProvider>
    );
}
