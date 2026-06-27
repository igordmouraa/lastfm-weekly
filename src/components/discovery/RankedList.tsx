'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { LazyCoverImage } from '@/components/LazyCoverImage';
import { getIntlLocale } from '@/lib/i18n/format';
import { truncateText } from '@/lib/images';

export interface RankedItem {
    name: string;
    playcount?: string;
    image?: string | null;
    sub?: string;
    lazyType?: 'artist' | 'album' | 'track';
    lazyArtist?: string;
}

interface RankedListProps {
    items: RankedItem[];
    accent?: string;
    linkPrefix?: string;
    startIndex?: number;
}

export function RankedList({ items, accent = '#ef4444', linkPrefix, startIndex = 1 }: RankedListProps) {
    const locale = useLocale();
    const intlLocale = getIntlLocale(locale);

    return (
        <ol className="space-y-0.5">
            {items.map((item, i) => {
                const rank = startIndex + i;
                const row = (
                    <div className="flex items-center gap-3 py-2.5 px-1 -mx-1 rounded-lg group hover:bg-white/[0.03] transition-colors">
                        <span
                            className="text-xs font-black w-5 shrink-0 tabular-nums opacity-40 group-hover:opacity-100 transition-opacity text-right"
                            style={{ color: accent }}
                        >
                            {rank}
                        </span>
                        <LazyCoverImage
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 rounded-md shrink-0 ring-1 ring-white/5"
                            lazyType={item.lazyType ?? (linkPrefix ? 'artist' : item.sub ? 'album' : undefined)}
                            lazyArtist={item.lazyArtist ?? item.sub}
                            lazyName={item.name}
                        />
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium truncate group-hover:text-white transition-colors">
                                {truncateText(item.name, 32)}
                            </p>
                            {item.sub && (
                                <p className="text-[11px] text-neutral-600 truncate">{item.sub}</p>
                            )}
                        </div>
                        {item.playcount && (
                            <span className="text-[11px] text-neutral-600 shrink-0 tabular-nums">
                                {parseInt(item.playcount, 10).toLocaleString(intlLocale)}
                            </span>
                        )}
                    </div>
                );

                return (
                    <li key={`${item.name}-${i}`}>
                        {linkPrefix ? (
                            <Link href={`${linkPrefix}/${encodeURIComponent(item.name)}`}>{row}</Link>
                        ) : row}
                    </li>
                );
            })}
        </ol>
    );
}
