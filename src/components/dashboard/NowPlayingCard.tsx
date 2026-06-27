'use client';

import { formatDistanceToNow } from 'date-fns';
import { useLocale, useTranslations } from 'next-intl';
import { CoverImage } from '@/components/CoverImage';
import { NowPlayingData } from '@/lib/lastfm/aggregators/now-playing';
import { useNowPlaying } from '@/hooks/useNowPlaying';
import { getDateFnsLocale } from '@/lib/i18n/format';
import { cn } from '@/lib/utils';

interface NowPlayingCardProps {
    username: string;
    initial: NowPlayingData;
}

export function NowPlayingCard({ username, initial }: NowPlayingCardProps) {
    const data = useNowPlaying(username, initial);
    const t = useTranslations('common');
    const locale = useLocale();
    const dateLocale = getDateFnsLocale(locale);
    const track = data?.track;
    const isLive = data?.isLive ?? false;

    return (
        <div
            className={cn(
                'rounded-xl border p-4 flex items-center gap-4 transition-colors',
                isLive ? 'border-red-500/30 bg-red-950/10' : 'border-white/8 bg-neutral-900/50'
            )}
        >
            <div className="relative shrink-0">
                {isLive && (
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-red-600 text-white z-10">
                        {t('live')}
                    </span>
                )}
                <CoverImage src={track?.imageUrl} alt={track?.name ?? t('unknownInitial')} className="w-16 h-16 rounded-lg" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1">
                    {isLive ? t('nowPlaying') : t('lastTrack')}
                </p>
                {track ? (
                    <>
                        <p className="text-lg font-bold truncate">{track.name}</p>
                        <p className="text-sm text-neutral-400 truncate">
                            {track.artist}
                            {track.album && <span className="text-neutral-600"> · {track.album}</span>}
                        </p>
                        {!isLive && data?.lastPlayedAt && (
                            <p className="text-xs text-neutral-600 mt-1">
                                {formatDistanceToNow(data.lastPlayedAt, { addSuffix: true, locale: dateLocale })}
                            </p>
                        )}
                        {track.url && (
                            <a href={track.url} target="_blank" rel="noopener noreferrer" className="text-xs text-red-400 hover:text-red-300 mt-1 inline-block">
                                {t('actions.viewOnLastfmArrow')}
                            </a>
                        )}
                    </>
                ) : (
                    <p className="text-sm text-neutral-500">{t('noRecentScrobble')}</p>
                )}
            </div>
        </div>
    );
}
