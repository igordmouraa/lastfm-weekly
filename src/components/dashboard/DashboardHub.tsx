'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { DashboardData, WeeklyData } from '@/types/lastfm';
import { CoverImage } from '@/components/CoverImage';
import { NowPlayingCard } from '@/components/dashboard/NowPlayingCard';
import { WeeklyDigest } from '@/components/dashboard/WeeklyDigest';
import { SemaninhaPreviewCard } from '@/components/dashboard/SemaninhaPreviewCard';
import { CapsulePreviewCard } from '@/components/dashboard/CapsulePreviewCard';
import { WeeklyTagsPanel } from '@/components/dashboard/WeeklyTagsPanel';
import { getImageUrl } from '@/lib/images';
import { Disc3, Headphones } from 'lucide-react';

interface DashboardHubProps {
    data: DashboardData;
    weekly: WeeklyData;
    username: string;
}

const fadeUp = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
};

const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
};

function DashboardContent({ data, weekly, username }: DashboardHubProps) {
    const avatar = getImageUrl(data.user.image);
    const topArtist = data.artists[0];
    const topArtistImage = topArtist?.imageUrl || getImageUrl(topArtist?.image);

    return (
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5 -mt-2">
            <motion.header
                variants={fadeUp}
                className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 pb-1"
            >
                <div className="flex items-center gap-4 min-w-0">
                    <CoverImage
                        src={avatar}
                        alt={data.user.name}
                        className="w-14 h-14 rounded-2xl ring-2 ring-red-500/20"
                    />
                    <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500 mb-0.5">Perfil</p>
                        <h1 className="text-2xl font-display font-bold tracking-tight truncate">{data.user.name}</h1>
                        <p className="text-sm text-neutral-500 flex items-center gap-1.5 mt-0.5">
                            <Disc3 className="w-3.5 h-3.5" />
                            {data.totalScrobbles.toLocaleString('pt-BR')} scrobbles
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-6 sm:gap-8 shrink-0">
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-neutral-600 flex items-center gap-1.5 mb-0.5">
                            <Headphones className="w-3 h-3 text-red-400" />
                            Scrobbles · 7 dias
                        </p>
                        <p className="text-2xl font-display font-bold tabular-nums leading-none">
                            {data.periodScrobbles.toLocaleString('pt-BR')}
                        </p>
                    </div>

                    <div className="w-px h-10 bg-white/[0.06] hidden sm:block" />

                    <div className="flex items-center gap-3 min-w-0">
                        <CoverImage
                            src={topArtistImage}
                            alt={topArtist?.name ?? 'Artista'}
                            className="w-10 h-10 rounded-full ring-1 ring-white/10 shrink-0"
                        />
                        <div className="min-w-0">
                            <p className="text-[10px] uppercase tracking-widest text-neutral-600 mb-0.5">Artista #1</p>
                            <p className="text-sm font-bold text-red-400 truncate max-w-[140px]">
                                {topArtist?.name ?? '—'}
                            </p>
                        </div>
                    </div>
                </div>
            </motion.header>

            <motion.div variants={fadeUp}>
                <NowPlayingCard username={username} initial={data.nowPlaying} />
            </motion.div>

            <motion.div variants={fadeUp} className="grid sm:grid-cols-2 gap-4">
                <SemaninhaPreviewCard albums={data.collagePreview} username={username} />
                <CapsulePreviewCard data={weekly} username={username} />
            </motion.div>

            <motion.section variants={fadeUp} className="pt-4">
                <div className="grid lg:grid-cols-[minmax(0,260px)_1fr] gap-x-14 gap-y-10 lg:gap-y-0">
                    <WeeklyTagsPanel weeklyTags={weekly.topTags} profileTags={data.tags} />
                    <div className="lg:border-l lg:border-white/[0.04] lg:pl-14">
                        <WeeklyDigest data={weekly} />
                    </div>
                </div>
            </motion.section>
        </motion.div>
    );
}

export function DashboardHub(props: DashboardHubProps) {
    return (
        <Suspense>
            <DashboardContent {...props} />
        </Suspense>
    );
}
