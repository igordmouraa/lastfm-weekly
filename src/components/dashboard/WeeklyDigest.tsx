'use client';

import Link from 'next/link';
import { WeeklyData } from '@/types/lastfm';
import { CoverImage } from '@/components/CoverImage';
import { getImageUrl, truncateText } from '@/lib/images';

interface WeeklyDigestProps {
    data: WeeklyData;
}

interface DigestColumnProps {
    title: string;
    accent: string;
    items: { name: string; sub?: string; playcount?: string; image?: ReturnType<typeof getImageUrl> }[];
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
                            <CoverImage
                                src={item.image}
                                alt={item.name}
                                className="w-9 h-9 rounded-md shrink-0 ring-1 ring-white/5"
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
    return getImageUrl(item.image as Parameters<typeof getImageUrl>[0]);
}

export function WeeklyDigest({ data }: WeeklyDigestProps) {
    const artists = data.artists.slice(0, 5).map((a) => ({
        name: a.name,
        playcount: a.playcount,
        image: resolveItemImage(a),
    }));

    const albums = data.albums.slice(0, 5).map((a) => ({
        name: a.name,
        sub: typeof a.artist === 'string' ? a.artist : (a.artist as { name?: string })?.name,
        playcount: a.playcount,
        image: resolveItemImage(a),
    }));

    const tracks = data.tracks.slice(0, 5).map((t) => ({
        name: t.name,
        sub: t.artist?.name,
        playcount: t.playcount,
        image: resolveItemImage(t),
    }));

    return (
        <section>
            <header className="mb-6">
                <h2 className="text-lg font-display font-bold tracking-tight">Digest semanal</h2>
                <p className="text-sm text-neutral-500 mt-0.5">Seus tops dos últimos 7 dias</p>
            </header>
            <div className="grid sm:grid-cols-3 gap-x-8 gap-y-6">
                <DigestColumn title="Artistas" accent="#a78bfa" items={artists} linkPrefix="/artist" />
                <DigestColumn title="Álbuns" accent="#34d399" items={albums} />
                <DigestColumn title="Faixas" accent="#38bdf8" items={tracks} />
            </div>
        </section>
    );
}
