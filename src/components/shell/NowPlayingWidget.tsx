'use client';

import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CoverImage } from '@/components/CoverImage';
import { useUserContext } from './UserContext';
import { useNowPlaying } from '@/hooks/useNowPlaying';
import { cn } from '@/lib/utils';

interface NowPlayingWidgetProps {
    collapsed?: boolean;
}

export function NowPlayingWidget({ collapsed }: NowPlayingWidgetProps) {
    const { username, nowPlaying: initial } = useUserContext();
    const data = useNowPlaying(username, initial);

    if (!username) return null;

    const track = data?.track;
    const isLive = data?.isLive ?? false;

    return (
        <div className={cn('mx-2 mb-2 p-2 rounded-xl border', isLive ? 'border-red-500/30 bg-red-950/20' : 'border-white/8 bg-neutral-900/50')}>
            {collapsed ? (
                <div className="flex justify-center relative">
                    {isLive && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                    <CoverImage
                        src={track?.imageUrl}
                        alt={track?.name ?? '?'}
                        className="w-8 h-8 rounded-md"
                    />
                </div>
            ) : (
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative shrink-0">
                        {isLive && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 animate-pulse z-10" />}
                        <CoverImage src={track?.imageUrl} alt={track?.name ?? '?'} className="w-10 h-10 rounded-md" />
                    </div>
                    <div className="min-w-0 flex-1">
                        {track ? (
                            <>
                                <p className="text-[10px] uppercase tracking-wider text-red-400 font-bold">
                                    {isLive ? 'Ouvindo agora' : 'Última faixa'}
                                </p>
                                <p className="text-xs font-medium truncate">{track.name}</p>
                                <p className="text-[10px] text-neutral-500 truncate">
                                    {track.artist}
                                    {!isLive && data?.lastPlayedAt && (
                                        <> · {formatDistanceToNow(data.lastPlayedAt, { addSuffix: true, locale: ptBR })}</>
                                    )}
                                </p>
                            </>
                        ) : (
                            <p className="text-xs text-neutral-500">Nenhum scrobble recente</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
