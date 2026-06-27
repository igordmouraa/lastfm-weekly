'use client';

import { useLocale, useTranslations } from 'next-intl';
import { CoverImage } from '@/components/CoverImage';
import { LastFmUser } from '@/types/lastfm';
import { getImageUrl } from '@/lib/images';
import { getIntlLocale } from '@/lib/i18n/format';

interface UserHeaderProps {
    user: LastFmUser;
}

export function UserHeader({ user }: UserHeaderProps) {
    const t = useTranslations('common');
    const locale = useLocale();
    const intlLocale = getIntlLocale(locale);
    const avatar = getImageUrl(user.image, 'thumb');

    return (
        <div className="flex items-center gap-5 mb-6">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-neutral-800 border-2 border-red-500/30 shrink-0">
                {avatar ? (
                    <CoverImage
                        src={avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                        size={80}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-black text-red-500">
                        {user.name[0]?.toUpperCase()}
                    </div>
                )}
            </div>
            <div>
                <h2 className="text-2xl md:text-3xl font-black tracking-tight">{user.name}</h2>
                <p className="text-neutral-400 text-sm">
                    {parseInt(user.playcount, 10).toLocaleString(intlLocale)} {t('scrobbles')}
                    {user.country && user.country !== 'Unknown' && t('countrySeparator', { country: user.country })}
                </p>
                {user.url && (
                    <a href={user.url} target="_blank" rel="noopener noreferrer" className="text-xs text-red-400 hover:underline">
                        {t('actions.viewOnLastfm')}
                    </a>
                )}
            </div>
        </div>
    );
}
