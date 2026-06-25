'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { MobileMenuButton } from './SidebarNav';
import { SearchBar } from '@/components/hub/SearchBar';
import { useUserContext } from './UserContext';
import { ReactNode } from 'react';

interface Breadcrumb {
    label: string;
    href?: string;
}

interface TopBarProps {
    breadcrumbs?: Breadcrumb[];
    actions?: ReactNode;
}

const ROUTE_LABELS: Record<string, string> = {
    semaninha: 'Grade semanal',
    week: 'Cápsula',
    wrapped: 'Wrapped',
    month: 'Wrapped',
    year: 'Wrapped',
    friends: 'Amigos',
    charts: 'Charts globais',
    compare: 'Comparar',
    tags: 'Tags',
    gallery: 'Tags',
    artist: 'Artista',
    tag: 'Tag',
};

function buildBreadcrumbs(pathname: string): Breadcrumb[] {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length === 0) return [{ label: 'Início' }];

    const crumbs: Breadcrumb[] = [{ label: 'Weekster Hub', href: '/' }];

    if (parts[0] && !['charts', 'compare', 'gallery', 'tags', 'artist', 'tag'].includes(parts[0])) {
        crumbs.push({ label: parts[0], href: `/${encodeURIComponent(parts[0])}` });
        if (parts[1]) {
            crumbs.push({ label: ROUTE_LABELS[parts[1]] ?? parts[1] });
        }
    } else if (parts[0] === 'artist' && parts[1]) {
        crumbs.push({ label: 'Discovery', href: '/charts' });
        crumbs.push({ label: decodeURIComponent(parts[1]) });
    } else if (parts[0] === 'tag' && parts[1]) {
        crumbs.push({ label: 'Discovery', href: '/charts' });
        crumbs.push({ label: decodeURIComponent(parts[1]) });
    } else if (parts[0]) {
        crumbs.push({ label: ROUTE_LABELS[parts[0]] ?? parts[0] });
    }

    return crumbs;
}

export function TopBar({ breadcrumbs, actions }: TopBarProps) {
    const pathname = usePathname();
    const { username } = useUserContext();
    const crumbs = breadcrumbs ?? buildBreadcrumbs(pathname);

    return (
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
                {username && (
                    <SearchBar
                        variant="compact"
                        placeholder="Outro usuário..."
                        className="hidden sm:block w-48 md:w-56"
                    />
                )}
                {actions}
            </div>
        </header>
    );
}
