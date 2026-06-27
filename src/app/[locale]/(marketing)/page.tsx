'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { HubShell } from '@/components/hub/HubShell';
import { SearchBar } from '@/components/hub/SearchBar';
import {
    Disc3,
    Grid3x3,
    RectangleVertical,
    CalendarRange,
    LayoutDashboard,
    TrendingUp,
    Hash,
    ArrowUpRight,
    type LucideIcon,
} from 'lucide-react';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

const FEATURE_KEYS = ['dashboard', 'weeklyGrid', 'capsule', 'wrapped'] as const;

const FEATURE_ICONS: Record<(typeof FEATURE_KEYS)[number], LucideIcon> = {
    dashboard: LayoutDashboard,
    weeklyGrid: Grid3x3,
    capsule: RectangleVertical,
    wrapped: CalendarRange,
};

const FEATURE_COLORS: Record<(typeof FEATURE_KEYS)[number], string> = {
    dashboard: '#ef4444',
    weeklyGrid: '#f97316',
    capsule: '#ec4899',
    wrapped: '#a78bfa',
};

const PILL_KEYS = ['noLogin', 'realtimeData', 'exportPng'] as const;

function LandingNav() {
    const t = useTranslations('marketing');
    const tc = useTranslations('common');

    return (
        <header className="container mx-auto px-6 py-6 flex items-center justify-between relative z-20">
            <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-900/30 group-hover:scale-105 transition-transform">
                    <Disc3 className="w-4 h-4" />
                </div>
                <span className="font-display font-bold text-lg tracking-tight">{tc('brand')}</span>
            </Link>
            <nav className="flex items-center gap-1 sm:gap-2">
                <Link
                    href="/charts"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-neutral-500 hover:text-white hover:bg-white/5 transition-colors"
                >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{t('nav.charts')}</span>
                </Link>
                <Link
                    href="/tags"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-neutral-500 hover:text-white hover:bg-white/5 transition-colors"
                >
                    <Hash className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{t('nav.tags')}</span>
                </Link>
            </nav>
        </header>
    );
}

function PreviewComposition() {
    const t = useTranslations('marketing');

    const cells = [
        'from-red-600/40 to-red-900/20',
        'from-orange-600/30 to-neutral-900',
        'from-pink-600/30 to-neutral-900',
        'from-violet-600/25 to-neutral-900',
        'from-red-500/50 to-red-950/30',
        'from-amber-600/25 to-neutral-900',
        'from-rose-600/30 to-neutral-900',
        'from-red-700/35 to-neutral-900',
        'from-orange-500/40 to-neutral-900',
    ];

    return (
        <div className="relative w-full max-w-sm mx-auto lg:mx-0 lg:ml-auto">
            <div className="absolute -inset-8 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
            <motion.div
                initial={{ opacity: 0, y: 24, rotate: 2 }}
                animate={{ opacity: 1, y: 0, rotate: 3 }}
                transition={{ delay: 0.25, duration: 0.7 }}
                className="relative grid grid-cols-3 gap-1.5 p-3 rounded-2xl bg-neutral-900/40 border border-white/8 backdrop-blur-sm shadow-2xl shadow-black/50"
            >
                {cells.map((gradient, i) => (
                    <div
                        key={i}
                        className={`aspect-square rounded-md bg-gradient-to-br ${gradient} ring-1 ring-white/5`}
                    />
                ))}
            </motion.div>
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45, duration: 0.6 }}
                className="absolute -right-4 top-1/2 -translate-y-1/2 w-[100px] h-[178px] rounded-xl bg-neutral-950 border border-white/10 shadow-xl overflow-hidden hidden sm:block"
            >
                <div className="p-2.5 space-y-2">
                    <p className="text-[7px] font-bold text-red-500 uppercase tracking-widest">{t('preview.capsule')}</p>
                    <p className="text-[9px] font-bold leading-tight">{t('preview.weekInStories')}</p>
                    <div className="space-y-1.5 pt-1">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="flex items-center gap-1.5">
                                <div className="w-4 h-4 rounded bg-neutral-800 shrink-0" />
                                <div className="h-1.5 flex-1 rounded-full bg-neutral-800" />
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55, duration: 0.6 }}
                className="absolute -left-2 -bottom-4 px-3 py-2 rounded-xl bg-neutral-950/90 border border-white/10 backdrop-blur-md shadow-lg"
            >
                <p className="text-[10px] text-neutral-600 uppercase tracking-widest">{t('preview.scrobbles')}</p>
                <p className="text-lg font-display font-bold text-red-400 tabular-nums">{t('preview.demoScrobbles')}</p>
            </motion.div>
        </div>
    );
}

export default function LandingPage() {
    const t = useTranslations('marketing');
    const [searchError, setSearchError] = useState<string | null>(null);

    return (
        <HubShell showMarquee>
            <LandingNav />

            <main className="container mx-auto px-6 pb-16 grow flex flex-col">
                <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-20 py-8 lg:py-16 min-h-[calc(80vh-5rem)]">
                    <motion.div
                        variants={{ show: { transition: { staggerChildren: 0.08 } } }}
                        initial="hidden"
                        animate="show"
                        className="flex-1 w-full max-w-xl space-y-8"
                    >
                        <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-red-500">
                            <span className="text-[10px] font-bold uppercase tracking-[0.25em]">{t('hero.badge')}</span>
                        </motion.div>

                        <motion.div variants={fadeUp} className="space-y-4">
                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight leading-[0.95]">
                                {t('hero.titleLine1')}
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-red-800">
                                    {t('hero.titleLine2')}
                                </span>
                            </h1>
                            <p className="text-neutral-400 text-lg max-w-md leading-relaxed">{t('hero.subtitle')}</p>
                        </motion.div>

                        <motion.div variants={fadeUp} className="space-y-2">
                            <SearchBar
                                placeholder={t('searchPlaceholder')}
                                mode="login"
                                onError={setSearchError}
                            />
                            {searchError && (
                                <p className="text-sm text-red-400" role="alert">
                                    {searchError}
                                </p>
                            )}
                        </motion.div>

                        <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
                            {PILL_KEYS.map((key) => (
                                <span
                                    key={key}
                                    className="px-3 py-1 rounded-full text-[11px] font-medium text-neutral-500 border border-white/6 bg-white/[0.02]"
                                >
                                    {t(`pills.${key}`)}
                                </span>
                            ))}
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex-1 w-full flex justify-center lg:justify-end"
                    >
                        <PreviewComposition />
                    </motion.div>
                </div>

                <motion.section
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.5 }}
                    className="pt-8 border-t border-white/[0.06]"
                >
                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 mb-6 text-center lg:text-left">
                        {t('features.sectionTitle')}
                    </p>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {FEATURE_KEYS.map((key) => {
                            const Icon = FEATURE_ICONS[key];
                            const color = FEATURE_COLORS[key];
                            return (
                                <div key={key} className="group space-y-3">
                                    <div
                                        className="w-9 h-9 rounded-lg flex items-center justify-center border border-white/8 bg-white/[0.02] group-hover:border-white/15 transition-colors"
                                        style={{ color }}
                                    >
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm group-hover:text-white transition-colors">
                                            {t(`features.${key}.title`)}
                                        </p>
                                        <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                                            {t(`features.${key}.description`)}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-10">
                        <Link
                            href="/charts"
                            className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-red-400 transition-colors"
                        >
                            {t('explore.globalCharts')}
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                            href="/tags"
                            className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-red-400 transition-colors"
                        >
                            {t('explore.byTags')}
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </motion.section>
            </main>
        </HubShell>
    );
}
