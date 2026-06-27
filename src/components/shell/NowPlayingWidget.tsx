'use client';

import { formatDistanceToNow } from 'date-fns';
import { useLocale, useTranslations } from 'next-intl';
import { LazyCoverImage } from '@/components/LazyCoverImage';
import { getDateFnsLocale } from '@/lib/i18n/format';
import { useCurrentUser } from './UserContext';
import { useNowPlaying } from '@/hooks/useNowPlaying';
import { cn } from '@/lib/utils';

interface NowPlayingWidgetProps {
    collapsed?: boolean;
}

export function NowPlayingPlaceholder({ collapsed }: NowPlayingWidgetProps) {
    return (
        <div className="mx-2 mb-2 p-2 rounded-xl border border-white/8 bg-neutral-900/50 min-h-[52px]">
            {collapsed ? (
                <div className="flex justify-center">
                    <div className="w-8 h-8 rounded-md bg-neutral-800 animate-pulse" />
                </div>
            ) : (
                <div className="flex items-center gap-2.5 min-w-0 min-h-10">
                    <div className="w-10 h-10 shrink-0 rounded-md bg-neutral-800 animate-pulse" />
                    <div className="flex-1 space-y-1.5 min-w-0">
                        <div className="h-2.5 w-16 rounded bg-neutral-800 animate-pulse" />
                        <div className="h-3 w-full max-w-[140px] rounded bg-neutral-800 animate-pulse" />
                    </div>
                </div>
            )}
        </div>
    );
}

export function NowPlayingWidget({ collapsed }: NowPlayingWidgetProps) {
    const currentUser = useCurrentUser();
    const data = useNowPlaying(currentUser);
    const t = useTranslations('common');
    const locale = useLocale();
    const dateLocale = getDateFnsLocale(locale);

    if (!currentUser) return null;

    const track = data?.track;
    const isLive = data?.isLive ?? false;
    const loading = !data;

    return (
        <div
            className={cn(
                'mx-2 mb-2 p-2 rounded-xl border min-h-[52px]',
                isLive ? 'border-red-500/30 bg-red-950/20' : 'border-white/8 bg-neutral-900/50'
            )}
        >
            {collapsed ? (
                <div className="flex justify-center relative min-h-8">
                    {loading ? (
                        <div className="w-8 h-8 rounded-md bg-neutral-800 animate-pulse" />
                    ) : (
                        <>
                            {isLive && (
                                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            )}
                            <LazyCoverImage
                                src={track?.imageUrl}
                                alt={track?.name ?? t('unknownInitial')}
                                className="w-8 h-8 rounded-md"
                                size={32}
                                lazyType={track ? 'track' : undefined}
                                lazyArtist={track?.artist}
                                lazyName={track?.name}
                            />
                        </>
                    )}
                </div>
            ) : (
                <div className="flex items-center gap-2.5 min-w-0 min-h-10">
                    {loading ? (
                        <>
                            <div className="w-10 h-10 shrink-0 rounded-md bg-neutral-800 animate-pulse" />
                            <div className="flex-1 space-y-1.5 min-w-0">
                                <div className="h-2.5 w-16 rounded bg-neutral-800 animate-pulse" />
                                <div className="h-3 w-full max-w-[140px] rounded bg-neutral-800 animate-pulse" />
                                <div className="h-2.5 w-24 rounded bg-neutral-800 animate-pulse" />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="relative shrink-0">
                                {isLive && (
                                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 animate-pulse z-10" />
                                )}
                                <LazyCoverImage
                                    src={track?.imageUrl}
                                    alt={track?.name ?? t('unknownInitial')}
                                    className="w-10 h-10 rounded-md"
                                    size={40}
                                    lazyType={track ? 'track' : undefined}
                                    lazyArtist={track?.artist}
                                    lazyName={track?.name}
                                />
                            </div>
                            <div className="min-w-0 flex-1">
                                {track ? (
                                    <>
                                        <p className="text-[10px] uppercase tracking-wider text-red-400 font-bold">
                                            {isLive ? t('nowPlaying') : t('lastTrack')}
                                        </p>
                                        <p className="text-xs font-medium truncate">{track.name}</p>
                                        <p className="text-[10px] text-neutral-500 truncate">
                                            {track.artist}
                                            {!isLive && data?.lastPlayedAt && (
                                                <>
                                                    {' '}
                                                    ·{' '}
                                                    {formatDistanceToNow(data.lastPlayedAt, {
                                                        addSuffix: true,
                                                        locale: dateLocale,
                                                    })}
                                                </>
                                            )}
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-xs text-neutral-500">{t('noRecentScrobble')}</p>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
