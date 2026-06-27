'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import {
    LayoutDashboard,
    Grid3x3,
    RectangleVertical,
    CalendarRange,
    Users,
    ArrowLeftRight,
    TrendingUp,
    Hash,
    Disc3,
    PanelLeftClose,
    PanelLeftOpen,
    X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useShell } from './AppShell';
import { useCurrentUser } from './UserContext';
import { SidebarUserPanel } from './SidebarUserPanel';
import { NowPlayingWidget } from './NowPlayingWidget';

interface NavItem {
    id: string;
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    requiresUser?: boolean;
}

interface NavGroup {
    id: string;
    title: string;
    items: NavItem[];
}

function buildNavGroups(username: string | null, t: ReturnType<typeof useTranslations<'nav'>>): NavGroup[] {
    const base = username ? `/${encodeURIComponent(username)}` : null;

    return [
        {
            id: 'home',
            title: t('groups.home'),
            items: [
                { id: 'dashboard', label: t('items.dashboard'), href: base ?? '/', icon: LayoutDashboard, requiresUser: true },
            ],
        },
        {
            id: 'summaries',
            title: t('groups.summaries'),
            items: [
                { id: 'semaninha', label: t('items.weeklyGrid'), href: base ? `${base}/semaninha` : '/', icon: Grid3x3, requiresUser: true },
                { id: 'week', label: t('items.capsule'), href: base ? `${base}/week` : '/', icon: RectangleVertical, requiresUser: true },
                { id: 'wrapped', label: t('items.wrapped'), href: base ? `${base}/wrapped` : '/', icon: CalendarRange, requiresUser: true },
            ],
        },
        {
            id: 'social',
            title: t('groups.social'),
            items: [
                { id: 'friends', label: t('items.friends'), href: base ? `${base}/friends` : '/', icon: Users, requiresUser: true },
                {
                    id: 'compare',
                    label: t('items.compare'),
                    href: username ? `/compare?user1=${encodeURIComponent(username)}` : '/compare',
                    icon: ArrowLeftRight,
                },
            ],
        },
        {
            id: 'explore',
            title: t('groups.explore'),
            items: [
                { id: 'charts', label: t('items.globalCharts'), href: '/charts', icon: TrendingUp },
                { id: 'tags', label: t('items.tags'), href: '/tags', icon: Hash },
            ],
        },
    ];
}

export function SidebarNav() {
    const pathname = usePathname();
    const { collapsed, toggleCollapsed, setMobileOpen, mobileOpen } = useShell();
    const currentUser = useCurrentUser();
    const t = useTranslations('nav');
    const groups = buildNavGroups(currentUser, t);

    const isActive = (href: string) => {
        if (href === '/' || !href.startsWith('/')) return false;
        const path = href.split('?')[0];
        if (path === `/${currentUser}` || path === `/${encodeURIComponent(currentUser ?? '')}`) {
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
            <div className="p-4 border-b border-white/8">
                <div className={cn('flex items-center gap-2', collapsed ? 'flex-col' : 'justify-between')}>
                    <div className="flex items-center gap-2 shrink-0 min-w-0 select-none">
                        <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shrink-0">
                            <Disc3 className="w-4 h-4" />
                        </div>
                        {!collapsed && (
                            <span className="font-display font-bold text-sm tracking-tight truncate">{t('brand')}</span>
                        )}
                    </div>

                    <div className={cn('flex items-center gap-1', collapsed ? 'flex-col' : 'shrink-0')}>
                        {mobileOpen && !collapsed && (
                            <button
                                type="button"
                                onClick={() => setMobileOpen(false)}
                                className="lg:hidden p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-white/5"
                                aria-label={t('aria.closeMenu')}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={toggleCollapsed}
                            className="hidden lg:flex p-2 rounded-lg text-neutral-500 hover:text-white hover:bg-white/5 transition-colors"
                            aria-label={collapsed ? t('aria.expandSidebar') : t('aria.collapseSidebar')}
                        >
                            {collapsed ? (
                                <PanelLeftOpen className="w-4 h-4" />
                            ) : (
                                <PanelLeftClose className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
                {groups.map((group) => (
                    <div key={group.id}>
                        {!collapsed && (
                            <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-neutral-600">
                                {group.title}
                            </p>
                        )}
                        <ul className="space-y-0.5">
                            {group.items.map((item) => {
                                const Icon = item.icon;
                                const disabled = item.requiresUser && !currentUser;
                                const active = !disabled && isActive(item.href);

                                return (
                                    <li key={`${group.id}-${item.id}`}>
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

            {currentUser && <NowPlayingWidget collapsed={collapsed} />}

            <SidebarUserPanel key={currentUser ?? 'guest'} collapsed={collapsed} />
        </>
    );
}

export function MobileMenuButton() {
    const { setMobileOpen } = useShell();
    const t = useTranslations('nav');
    return (
        <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5"
            aria-label={t('aria.openMenu')}
        >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </button>
    );
}
