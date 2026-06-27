'use client';

import { createContext, useContext, useState, useSyncExternalStore, ReactNode } from 'react';
import { SidebarNav } from './SidebarNav';
import { NoiseBackground, GradientBlobs } from '@/components/ui/background-elements';
import { cn } from '@/lib/utils';
import {
    getSidebarCollapsedSnapshot,
    setSidebarCollapsed,
    subscribeSidebarCollapsed,
} from '@/lib/sidebar-storage';

interface ShellContextValue {
    collapsed: boolean;
    toggleCollapsed: () => void;
    mobileOpen: boolean;
    setMobileOpen: (v: boolean) => void;
}

const ShellContext = createContext<ShellContextValue>({
    collapsed: false,
    toggleCollapsed: () => {},
    mobileOpen: false,
    setMobileOpen: () => {},
});

export function useShell() {
    return useContext(ShellContext);
}

interface AppShellProps {
    children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
    const collapsed = useSyncExternalStore(
        subscribeSidebarCollapsed,
        getSidebarCollapsedSnapshot,
        () => false
    );
    const hydrated = useSyncExternalStore(
        () => () => {},
        () => true,
        () => false
    );
    const [mobileOpen, setMobileOpen] = useState(false);

    const toggleCollapsed = () => setSidebarCollapsed(!collapsed);

    return (
        <ShellContext.Provider value={{ collapsed, toggleCollapsed, mobileOpen, setMobileOpen }}>
            <div className="min-h-screen bg-neutral-950 text-white relative flex">
                <NoiseBackground />
                <GradientBlobs />

                {mobileOpen && (
                    <div
                        className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                        onClick={() => setMobileOpen(false)}
                    />
                )}

                <aside
                    className={cn(
                        'fixed lg:sticky top-0 left-0 z-50 h-screen flex flex-col border-r border-white/8 bg-neutral-950/95 backdrop-blur-xl',
                        hydrated && 'transition-all duration-300',
                        collapsed ? 'w-[var(--sidebar-collapsed-width)]' : 'w-[var(--sidebar-width)]',
                        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    )}
                >
                    <SidebarNav />
                </aside>

                <div className="flex-1 flex flex-col min-w-0 relative z-10">
                    <main className="flex-1">{children}</main>
                </div>
            </div>
        </ShellContext.Provider>
    );
}
