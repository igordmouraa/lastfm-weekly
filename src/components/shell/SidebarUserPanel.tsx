'use client';

import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { LogOut } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { CoverImage } from '@/components/CoverImage';
import { useSession } from './SessionProvider';
import { cn } from '@/lib/utils';

interface SidebarUserPanelProps {
    collapsed?: boolean;
}

function PanelSkeleton({ collapsed }: { collapsed?: boolean }) {
    if (collapsed) {
        return (
            <div className="mx-2 mb-2 flex flex-col items-center gap-1.5">
                <div className="w-8 h-8 rounded-full bg-neutral-900/50 border border-white/8 animate-pulse" />
                <div className="w-7 h-7 rounded-lg bg-neutral-900/50 animate-pulse" />
            </div>
        );
    }

    return (
        <div className="mx-2 mb-2 flex items-center gap-1.5 p-1.5 pl-2 rounded-xl border border-white/8 bg-neutral-900/50 min-w-0 min-h-[52px]">
            <div className="w-9 h-9 shrink-0 rounded-full bg-neutral-800 animate-pulse" />
            <div className="h-4 flex-1 max-w-[120px] rounded bg-neutral-800 animate-pulse" />
            <div className="w-8 h-8 shrink-0 rounded-lg bg-neutral-800 animate-pulse" />
        </div>
    );
}

function GuestSlot({ collapsed }: { collapsed?: boolean }) {
    if (collapsed) {
        return <div className="mx-2 mb-2 h-[74px]" aria-hidden />;
    }
    return <div className="mx-2 mb-2 min-h-[52px]" aria-hidden />;
}

export function SidebarUserPanel({ collapsed }: SidebarUserPanelProps) {
    const { currentUser, avatarUrl, sessionStatus, clearSession } = useSession();
    const router = useRouter();
    const t = useTranslations('session');
    const tc = useTranslations('common');

    if (sessionStatus === 'loading') {
        return <PanelSkeleton collapsed={collapsed} />;
    }

    if (!currentUser) {
        return <GuestSlot collapsed={collapsed} />;
    }

    const profileHref = `/${encodeURIComponent(currentUser)}`;
    const initial = currentUser.trim()[0]?.toUpperCase() ?? tc('unknownInitial');
    const avatarSize = collapsed ? 32 : 36;

    const handleLogout = async () => {
        await fetch('/api/session', { method: 'DELETE' });
        clearSession();
        router.push('/');
        router.refresh();
    };

    const avatarInner = avatarUrl ? (
        <CoverImage
            src={avatarUrl}
            alt={currentUser}
            className="w-full h-full object-cover"
            size={avatarSize}
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
        <div className="mx-2 mb-2 flex items-center gap-1.5 p-1.5 pl-2 rounded-xl border border-white/8 bg-neutral-900/50 min-w-0 min-h-[52px]">
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
