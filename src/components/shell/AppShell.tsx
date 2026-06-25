'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { SidebarNav } from './SidebarNav';
import { NoiseBackground, GradientBlobs } from '@/components/ui/background-elements';
import { cn } from '@/lib/utils';

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
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('sidebar-collapsed');
        if (stored === 'true') {
            // Hydrate collapsed state from localStorage after mount
            queueMicrotask(() => setCollapsed(true));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('sidebar-collapsed', String(collapsed));
    }, [collapsed]);

    const toggleCollapsed = () => setCollapsed((c) => !c);

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
                        'fixed lg:sticky top-0 left-0 z-50 h-screen flex flex-col border-r border-white/8 bg-neutral-950/95 backdrop-blur-xl transition-all duration-300',
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
