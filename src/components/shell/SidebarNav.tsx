'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Grid3x3,
    RectangleVertical,
    CalendarRange,
    Users,
    ArrowLeftRight,
    TrendingUp,
    Hash,
    ChevronLeft,
    ChevronRight,
    Disc3,
    X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useShell } from './AppShell';
import { useUserContext } from './UserContext';
import { NowPlayingWidget } from './NowPlayingWidget';

interface NavItem {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    requiresUser?: boolean;
}

interface NavGroup {
    title: string;
    items: NavItem[];
}

function buildNavGroups(username: string | null): NavGroup[] {
    const base = username ? `/${encodeURIComponent(username)}` : null;

    return [
        {
            title: 'Início',
            items: [
                { label: 'Dashboard', href: base ?? '/', icon: LayoutDashboard, requiresUser: true },
            ],
        },
        {
            title: 'Resumos',
            items: [
                { label: 'Grade semanal', href: base ? `${base}/semaninha` : '/', icon: Grid3x3, requiresUser: true },
                { label: 'Cápsula', href: base ? `${base}/week` : '/', icon: RectangleVertical, requiresUser: true },
                { label: 'Wrapped', href: base ? `${base}/wrapped` : '/', icon: CalendarRange, requiresUser: true },
            ],
        },
        {
            title: 'Social',
            items: [
                { label: 'Amigos', href: base ? `${base}/friends` : '/', icon: Users, requiresUser: true },
                {
                    label: 'Comparar',
                    href: username ? `/compare?user1=${encodeURIComponent(username)}` : '/compare',
                    icon: ArrowLeftRight,
                },
            ],
        },
        {
            title: 'Explorar',
            items: [
                { label: 'Charts globais', href: '/charts', icon: TrendingUp },
                { label: 'Tags', href: '/tags', icon: Hash },
            ],
        },
    ];
}

export function SidebarNav() {
    const pathname = usePathname();
    const { collapsed, toggleCollapsed, setMobileOpen, mobileOpen } = useShell();
    const { username } = useUserContext();
    const groups = buildNavGroups(username);

    const isActive = (href: string) => {
        if (href === '/' || !href.startsWith('/')) return false;
        const path = href.split('?')[0];
        if (path === `/${username}` || path === `/${encodeURIComponent(username ?? '')}`) {
            return pathname === path || pathname === `${path}/`;
        }
        if (path.endsWith('/wrapped')) {
            return pathname.includes('/wrapped') || pathname.includes('/month') || pathname.includes('/year');
        }
        if (path === '/compare') {
            return pathname.startsWith('/compare');
        }
        if (path.endsWith('/friends')) {
            return pathname.endsWith('/friends');
        }
        if (path.endsWith('/week')) {
            return pathname.endsWith('/week');
        }
        if (path.endsWith('/semaninha')) {
            return pathname.endsWith('/semaninha');
        }
        if (path === '/charts') {
            return pathname.startsWith('/charts');
        }
        if (path === '/tags') {
            return pathname.startsWith('/tags');
        }
        return pathname.startsWith(path);
    };

    return (
        <>
            <div className="p-4 border-b border-white/8 space-y-3">
                <div className={cn('flex items-center', collapsed ? 'justify-center' : 'justify-between')}>
                    <Link href="/" className="flex items-center gap-2 shrink-0" onClick={() => setMobileOpen(false)}>
                        <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
                            <Disc3 className="w-4 h-4" />
                        </div>
                        {!collapsed && (
                            <span className="font-display font-bold text-sm tracking-tight">Weekster Hub</span>
                        )}
                    </Link>
                    {mobileOpen && !collapsed && (
                        <button
                            type="button"
                            onClick={() => setMobileOpen(false)}
                            className="lg:hidden p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-white/5"
                            aria-label="Fechar menu"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <button
                    type="button"
                    onClick={toggleCollapsed}
                    className={cn(
                        'hidden lg:flex items-center gap-2 w-full p-2 rounded-lg text-neutral-500 hover:text-white hover:bg-white/5 transition-colors text-xs',
                        collapsed && 'justify-center'
                    )}
                    aria-label={collapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
                >
                    {collapsed ? <ChevronRight className="w-4 h-4" /> : (
                        <>
                            <ChevronLeft className="w-4 h-4" />
                            <span>Recolher</span>
                        </>
                    )}
                </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
                {groups.map((group) => (
                    <div key={group.title}>
                        {!collapsed && (
                            <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-neutral-600">
                                {group.title}
                            </p>
                        )}
                        <ul className="space-y-0.5">
                            {group.items.map((item) => {
                                const Icon = item.icon;
                                const disabled = item.requiresUser && !username;
                                const active = !disabled && isActive(item.href);

                                return (
                                    <li key={`${group.title}-${item.label}`}>
                                        <Link
                                            href={disabled ? '/' : item.href}
                                            onClick={() => setMobileOpen(false)}
                                            title={collapsed ? item.label : undefined}
                                            className={cn(
                                                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                                                collapsed && 'justify-center px-2',
                                                active
                                                    ? 'bg-red-500/15 text-red-400 font-medium'
                                                    : 'text-neutral-400 hover:text-white hover:bg-white/5',
                                                disabled && 'opacity-40 pointer-events-none'
                                            )}
                                        >
                                            <Icon className={cn('w-4 h-4 shrink-0', active && 'stroke-[2.25]')} />
                                            {!collapsed && <span className="truncate">{item.label}</span>}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            {username && <NowPlayingWidget collapsed={collapsed} />}
        </>
    );
}

export function MobileMenuButton() {
    const { setMobileOpen } = useShell();
    return (
        <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5"
            aria-label="Abrir menu"
        >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </button>
    );
}
