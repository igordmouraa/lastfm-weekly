import { AppShellWithUser } from '@/components/shell/AppShellWithUser';
import { getCurrentUser } from '@/lib/session/cookies';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
    const currentUser = await getCurrentUser();

    return <AppShellWithUser currentUser={currentUser}>{children}</AppShellWithUser>;
}
