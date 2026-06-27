import { AppShellWithUser } from '@/components/shell/AppShellWithUser';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return <AppShellWithUser>{children}</AppShellWithUser>;
}
