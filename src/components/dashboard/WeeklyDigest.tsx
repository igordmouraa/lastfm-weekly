'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { WeeklyData } from '@/types/lastfm';
import { LazyCoverImage } from '@/components/LazyCoverImage';
import { getImageUrl, truncateText } from '@/lib/images';

interface WeeklyDigestProps {
    data: WeeklyData;
}

interface DigestItem {
    name: string;
    sub?: string;
    playcount?: string;
    image?: string | null;
    lazyType?: 'artist' | 'album' | 'track';
    lazyArtist?: string;
}

interface DigestColumnProps {
    title: string;
    accent: string;
    items: DigestItem[];
    linkPrefix?: string;
}

function DigestColumn({ title, accent, items, linkPrefix }: DigestColumnProps) {
    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: accent }} />
                <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>
                    {title}
                </h3>
            </div>
            <ul className="space-y-1">
                {items.map((item, i) => {
                    const row = (
                        <div className="flex items-center gap-3 py-2.5 px-1 -mx-1 rounded-lg group hover:bg-white/[0.03] transition-colors">
                            <span
                                className="text-xs font-black w-4 shrink-0 tabular-nums opacity-40 group-hover:opacity-100 transition-opacity"
                                style={{ color: accent }}
                            >
                                {i + 1}
                            </span>
                            <LazyCoverImage
                                src={item.image}
                                alt={item.name}
                                className="w-9 h-9 rounded-md shrink-0 ring-1 ring-white/5"
                                size={36}
                                lazyType={item.lazyType}
                                lazyArtist={item.lazyArtist}
                                lazyName={item.name}
                            />
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium truncate group-hover:text-white transition-colors">
                                    {truncateText(item.name, 28)}
                                </p>
                                {item.sub && (
                                    <p className="text-[11px] text-neutral-600 truncate">{item.sub}</p>
                                )}
                            </div>
                            {item.playcount && (
                                <span className="text-[11px] text-neutral-600 shrink-0 tabular-nums">
                                    {item.playcount}
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
            </ul>
        </div>
    );
}

function resolveItemImage(item: { image?: unknown; imageUrl?: string | null }): string | null {
    if (item.imageUrl) return item.imageUrl;
    return getImageUrl(item.image as Parameters<typeof getImageUrl>[0], 'large');
}

export function WeeklyDigest({ data }: WeeklyDigestProps) {
    const t = useTranslations('dashboard.digest');

    const artists = data.artists.slice(0, 5).map((a) => ({
        name: a.name,
        playcount: a.playcount,
        image: resolveItemImage(a),
        lazyType: 'artist' as const,
    }));

    const albums = data.albums.slice(0, 5).map((a) => {
        const artist =
            typeof a.artist === 'string' ? a.artist : (a.artist as { name?: string })?.name ?? '';
        return {
            name: a.name,
            sub: artist,
            playcount: a.playcount,
            image: resolveItemImage(a),
            lazyType: 'album' as const,
            lazyArtist: artist,
        };
    });

    const tracks = data.tracks.slice(0, 5).map((track) => ({
        name: track.name,
        sub: track.artist?.name,
        playcount: track.playcount,
        image: resolveItemImage(track),
        lazyType: 'track' as const,
        lazyArtist: track.artist?.name ?? '',
    }));

    return (
        <section>
            <header className="mb-6">
                <h2 className="text-lg font-display font-bold tracking-tight">{t('title')}</h2>
                <p className="text-sm text-neutral-500 mt-0.5">{t('subtitle')}</p>
            </header>
            <div className="grid sm:grid-cols-3 gap-x-8 gap-y-6">
                <DigestColumn title={t('artists')} accent="#a78bfa" items={artists} linkPrefix="/artist" />
                <DigestColumn title={t('albums')} accent="#34d399" items={albums} />
                <DigestColumn title={t('tracks')} accent="#38bdf8" items={tracks} />
            </div>
        </section>
    );
}
