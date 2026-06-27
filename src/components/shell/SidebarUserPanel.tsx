'use client';

import { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { LogOut } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { CoverImage } from '@/components/CoverImage';
import { getImageUrl } from '@/lib/images';
import { LastFmUser } from '@/types/lastfm';
import { useCurrentUser } from './UserContext';
import { cn } from '@/lib/utils';

const avatarCache = new Map<string, string | null>();

interface SidebarUserPanelProps {
    collapsed?: boolean;
}

export function SidebarUserPanel({ collapsed }: SidebarUserPanelProps) {
    const currentUser = useCurrentUser();
    const router = useRouter();
    const t = useTranslations('session');
    const tc = useTranslations('common');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!currentUser) return;

        if (avatarCache.has(currentUser)) {
            queueMicrotask(() => setAvatarUrl(avatarCache.get(currentUser) ?? null));
            return;
        }

        let cancelled = false;

        fetch(`/api/lastfm/user/${encodeURIComponent(currentUser)}/info`)
            .then((res) => (res.ok ? res.json() : null))
            .then((user: LastFmUser | null) => {
                if (cancelled) return;
                const url = user ? getImageUrl(user.image) : null;
                avatarCache.set(currentUser, url);
                setAvatarUrl(url);
            })
            .catch(() => {
                if (!cancelled) setAvatarUrl(null);
            });

        return () => {
            cancelled = true;
        };
    }, [currentUser]);

    if (!currentUser) return null;

    const profileHref = `/${encodeURIComponent(currentUser)}`;
    const initial = currentUser.trim()[0]?.toUpperCase() ?? tc('unknownInitial');

    const handleLogout = async () => {
        await fetch('/api/session', { method: 'DELETE' });
        router.push('/');
        router.refresh();
    };

    const avatarInner = avatarUrl ? (
        <CoverImage
            src={avatarUrl}
            alt={currentUser}
            className="w-full h-full object-cover"
            forceProxy
        />
    ) : (
        <div className="w-full h-full flex items-center justify-center bg-neutral-800 text-sm font-bold text-red-400">
            {initial}
        </div>
    );

    if (collapsed) {
        return (
            <div className="mx-2 mb-2 flex flex-col items-center gap-1.5">
                <Link
                    href={profileHref}
                    title={t('loggedInAs', { username: currentUser })}
                    className="w-8 h-8 rounded-full ring-1 ring-white/10 hover:ring-red-500/30 overflow-hidden transition-all"
                >
                    {avatarInner}
                </Link>
                <button
                    type="button"
                    onClick={handleLogout}
                    title={t('logout')}
                    className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/5 transition-colors"
                >
                    <LogOut className="w-3.5 h-3.5" />
                </button>
            </div>
        );
    }

    return (
        <div className="mx-2 mb-2 flex items-center gap-1.5 p-1.5 pl-2 rounded-xl border border-white/8 bg-neutral-900/50 min-w-0">
            <Link
                href={profileHref}
                className="flex items-center gap-2.5 min-w-0 flex-1 group"
                title={t('loggedInAs', { username: currentUser })}
            >
                <div className="w-9 h-9 shrink-0 rounded-full ring-1 ring-white/10 group-hover:ring-red-500/25 overflow-hidden transition-all">
                    {avatarInner}
                </div>
                <p className="text-sm font-medium truncate text-neutral-200 group-hover:text-white transition-colors">
                    @{currentUser}
                </p>
            </Link>
            <button
                type="button"
                onClick={handleLogout}
                title={t('logout')}
                aria-label={t('logout')}
                className={cn(
                    'shrink-0 p-2 rounded-lg text-neutral-500',
                    'hover:text-red-400 hover:bg-red-500/5 transition-colors'
                )}
            >
                <LogOut className="w-4 h-4" />
            </button>
        </div>
    );
}
