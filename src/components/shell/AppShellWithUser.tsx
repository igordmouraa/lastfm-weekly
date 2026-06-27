'use client';

import { ReactNode, useMemo } from 'react';
import { usePathname } from '@/i18n/navigation';
import { AppShell } from './AppShell';
import { SessionProvider } from './SessionProvider';
import { extractViewedUserFromPath } from '@/lib/session/path';
import { ViewedUserProvider, useViewedUser } from './ViewedUserContext';

export { useViewedUser };

interface AppShellWithUserProps {
    children: ReactNode;
}

function AppShellInner({ children }: AppShellWithUserProps) {
    const pathname = usePathname();
    const viewedUser = useMemo(() => extractViewedUserFromPath(pathname), [pathname]);

    return (
        <ViewedUserProvider viewedUser={viewedUser}>
            <AppShell>{children}</AppShell>
        </ViewedUserProvider>
    );
}

export function AppShellWithUser({ children }: AppShellWithUserProps) {
    return (
        <SessionProvider>
            <AppShellInner>{children}</AppShellInner>
        </SessionProvider>
    );
}
