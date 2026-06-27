'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
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
    const t = useTranslations('discovery');
    const [tab, setTab] = useState<'artists' | 'tracks'>('artists');

    const artistItems = artists.map((a) => ({
        name: a.name,
        playcount: a.playcount,
        image: a.imageUrl,
        lazyType: 'artist' as const,
    }));

    const trackItems = tracks.map((track) => ({
        name: track.name,
        playcount: track.playcount,
        image: track.imageUrl,
        sub: track.artist,
        lazyType: 'track' as const,
        lazyArtist: track.artist,
    }));

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.05 } } }}
            className="space-y-8 -mt-2"
        >
            <motion.header variants={fadeUp}>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500 mb-1">{t('badge')}</p>
                <h1 className="text-2xl font-display font-bold tracking-tight">{t('charts.title')}</h1>
                <p className="text-sm text-neutral-500 mt-1">{t('charts.subtitle')}</p>
            </motion.header>

            <motion.div variants={fadeUp} className="flex gap-2">
                {(['artists', 'tracks'] as const).map((tabKey) => (
                    <button
                        key={tabKey}
                        type="button"
                        onClick={() => setTab(tabKey)}
                        className={cn(
                            'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                            tab === tabKey
                                ? 'bg-red-500/20 border-red-500/50 text-red-400'
                                : 'border-white/10 text-neutral-500 hover:text-white'
                        )}
                    >
                        {t(`charts.tabs.${tabKey}`)}
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
                        {tab === 'artists' ? t('charts.topArtists') : t('charts.topTracks')}
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
