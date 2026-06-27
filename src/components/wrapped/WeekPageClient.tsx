'use client';

import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { useLocale, useTranslations } from 'next-intl';
import { WeeklyData, LastFmTrack, LastFmAlbum, DailyStats } from '@/types/lastfm';
import { WeeklyStories } from '@/components/wrapped/WeeklyStories';
import { CoverImage } from '@/components/CoverImage';
import { useExportPng, ExportPreviewOverlay } from '@/hooks/useExportPng';
import { Button } from '@/components/ui/button';
import { getImageUrl, truncateText } from '@/lib/images';
import { formatTagName } from '@/lib/tags';
import { getDateFnsLocale } from '@/lib/i18n/format';
import {
    Download,
    Sparkles,
    Headphones,
    Clock,
    Grid3x3,
    ArrowUpRight,
    Share2,
    TrendingUp,
    TrendingDown,
    Minus,
    Disc3,
    Flame,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface WeekPageClientProps {
    data: WeeklyData;
    username: string;
}

const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } },
};

const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
};

function resolveImage(item: { image?: unknown; imageUrl?: string | null }): string | null {
    if (item.imageUrl) return item.imageUrl;
    return getImageUrl(item.image as Parameters<typeof getImageUrl>[0], 'thumb');
}

function WeekActivityChart({
    dailyStats,
    busiestDay,
}: {
    dailyStats: DailyStats[];
    busiestDay: { date: string; count: number } | null;
}) {
    const t = useTranslations('week.page');
    const locale = useLocale();
    const dateLocale = getDateFnsLocale(locale);
    const dateFormat = locale === 'en-US' ? "EEEE, MMM d" : "EEEE, d 'de' MMM";

    if (dailyStats.length === 0) return null;
    const max = Math.max(...dailyStats.map((d) => d.count), 1);

    let busiestLabel = '';
    if (busiestDay) {
        try {
            busiestLabel = format(parseISO(busiestDay.date), dateFormat, { locale: dateLocale });
        } catch {
            busiestLabel = busiestDay.date;
        }
    }

    return (
        <div className="rounded-xl border border-white/8 bg-neutral-900/40 p-5 space-y-4">
            <div className="flex items-start justify-between gap-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">{t('weekActivity')}</p>
                {busiestDay && busiestDay.count > 0 && (
                    <div className="flex items-center gap-1.5 text-[10px] text-amber-400/90 shrink-0">
                        <Flame className="w-3 h-3" />
                        <span className="font-medium capitalize">{busiestLabel}</span>
                    </div>
                )}
            </div>
            <div className="flex items-end gap-1.5 h-20 px-1">
                {dailyStats.map((day) => {
                    const height = Math.max(8, Math.round((day.count / max) * 100));
                    let label = day.date;
                    try {
                        label = format(parseISO(day.date), 'EEE', { locale: dateLocale });
                    } catch {
                        label = day.date.slice(-2);
                    }
                    return (
                        <div key={day.date} className="flex-1 flex flex-col items-center gap-2 min-w-0">
                            <div className="w-full flex items-end justify-center h-14">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${height}%` }}
                                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
                                    className={cn(
                                        'w-full max-w-[2rem] rounded-t-sm',
                                        day.count > 0 ? 'bg-gradient-to-t from-red-700 to-red-400' : 'bg-neutral-800'
                                    )}
                                    title={t('dayScrobbles', { count: day.count })}
                                />
                            </div>
                            <span className="text-[9px] text-neutral-600 uppercase truncate w-full text-center">
                                {label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function WeekDeltaBadge({ current, previous }: { current: number; previous: number }) {
    const t = useTranslations('week.delta');

    if (previous === 0 && current === 0) return null;
    const delta = current - previous;
    const pct = previous > 0 ? Math.round((delta / previous) * 100) : null;

    if (delta === 0) {
        return (
            <span className="inline-flex items-center gap-1 text-[10px] text-neutral-500 bg-white/[0.04] border border-white/8 px-2 py-0.5 rounded-full">
                <Minus className="w-3 h-3" />
                {t('sameAsLastWeek')}
            </span>
        );
    }

    const up = delta > 0;
    const sign = up ? '+' : '';

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border',
                up
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                    : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
            )}
        >
            {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {pct !== null
                ? t('scrobblesWithPercent', {
                      sign,
                      count: delta,
                      percentSign: up ? '+' : '',
                      percent: pct,
                  })
                : t('scrobbles', { sign, count: delta })}
        </span>
    );
}

function albumArtistName(artist: LastFmAlbum['artist']): string {
    if (typeof artist === 'string') return artist;
    return artist?.name ?? artist?.['#text'] ?? '';
}

function TopAlbumsRow({ albums }: { albums: LastFmAlbum[] }) {
    const t = useTranslations('week.page');
    const top = albums.slice(0, 4);
    if (top.length === 0) return null;

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <Disc3 className="w-3.5 h-3.5 text-amber-400" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">{t('topAlbums')}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {top.map((album, i) => (
                    <div
                        key={`${album.name}-${albumArtistName(album.artist)}-${i}`}
                        className="group relative rounded-xl border border-white/8 bg-neutral-900/50 p-3 hover:border-amber-500/25 transition-colors"
                    >
                        <span className="absolute top-2 left-2 text-[9px] font-bold text-amber-500/80">#{i + 1}</span>
                        <CoverImage
                            src={resolveImage(album as LastFmAlbum & { imageUrl?: string | null })}
                            alt={album.name}
                            className="w-full aspect-square rounded-lg ring-1 ring-white/10 mb-2"
                        />
                        <p className="text-[11px] font-bold truncate leading-tight">{truncateText(album.name, 22)}</p>
                        <p className="text-[10px] text-neutral-500 truncate">{albumArtistName(album.artist)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function WeekPageClient({ data, username }: WeekPageClientProps) {
    const { exportRef, exportPng, isExporting, previewUrl, clearPreview } = useExportPng();
    const t = useTranslations('week.page');
    const tExport = useTranslations('week.export');
    const tShare = useTranslations('week.share');
    const tc = useTranslations('common');
    const topArtist = data.artists[0];
    const topTrack = data.tracks[0];
    const estimatedMins = Math.round(data.totalScrobbles * 3.5);
    const profileHref = `/${encodeURIComponent(username)}`;
    const semaninhaHref = `${profileHref}/semaninha`;

    const handleShare = async () => {
        const url = `${window.location.origin}/${encodeURIComponent(username)}/week`;
        if (navigator.share) {
            await navigator.share({ title: tShare('title'), url });
        } else {
            await navigator.clipboard.writeText(url);
        }
    };

    return (
        <>
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-32 right-0 w-[480px] h-[480px] bg-pink-600/8 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-1/4 w-[360px] h-[360px] bg-red-700/6 rounded-full blur-[80px]" />
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            <motion.div
                variants={stagger}
                initial="hidden"
                animate="show"
                className="grid lg:grid-cols-[minmax(0,1fr)_minmax(360px,420px)] xl:grid-cols-[minmax(0,1.15fr)_minmax(380px,440px)] gap-10 xl:gap-14 items-start max-w-[88rem] mx-auto"
            >
                <motion.div variants={fadeUp} className="order-2 lg:order-1 space-y-8 min-w-0">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 text-pink-400">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.25em]">{t('badge')}</span>
                        </div>
                        <div>
                            <h2 className="text-2xl lg:text-3xl font-display font-bold tracking-tight leading-tight">
                                {t('title')}
                            </h2>
                            <p className="text-sm text-neutral-500 mt-2 max-w-lg leading-relaxed">{t('subtitle')}</p>
                            <div className="mt-3">
                                <WeekDeltaBadge
                                    current={data.totalScrobbles}
                                    previous={data.prevWeekData.totalScrobbles}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="rounded-xl border border-white/8 bg-neutral-900/50 p-4">
                            <Headphones className="w-4 h-4 text-red-400 mb-2" />
                            <p className="text-2xl font-display font-bold tabular-nums">{data.totalScrobbles}</p>
                            <p className="text-[10px] text-neutral-500 uppercase tracking-wider mt-0.5">{t('stats.scrobbles')}</p>
                        </div>
                        <div className="rounded-xl border border-white/8 bg-neutral-900/50 p-4">
                            <Clock className="w-4 h-4 text-pink-400 mb-2" />
                            <p className="text-2xl font-display font-bold tabular-nums">{estimatedMins}</p>
                            <p className="text-[10px] text-neutral-500 uppercase tracking-wider mt-0.5">{t('stats.minutes')}</p>
                        </div>
                        <div className="rounded-xl border border-white/8 bg-neutral-900/50 p-4">
                            <Sparkles className="w-4 h-4 text-violet-400 mb-2" />
                            <p className="text-2xl font-display font-bold tabular-nums">{data.uniqueArtistCount}</p>
                            <p className="text-[10px] text-neutral-500 uppercase tracking-wider mt-0.5">{t('stats.artists')}</p>
                        </div>
                        <div className="rounded-xl border border-white/8 bg-neutral-900/50 p-4">
                            <Disc3 className="w-4 h-4 text-amber-400 mb-2" />
                            <p className="text-2xl font-display font-bold tabular-nums">{data.uniqueAlbumCount}</p>
                            <p className="text-[10px] text-neutral-500 uppercase tracking-wider mt-0.5">{t('stats.albums')}</p>
                        </div>
                    </div>

                    {(topArtist || topTrack) && (
                        <div className="grid sm:grid-cols-2 gap-4">
                            {topArtist && (
                                <div className="flex items-center gap-3 p-4 rounded-xl border border-violet-500/15 bg-violet-500/5">
                                    <CoverImage
                                        src={resolveImage(topArtist)}
                                        alt={topArtist.name}
                                        className="w-12 h-12 rounded-lg ring-1 ring-white/10 shrink-0"
                                    />
                                    <div className="min-w-0">
                                        <p className="text-[10px] uppercase tracking-widest text-violet-400 mb-0.5">{tc('rankArtist')}</p>
                                        <p className="text-sm font-bold truncate">{topArtist.name}</p>
                                        <p className="text-[11px] text-neutral-500">{tc('plays', { count: topArtist.playcount ?? 0 })}</p>
                                    </div>
                                </div>
                            )}
                            {topTrack && (
                                <div className="flex items-center gap-3 p-4 rounded-xl border border-sky-500/15 bg-sky-500/5">
                                    <CoverImage
                                        src={resolveImage(topTrack as LastFmTrack & { imageUrl?: string | null })}
                                        alt={topTrack.name}
                                        className="w-12 h-12 rounded-lg ring-1 ring-white/10 shrink-0"
                                    />
                                    <div className="min-w-0">
                                        <p className="text-[10px] uppercase tracking-widest text-sky-400 mb-0.5">{tc('rankTrack')}</p>
                                        <p className="text-sm font-bold truncate">{truncateText(topTrack.name, 28)}</p>
                                        <p className="text-[11px] text-neutral-500 truncate">{topTrack.artist?.name}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <TopAlbumsRow albums={data.albums} />

                    <WeekActivityChart dailyStats={data.dailyStats} busiestDay={data.busiestDay} />

                    {data.topTags.length > 0 && (
                        <div className="space-y-3">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">{t('soundOfWeek')}</p>
                            <div className="flex flex-wrap gap-2">
                                {data.topTags.slice(0, 6).map((tag) => (
                                    <Link
                                        key={tag.name}
                                        href={`/tag/${encodeURIComponent(tag.name)}`}
                                        className="px-3 py-1.5 rounded-full text-xs border border-white/8 bg-white/[0.03] text-neutral-400 hover:text-pink-400 hover:border-pink-500/30 transition-colors"
                                    >
                                        {formatTagName(tag.name)}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Button
                            onClick={() => exportPng(`weekly-${username}.png`)}
                            disabled={isExporting}
                            className="bg-red-600 hover:bg-red-700 font-bold flex-1 sm:flex-none sm:min-w-[200px]"
                        >
                            <Download className="w-4 h-4" />
                            {isExporting ? tExport('generatingPng') : tExport('downloadCapsule')}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleShare}
                            className="border-white/10 bg-transparent hover:bg-white/5"
                        >
                            <Share2 className="w-4 h-4" />
                            {tc('actions.copyLink')}
                        </Button>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-2 border-t border-white/[0.06]">
                        <Link
                            href={profileHref}
                            className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-white transition-colors"
                        >
                            {tc('actions.backToDashboard')}
                            <ArrowUpRight className="w-3 h-3" />
                        </Link>
                        <Link
                            href={semaninhaHref}
                            className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-pink-400 transition-colors"
                        >
                            <Grid3x3 className="w-3 h-3" />
                            {t('weeklyGridLink')}
                        </Link>
                    </div>
                </motion.div>

                <motion.div
                    variants={fadeUp}
                    className="order-1 lg:order-2 flex flex-col items-center lg:sticky lg:top-24 w-full lg:pb-8"
                >
                    <div className="relative w-fit mx-auto">
                        <div className="absolute -inset-8 bg-gradient-to-br from-pink-600/20 via-red-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

                        <div className="relative rounded-[2rem] border border-white/10 bg-neutral-900/60 backdrop-blur-sm p-3 shadow-2xl shadow-black/50">
                            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full bg-white/10 z-10 pointer-events-none hidden sm:block" />
                            <div ref={exportRef} className="rounded-[1.4rem] overflow-hidden">
                                <WeeklyStories data={data} variant="full" />
                            </div>
                        </div>

                        <p className="text-center text-[11px] text-neutral-600 mt-4">{t('aspectRatio')}</p>
                    </div>

                    <Button
                        onClick={() => exportPng(`weekly-${username}.png`)}
                        disabled={isExporting}
                        className="lg:hidden w-full max-w-[400px] mt-5 bg-red-600 hover:bg-red-700 font-bold"
                    >
                        <Download className="w-4 h-4" />
                        {isExporting ? tExport('generating') : tExport('downloadCapsulePng')}
                    </Button>
                </motion.div>
            </motion.div>

            <ExportPreviewOverlay previewUrl={previewUrl} onClose={clearPreview} />
        </>
    );
}
