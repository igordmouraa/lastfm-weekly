'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { PeriodWrappedData } from '@/types/lastfm';
import { CoverImage } from '@/components/CoverImage';
import { PeriodSelector } from '@/components/hub/PeriodSelector';
import {
    WRAPPED_PERIOD_OPTIONS,
    parseWrappedPeriod,
    getPeriodLabel,
    formatPeriodRange,
} from '@/lib/lastfm/periods';
import { getImageUrl, truncateText } from '@/lib/images';
import { Headphones } from 'lucide-react';

interface PeriodWrappedHubProps {
    data: PeriodWrappedData;
    username: string;
}

interface TopColumnProps {
    title: string;
    accent: string;
    items: { name: string; sub?: string; playcount?: string; image?: ReturnType<typeof getImageUrl> }[];
    linkPrefix?: string;
}

const fadeUp = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
};

const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
};

function TopColumn({ title, accent, items, linkPrefix }: TopColumnProps) {
    return (
        <div>
            <div className="flex items-center gap-2 mb-5">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: accent }} />
                <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>
                    {title}
                </h3>
                <span className="text-[10px] text-neutral-600 ml-auto">top 10</span>
            </div>
            <ol className="space-y-0.5">
                {items.map((item, i) => {
                    const row = (
                        <div className="flex items-center gap-3 py-2 px-1 -mx-1 rounded-lg group hover:bg-white/[0.03] transition-colors">
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
                                    {truncateText(item.name, 30)}
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
            </ol>
        </div>
    );
}

function PeriodWrappedContent({ data, username }: PeriodWrappedHubProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const period = parseWrappedPeriod(searchParams.get('period') ?? data.period);
    const base = `/${encodeURIComponent(username)}/wrapped`;
    const avatar = getImageUrl(data.user.image);
    const periodLabel = getPeriodLabel(period);
    const dateRange = formatPeriodRange(period);

    const handlePeriodChange = (p: string) => {
        router.push(`${base}?period=${p}`, { scroll: false });
    };

    const artists = data.artists.map((a) => ({
        name: a.name,
        playcount: a.playcount,
        image: a.imageUrl || getImageUrl(a.image),
    }));

    const albums = data.albums.map((a) => ({
        name: a.name,
        sub: typeof a.artist === 'string' ? a.artist : (a.artist as { name?: string })?.name,
        playcount: a.playcount,
        image: a.imageUrl ?? getImageUrl(a.image),
    }));

    const tracks = data.tracks.map((t) => ({
        name: t.name,
        sub: t.artist?.name,
        playcount: t.playcount,
        image: t.imageUrl || getImageUrl(t.image),
    }));

    return (
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-8 -mt-2">
            <motion.header variants={fadeUp} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                <div className="flex items-center gap-4">
                    <CoverImage
                        src={avatar}
                        alt={data.user.name}
                        className="w-14 h-14 rounded-2xl ring-2 ring-red-500/20 shadow-lg shadow-red-900/10"
                    />
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500 mb-0.5">
                            Wrapped · {periodLabel}
                        </p>
                        <h1 className="text-2xl font-display font-bold tracking-tight">{data.user.name}</h1>
                        <p className="text-sm text-neutral-500 mt-0.5">{dateRange}</p>
                    </div>
                </div>
                <div className="flex items-baseline gap-2 sm:text-right">
                    <Headphones className="w-4 h-4 text-red-400 shrink-0 sm:mb-1" />
                    <div>
                        <p className="text-3xl font-display font-bold tabular-nums leading-none">
                            {data.totalScrobbles.toLocaleString('pt-BR')}
                        </p>
                        <p className="text-[11px] text-neutral-600 mt-1">scrobbles no período</p>
                    </div>
                </div>
            </motion.header>

            <motion.div variants={fadeUp}>
                <PeriodSelector
                    value={period}
                    onChange={handlePeriodChange}
                    options={WRAPPED_PERIOD_OPTIONS}
                />
            </motion.div>

            <motion.section variants={fadeUp}>
                <div className="grid lg:grid-cols-3 gap-x-10 gap-y-8">
                    <TopColumn title="Artistas" accent="#a78bfa" items={artists} linkPrefix="/artist" />
                    <TopColumn title="Álbuns" accent="#34d399" items={albums} />
                    <TopColumn title="Faixas" accent="#38bdf8" items={tracks} />
                </div>
            </motion.section>
        </motion.div>
    );
}

export function PeriodWrappedHub(props: PeriodWrappedHubProps) {
    return (
        <Suspense>
            <PeriodWrappedContent {...props} />
        </Suspense>
    );
}
