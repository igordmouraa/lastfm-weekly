'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { ChevronRight } from 'lucide-react';
import { MobileMenuButton } from './SidebarNav';
import { SearchBar } from '@/components/hub/SearchBar';
import { LocaleSwitcher } from './LocaleSwitcher';
import { ViewingProfileBanner } from './ViewingProfileBanner';
import { useCurrentUser } from './UserContext';
import { ReactNode } from 'react';

interface Breadcrumb {
    label: string;
    href?: string;
}

interface TopBarProps {
    breadcrumbs?: Breadcrumb[];
    actions?: ReactNode;
}

const GLOBAL_ROUTES = new Set(['charts', 'compare', 'gallery', 'tags', 'artist', 'tag']);

function buildBreadcrumbs(
    pathname: string,
    t: ReturnType<typeof useTranslations<'nav'>>
): Breadcrumb[] {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length === 0) return [{ label: t('breadcrumbs.home') }];

    const crumbs: Breadcrumb[] = [{ label: t('brand'), href: '/' }];

    if (parts[0] && !GLOBAL_ROUTES.has(parts[0])) {
        crumbs.push({ label: parts[0], href: `/${encodeURIComponent(parts[0])}` });
        if (parts[1]) {
            const routeKey = parts[1];
            const knownRoutes = ['semaninha', 'week', 'wrapped', 'month', 'year', 'friends', 'charts', 'compare', 'tags', 'gallery', 'artist', 'tag'] as const;
            const label = knownRoutes.includes(routeKey as (typeof knownRoutes)[number])
                ? t(`routes.${routeKey as (typeof knownRoutes)[number]}`)
                : parts[1];
            crumbs.push({ label });
        }
    } else if (parts[0] === 'artist' && parts[1]) {
        crumbs.push({ label: t('breadcrumbs.discovery'), href: '/charts' });
        crumbs.push({ label: decodeURIComponent(parts[1]) });
    } else if (parts[0] === 'tag' && parts[1]) {
        crumbs.push({ label: t('breadcrumbs.discovery'), href: '/charts' });
        crumbs.push({ label: decodeURIComponent(parts[1]) });
    } else if (parts[0]) {
        crumbs.push({ label: t(`routes.${parts[0]}` as 'routes.charts') ?? parts[0] });
    }

    return crumbs;
}

export function TopBar({ breadcrumbs, actions }: TopBarProps) {
    const pathname = usePathname();
    const currentUser = useCurrentUser();
    const t = useTranslations('nav');
    const crumbs = breadcrumbs ?? buildBreadcrumbs(pathname, t);

    return (
        <>
            <ViewingProfileBanner />
            <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-4 md:px-6 py-3 border-b border-white/8 bg-neutral-950/80 backdrop-blur-md">
            <div className="flex items-center gap-3 min-w-0 flex-1">
                <MobileMenuButton />
                <nav className="flex items-center gap-1.5 text-sm min-w-0">
                    {crumbs.map((crumb, i) => (
                        <span key={i} className="flex items-center gap-1.5 min-w-0">
                            {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-neutral-600 shrink-0" />}
                            {crumb.href ? (
                                <Link href={crumb.href} className="text-neutral-400 hover:text-white truncate transition-colors">
                                    {crumb.label}
                                </Link>
                            ) : (
                                <span className="text-white font-medium truncate">{crumb.label}</span>
                            )}
                        </span>
                    ))}
                </nav>
            </div>
            <div className="flex items-center gap-3 shrink-0">
                <LocaleSwitcher className="hidden sm:inline-flex" />
                {currentUser && (
                    <SearchBar
                        variant="compact"
                        mode="navigate"
                        placeholder={t('searchPlaceholder')}
                        className="hidden sm:block w-48 md:w-56"
                    />
                )}
                {actions}
            </div>
        </header>
        </>
    );
}
