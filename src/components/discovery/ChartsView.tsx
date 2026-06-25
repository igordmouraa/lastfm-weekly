'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { RankedList } from '@/components/discovery/RankedList';
import { cn } from '@/lib/utils';

interface ChartsViewProps {
    artists: { name: string; playcount?: string; imageUrl: string | null }[];
    tracks: { name: string; playcount?: string; imageUrl: string | null; artist: string }[];
}

const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } },
};

export function ChartsView({ artists, tracks }: ChartsViewProps) {
    const [tab, setTab] = useState<'artists' | 'tracks'>('artists');

    const artistItems = artists.map((a) => ({
        name: a.name,
        playcount: a.playcount,
        image: a.imageUrl,
    }));

    const trackItems = tracks.map((t) => ({
        name: t.name,
        playcount: t.playcount,
        image: t.imageUrl,
        sub: t.artist,
    }));

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.05 } } }}
            className="space-y-8 -mt-2"
        >
            <motion.header variants={fadeUp}>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500 mb-1">Discovery</p>
                <h1 className="text-2xl font-display font-bold tracking-tight">Charts globais</h1>
                <p className="text-sm text-neutral-500 mt-1">O que o mundo está ouvindo no Last.fm agora</p>
            </motion.header>

            <motion.div variants={fadeUp} className="flex gap-2">
                {(['artists', 'tracks'] as const).map((t) => (
                    <button
                        key={t}
                        type="button"
                        onClick={() => setTab(t)}
                        className={cn(
                            'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                            tab === t
                                ? 'bg-red-500/20 border-red-500/50 text-red-400'
                                : 'border-white/10 text-neutral-500 hover:text-white'
                        )}
                    >
                        {t === 'artists' ? 'Artistas' : 'Faixas'}
                    </button>
                ))}
            </motion.div>

            <section>
                <div className="flex items-center gap-2 mb-5">
                    <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: tab === 'artists' ? '#a78bfa' : '#38bdf8' }}
                    />
                    <h2
                        className="text-xs font-bold uppercase tracking-widest"
                        style={{ color: tab === 'artists' ? '#a78bfa' : '#38bdf8' }}
                    >
                        Top {tab === 'artists' ? 'artistas' : 'faixas'}
                    </h2>
                </div>
                <div className="grid lg:grid-cols-2 gap-x-10">
                    {tab === 'artists' ? (
                        <>
                            <RankedList items={artistItems.slice(0, 10)} accent="#a78bfa" linkPrefix="/artist" />
                            <RankedList items={artistItems.slice(10)} accent="#a78bfa" linkPrefix="/artist" startIndex={11} />
                        </>
                    ) : (
                        <>
                            <RankedList items={trackItems.slice(0, 10)} accent="#38bdf8" />
                            <RankedList items={trackItems.slice(10)} accent="#38bdf8" startIndex={11} />
                        </>
                    )}
                </div>
            </section>
        </motion.div>
    );
}
