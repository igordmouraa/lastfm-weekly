'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useUserContext } from './UserContext';
import { Eye } from 'lucide-react';

export function ViewingProfileBanner() {
    const { currentUser, viewedUser } = useUserContext();
    const t = useTranslations('session');

    if (!currentUser || !viewedUser || currentUser.toLowerCase() === viewedUser.toLowerCase()) {
        return null;
    }

    return (
        <div className="flex items-center justify-center gap-3 px-4 py-2 text-xs bg-amber-500/10 border-b border-amber-500/20 text-amber-200/90">
            <Eye className="w-3.5 h-3.5 shrink-0 text-amber-400" />
            <span>
                {t('viewingProfile', { username: viewedUser })}
            </span>
            <Link
                href={`/${encodeURIComponent(currentUser)}`}
                className="font-semibold text-amber-400 hover:text-amber-300 underline-offset-2 hover:underline shrink-0"
            >
                {t('backToMyDashboard')}
            </Link>
        </div>
    );
}
