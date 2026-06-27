import { Link } from '@/i18n/navigation';
import { CoverImage } from '@/components/CoverImage';
import { LastFmImage } from '@/types/lastfm';
import { getImageUrl, truncateText } from '@/lib/images';

export interface TopListItem {
    name: string;
    playcount?: string;
    image?: LastFmImage[];
    imageUrl?: string | null;
    artist?: string;
    url?: string;
}

interface TopListProps {
    title: string;
    items: TopListItem[];
    accent?: string;
    showArtist?: boolean;
    linkPrefix?: string;
}

export function TopList({ title, items, accent = '#ef4444', showArtist = false, linkPrefix }: TopListProps) {
    return (
        <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: accent }}>{title}</h3>
            <ul className="space-y-3">
                {items.map((item, idx) => {
                    const img = item.imageUrl ?? getImageUrl(item.image);
                    const inner = (
                        <>
                            <span className="text-xs font-black text-neutral-600 w-4">{idx + 1}</span>
                            <CoverImage src={img} alt={item.name} className="w-10 h-10 rounded-md" />
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium truncate group-hover:text-red-400 transition-colors">
                                    {truncateText(item.name, 28)}
                                </p>
                                {showArtist && item.artist && (
                                    <p className="text-xs text-neutral-500 truncate">{item.artist}</p>
                                )}
                            </div>
                            {item.playcount && (
                                <span className="text-xs text-neutral-500 shrink-0">{item.playcount}</span>
                            )}
                        </>
                    );

                    if (linkPrefix) {
                        return (
                            <li key={`${item.name}-${idx}`}>
                                <Link href={`${linkPrefix}/${encodeURIComponent(item.name)}`} className="flex items-center gap-3 group">
                                    {inner}
                                </Link>
                            </li>
                        );
                    }

                    return (
                        <li key={`${item.name}-${idx}`} className="flex items-center gap-3 group">
                            {inner}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
