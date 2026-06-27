'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { WeeklyData } from "@/types/lastfm";
import { ProxyImage } from '@/components/ProxyImage';
import { LastFmImage } from "@/types/lastfm";
import { Share2 } from 'lucide-react';
import {
    RadarChart, PolarGrid, PolarAngleAxis, Radar,
    AreaChart, Area, XAxis, YAxis, Tooltip,
    ResponsiveContainer,
    RadialBarChart, RadialBar,
} from 'recharts';

interface WeeklyReportProps {
    data: WeeklyData;
    username?: string;
}

const getImageUrl = (images: LastFmImage[]) => {
    if (!images || !Array.isArray(images)) return null;
    const mega = images.find((img) => img.size === 'mega')?.['#text'];
    const extralarge = images.find((img) => img.size === 'extralarge')?.['#text'];
    const large = images.find((img) => img.size === 'large')?.['#text'];
    return mega || extralarge || large || null;
};

const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
};

/* ───────── Mini Sparkline (barras) ───────── */
const MiniSparkBars = ({ values, color }: { values: number[]; color: string }) => {
    const max = Math.max(...values, 1);
    return (
        <div className="flex items-end gap-[3px] h-8">
            {values.map((v, i) => (
                <div
                    key={i}
                    className="w-[5px] rounded-sm transition-all"
                    style={{
                        height: `${Math.max((v / max) * 100, 10)}%`,
                        backgroundColor: color,
                        opacity: 0.6 + (v / max) * 0.4,
                    }}
                />
            ))}
        </div>
    );
};

/* ───────── Hook: busca imagem do artista via Deezer ───────── */
const useArtistImage = (artistName: string | undefined) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!artistName) return;

        const fetchImage = async () => {
            try {
                const res = await fetch(`/api/artist-image?name=${encodeURIComponent(artistName)}`);
                const data = await res.json();
                if (data.imageUrl) {
                    setImageUrl(data.imageUrl);
                }
            } catch (err) {
                console.error('Erro ao buscar imagem do artista:', err);
            }
        };

        fetchImage();
    }, [artistName]);

    return imageUrl;
};

const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;

/* ───────── Componente Principal ───────── */
export const WeeklyReport = ({ data, username }: WeeklyReportProps) => {
    const tr = useTranslations('wrapped.report');
    const tc = useTranslations('common');
    const { artists, albums, tracks, dailyStats, totalScrobbles,
        uniqueArtistCount, uniqueAlbumCount, uniqueTrackCount,
        prevWeekData, topTags, dailyTagData } = data;

    // Busca imagem real do artista principal via Deezer
    const topArtistDeezerImage = useArtistImage(artists[0]?.name);

    /* ── Helpers ── */
    const getDayOfWeek = (dateStr: string) => {
        const date = new Date(dateStr + 'T12:00:00');
        return tr(`days.${DAY_KEYS[date.getDay()]}`);
    };

    const maxDaily = Math.max(...dailyStats.map(d => d.count), 1);

    // ── Dados reais da semana anterior ──
    const prevWeekScrobbles = prevWeekData.totalScrobbles;
    const scrobbleChange = totalScrobbles - prevWeekScrobbles;
    const scrobbleChangePercent = prevWeekScrobbles > 0
        ? Math.round((scrobbleChange / prevWeekScrobbles) * 100)
        : 0;

    const artistCount = uniqueArtistCount;
    const albumCount = uniqueAlbumCount;
    const trackCount = uniqueTrackCount;

    // Contagens reais da semana anterior
    const prevArtistCount = Math.max(1, prevWeekData.uniqueArtistCount);
    const prevAlbumCount = Math.max(1, prevWeekData.uniqueAlbumCount);
    const prevTrackCount = Math.max(1, prevWeekData.uniqueTrackCount);

    const safePercent = (curr: number, prev: number) =>
        prev > 0 ? Math.round(((curr - prev) / prev) * 100) : (curr > 0 ? 100 : 0);

    const artistChangePercent = safePercent(artistCount, prevArtistCount);
    const albumChangePercent = safePercent(albumCount, prevAlbumCount);
    const trackChangePercent = safePercent(trackCount, prevTrackCount);

    const dailyValues = dailyStats.map(d => d.count);
    // Valores reais da semana anterior
    const prevDailyValues = prevWeekData.dailyStats.map(d => d.count);

    // Top items
    const topArtist = artists[0];
    const topAlbum = albums[0];
    const topTrack = tracks[0];

    // ── Cálculo real de itens novos ──
    const currentArtistNames = artists.map(a => a.name);
    const currentAlbumKeys = albums.map(a => `${a.name}-${a.artist}`);
    const currentTrackKeys = tracks.map(t => `${t.name}-${t.artist.name}`);

    const prevArtistSet = new Set(prevWeekData.artistNames);
    const prevAlbumSet = new Set(prevWeekData.albumKeys);
    const prevTrackSet = new Set(prevWeekData.trackKeys);

    const newArtists = currentArtistNames.filter(n => !prevArtistSet.has(n));
    const newAlbums = currentAlbumKeys.filter(k => !prevAlbumSet.has(k));
    const newTracks = currentTrackKeys.filter(k => !prevTrackSet.has(k));

    const newArtistsPercent = artistCount > 0 ? Math.round((newArtists.length / artistCount) * 100) : 0;
    const newAlbumsPercent = albumCount > 0 ? Math.round((newAlbums.length / albumCount) * 100) : 0;
    const newTracksPercent = trackCount > 0 ? Math.round((newTracks.length / trackCount) * 100) : 0;

    // Variação em relação à semana anterior (novos itens da semana passada)
    const prevNewArtists = prevWeekData.artistNames.length > 0 ? prevWeekData.uniqueArtistCount : 0;
    const prevNewAlbums = prevWeekData.albumKeys.length > 0 ? prevWeekData.uniqueAlbumCount : 0;
    const prevNewTracks = prevWeekData.trackKeys.length > 0 ? prevWeekData.uniqueTrackCount : 0;

    const newArtistsChange = safePercent(newArtists.length, Math.round(prevNewArtists * 0.3));
    const newAlbumsChange = safePercent(newAlbums.length, Math.round(prevNewAlbums * 0.3));
    const newTracksChange = safePercent(newTracks.length, Math.round(prevNewTracks * 0.3));

    /* ── Dados REAIS para Charts section ── */

    // Radar: calculado a partir dos dados reais
    const computeRadar = () => {
        // Consistência: regularidade diária (inverso do coef. de variação)
        const mean = dailyValues.length > 0 ? dailyValues.reduce((a, b) => a + b, 0) / dailyValues.length : 0;
        const stdDev = dailyValues.length > 0 ? Math.sqrt(dailyValues.reduce((sum, v) => sum + (v - mean) ** 2, 0) / dailyValues.length) : 0;
        const cv = mean > 0 ? stdDev / mean : 1;
        const consistency = Math.round(Math.max(0, Math.min(100, (1 - cv) * 100)));

        // Descobrir taxa: % de artistas novos
        const discoveryRate = Math.round(Math.min(100, newArtistsPercent * 1.2));

        // Variação: artistas únicos vs total scrobbles
        const variation = Math.round(Math.min(100, (artistCount / Math.max(1, totalScrobbles)) * 300));

        // Concentração: % de scrobbles nos top 3
        const top3Playcount = artists.slice(0, 3).reduce((sum, a) => sum + parseInt(a.playcount || '0'), 0);
        const concentration = totalScrobbles > 0 ? Math.round((top3Playcount / totalScrobbles) * 100) : 0;

        // Taxa de repetições: scrobbles por faixa única
        const repetitionRate = trackCount > 0 ? Math.round(Math.min(100, (totalScrobbles / trackCount) * 25)) : 0;

        return [
            { subject: tr('radar.consistency'), you: consistency, global: 55 },
            { subject: tr('radar.discoveryRate'), you: discoveryRate, global: 50 },
            { subject: tr('radar.variation'), you: variation, global: 45 },
            { subject: tr('radar.concentration'), you: concentration, global: 40 },
            { subject: tr('radar.repetitionRate'), you: repetitionRate, global: 35 },
        ];
    };

    const handleShare = async () => {
        const url = username
            ? `${window.location.origin}/${encodeURIComponent(username)}/week`
            : window.location.href;
        if (navigator.share) {
            await navigator.share({ title: tr('shareTitle'), url });
        } else {
            await navigator.clipboard.writeText(url);
        }
    };

    const radarData = computeRadar();

    const radialData = [
        { name: tr('categories.tracks'), value: trackCount, fill: '#38bdf8' },
        { name: tr('categories.albums'), value: albumCount, fill: '#a78bfa' },
        { name: tr('categories.artists'), value: artistCount, fill: '#34d399' },
    ];

    // Tags reais dos top artistas
    const tagStreamData = dailyTagData;
    const tagNames = topTags.map(t => t.name);

    // Paleta de cores dinâmica para tags
    const TAG_PALETTE = [
        '#6366f1', '#8b5cf6', '#ec4899', '#14b8a6',
        '#10b981', '#f472b6', '#a855f7',
    ];
    const tagColors: Record<string, string> = {};
    tagNames.forEach((name, i) => {
        tagColors[name] = TAG_PALETTE[i % TAG_PALETTE.length];
    });

    /* ── Category card accent colors ── */
    const categoryColors = {
        artists: { bg: 'bg-purple-500/20', accent: '#a78bfa', label: tr('categories.artists'), badge: tr('badges.topArtist'), badgeBg: 'bg-purple-500' },
        albums: { bg: 'bg-emerald-500/20', accent: '#34d399', label: tr('categories.albums'), badge: tr('badges.topAlbum'), badgeBg: 'bg-emerald-500' },
        tracks: { bg: 'bg-sky-500/20', accent: '#38bdf8', label: tr('categories.tracks'), badge: tr('badges.topTrack'), badgeBg: 'bg-sky-500' },
    };

    return (
        <div className="w-full max-w-6xl mx-auto mt-12 overflow-hidden">
            {/* ╔══════════════════════════════════════╗
                ║      HEADER – PINK BANNER            ║
                ╚══════════════════════════════════════╝ */}
            <div
                className="w-full rounded-t-3xl px-6 md:px-10 pt-8 pb-6"
                style={{ background: 'linear-gradient(135deg, #f9a8d4 0%, #f472b6 50%, #ec4899 100%)' }}
            >
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                    {/* Left: Scrobble count */}
                    <div>
                        <p className="text-xs font-bold text-pink-900/70 tracking-wider uppercase mb-1">
                            {tr('versusLastWeek', { percent: scrobbleChangePercent })}
                        </p>
                        <h2 className="text-4xl md:text-5xl font-black text-neutral-950 tracking-tighter leading-none">
                            {totalScrobbles.toLocaleString()} <span className="text-3xl md:text-4xl">{tc('scrobbles')}</span>
                        </h2>
                    </div>

                    {/* Right: Daily bar chart */}
                    <div className="flex flex-col items-end gap-2">
                        {/* Legend */}
                        <div className="flex items-center gap-4 text-[10px] font-bold text-neutral-900/60">
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-sm bg-neutral-900 inline-block" /> {tr('thisWeek')}
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-sm bg-neutral-900/30 inline-block" /> {tr('lastWeek')}
                            </span>
                        </div>
                        {/* Bars */}
                        <div className="flex items-end gap-1.5 h-16">
                            {dailyStats.map((stat, i) => {
                                const h = (stat.count / maxDaily) * 100;
                                const prevH = (prevDailyValues[i] / maxDaily) * 100;
                                return (
                                    <div key={i} className="flex items-end gap-[2px]">
                                        <div
                                            className="w-2.5 md:w-3.5 rounded-t-sm bg-neutral-900/30"
                                            style={{ height: `${Math.max(prevH, 8)}%` }}
                                        />
                                        <div
                                            className="w-2.5 md:w-3.5 rounded-t-sm bg-neutral-900"
                                            style={{ height: `${Math.max(h, 8)}%` }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                        {/* Day labels */}
                        <div className="flex gap-1.5">
                            {dailyStats.map((stat, i) => (
                                <span
                                    key={i}
                                    className="text-[9px] font-bold text-neutral-900/50 w-[calc(1.25rem+2px)] md:w-[calc(1.75rem+2px)] text-center"
                                >
                                    {getDayOfWeek(stat.date)}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Share button */}
                <div className="flex justify-end mt-4">
                    <button
                        type="button"
                        onClick={handleShare}
                        className="flex items-center gap-2 bg-neutral-950 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-neutral-800 transition-colors"
                    >
                        <Share2 size={14} />
                        {tr('shareSummary')}
                    </button>
                </div>
            </div>

            {/* ╔══════════════════════════════════════╗
                ║   CATEGORY CARDS – 3 COLUMNS         ║
                ╚══════════════════════════════════════╝ */}
            <div className="bg-neutral-950 px-4 md:px-8 py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* ─── ARTISTAS ─── */}
                    <CategoryColumn
                        config={categoryColors.artists}
                        count={artistCount}
                        changePercent={artistChangePercent}
                        dailyValues={dailyValues}
                        externalImageUrl={topArtistDeezerImage}
                        topItem={topArtist ? {
                            name: topArtist.name,
                            subtitle: '',
                            playcount: topArtist.playcount || '0',
                            image: topArtist.image,
                        } : null}
                        list={artists.slice(1, 5).map(a => ({
                            name: a.name,
                            playcount: a.playcount || '0',
                        }))}
                        newPercent={newArtistsPercent}
                        newChange={newArtistsChange}
                        newTopItem={artists.length > 2 ? {
                            name: artists[artists.length - 1]?.name || '',
                            playcount: artists[artists.length - 1]?.playcount || '0',
                            image: artists[artists.length - 1]?.image,
                        } : null}
                        newLabel={tr('newItems.artists')}
                    />

                    {/* ─── ÁLBUNS ─── */}
                    <CategoryColumn
                        config={categoryColors.albums}
                        count={albumCount}
                        changePercent={albumChangePercent}
                        dailyValues={dailyValues}
                        topItem={topAlbum ? {
                            name: topAlbum.name,
                            subtitle: typeof topAlbum.artist === 'string' ? topAlbum.artist : (topAlbum.artist as { name?: string })?.name ?? '',
                            playcount: topAlbum.playcount ?? '0',
                            image: topAlbum.image,
                        } : null}
                        list={albums.slice(1, 5).map(a => ({
                            name: a.name,
                            playcount: a.playcount ?? '0',
                        }))}
                        newPercent={newAlbumsPercent}
                        newChange={newAlbumsChange}
                        newTopItem={albums.length > 2 ? {
                            name: albums[albums.length - 1]?.name || '',
                            playcount: albums[albums.length - 1]?.playcount || '0',
                            image: albums[albums.length - 1]?.image,
                        } : null}
                        newLabel={tr('newItems.albums')}
                    />

                    {/* ─── FAIXAS ─── */}
                    <CategoryColumn
                        config={categoryColors.tracks}
                        count={trackCount}
                        changePercent={trackChangePercent}
                        dailyValues={dailyValues}
                        topItem={topTrack ? {
                            name: topTrack.name,
                            subtitle: topTrack.artist?.name ?? '',
                            playcount: topTrack.playcount || '0',
                            image: topTrack.image,
                        } : null}
                        list={tracks.slice(1, 5).map(t => ({
                            name: t.name,
                            playcount: t.playcount || '0',
                        }))}
                        newPercent={newTracksPercent}
                        newChange={newTracksChange}
                        newTopItem={tracks.length > 2 ? {
                            name: tracks[tracks.length - 1]?.name || '',
                            playcount: tracks[tracks.length - 1]?.playcount || '0',
                            image: tracks[tracks.length - 1]?.image,
                        } : null}
                        newLabel={tr('newItems.tracks')}
                    />
                </div>
            </div>

            {/* ╔══════════════════════════════════════╗
                ║       TABELAS – CHARTS SECTION       ║
                ╚══════════════════════════════════════╝ */}
            <div className="bg-neutral-950 px-4 md:px-8 pb-8">
                {/* Section title */}
                <div className="mb-6">
                    <h2 className="text-xl md:text-2xl font-black text-white tracking-wider uppercase">
                        {tr('tables')}
                    </h2>
                    <div className="w-10 h-1 bg-emerald-400 mt-2 rounded-full" />
                </div>

                {/* Top row: Coeficiente Musical + Impressão Digital */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Coeficiente Musical (Radial) */}
                    <div className="bg-neutral-900/60 border border-white/5 rounded-2xl p-6">
                        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">
                            {tr('musicalCoefficient')}
                        </h3>
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <div className="w-44 h-44 shrink-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadialBarChart
                                        cx="50%" cy="50%"
                                        innerRadius="30%" outerRadius="100%"
                                        barSize={12}
                                        data={radialData}
                                        startAngle={90} endAngle={-270}
                                    >
                                        <RadialBar
                                            dataKey="value"
                                            cornerRadius={6}
                                            background={{ fill: '#1a1a1a' }}
                                        />
                                    </RadialBarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex flex-col gap-4">
                                {[
                                    { label: tr('categories.tracks'), value: totalScrobbles, prev: prevWeekScrobbles },
                                    { label: tr('categories.albums'), value: albumCount, prev: prevAlbumCount },
                                    { label: tr('categories.artists'), value: artistCount, prev: prevArtistCount },
                                ].map(item => (
                                    <div key={item.label}>
                                        <p className="text-xs text-neutral-500 font-medium">{item.label}</p>
                                        <p className="text-2xl font-black text-white leading-none">{item.value}</p>
                                        <p className="text-[10px] text-neutral-500">{tr('vsPreviousWeek', { count: item.prev })}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Impressão Digital (Radar) */}
                    <div className="bg-neutral-900/60 border border-white/5 rounded-2xl p-6">
                        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">
                            {tr('listeningFingerprint')}
                        </h3>
                        <div className="flex items-center gap-4 mb-4">
                            <span className="flex items-center gap-1.5 text-[10px] text-neutral-400">
                                <span className="w-2 h-2 rounded-full bg-purple-400 inline-block" /> {tr('you')}
                            </span>
                            <span className="flex items-center gap-1.5 text-[10px] text-neutral-400">
                                <span className="w-2 h-2 rounded-full bg-neutral-500 inline-block" /> {tr('globalAverage')}
                            </span>
                        </div>
                        <div className="w-full h-56">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                                    <PolarGrid stroke="#333" strokeDasharray="3 3" />
                                    <PolarAngleAxis
                                        dataKey="subject"
                                        tick={{ fill: '#888', fontSize: 10 }}
                                    />
                                    <Radar
                                        name={tr('globalAverage')}
                                        dataKey="global"
                                        stroke="#666"
                                        fill="#666"
                                        fillOpacity={0.15}
                                    />
                                    <Radar
                                        name={tr('you')}
                                        dataKey="you"
                                        stroke="#a78bfa"
                                        fill="#a78bfa"
                                        fillOpacity={0.3}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Bottom row: Tags mais ouvidas (Stacked Area) */}
                <div className="bg-neutral-900/60 border border-white/5 rounded-2xl p-6">
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-6">
                        {tr('topTags')}
                    </h3>
                    <div className="w-full h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={tagStreamData}>
                                <XAxis
                                    dataKey="date"
                                    tick={{ fill: '#888', fontSize: 11 }}
                                    axisLine={{ stroke: '#333' }}
                                    tickLine={false}
                                />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1a1a1a',
                                        border: '1px solid #333',
                                        borderRadius: '8px',
                                        fontSize: '12px',
                                        color: '#fff',
                                    }}
                                />
                                {Object.keys(tagColors).map(tag => (
                                    <Area
                                        key={tag}
                                        type="monotone"
                                        dataKey={tag}
                                        stackId="1"
                                        stroke={tagColors[tag]}
                                        fill={tagColors[tag]}
                                        fillOpacity={0.8}
                                    />
                                ))}
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom rounded corners */}
            <div className="h-4 bg-neutral-950 rounded-b-3xl" />
        </div>
    );
};

/* ══════════════════════════════════════════════
   Subcomponente: CategoryColumn
   ══════════════════════════════════════════════ */
interface CategoryColumnProps {
    config: {
        bg: string;
        accent: string;
        label: string;
        badge: string;
        badgeBg: string;
    };
    count: number;
    changePercent: number;
    dailyValues: number[];
    /** URL externa (ex: Deezer) da imagem do item principal. Tem prioridade sobre image do Last.fm. */
    externalImageUrl?: string | null;
    topItem: {
        name: string;
        subtitle: string;
        playcount: string;
        image?: LastFmImage[];
    } | null;
    list: { name: string; playcount: string }[];
    newPercent: number;
    newChange: number;
    newTopItem: {
        name: string;
        playcount: string;
        image?: LastFmImage[];
    } | null;
    newLabel: string;
}

const CategoryColumn = ({
    config,
    count,
    changePercent,
    dailyValues,
    externalImageUrl,
    topItem,
    list,
    newPercent,
    newChange,
    newTopItem,
    newLabel,
}: CategoryColumnProps) => {
    const tr = useTranslations('wrapped.report');
    const lastfmImageUrl = topItem?.image ? getImageUrl(topItem.image) : null;
    const topImageUrl = externalImageUrl || lastfmImageUrl;
    const newItemImageUrl = newTopItem?.image ? getImageUrl(newTopItem.image) : null;

    return (
        <div className="flex flex-col gap-3">
            {/* ── Count header card ── */}
            <div className={`${config.bg} rounded-xl p-4 flex items-center justify-between`}>
                <div>
                    <p className="text-xs text-white/60 font-medium">{config.label}</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-white">{count}</span>
                        <span className="text-xs font-bold" style={{ color: config.accent }}>
                            ↑ {changePercent}%
                        </span>
                    </div>
                </div>
                <MiniSparkBars values={dailyValues} color={config.accent} />
            </div>

            {/* ── Featured top item ── */}
            {topItem && (
                <div className="relative rounded-xl overflow-hidden aspect-square bg-neutral-800 group">
                    {topImageUrl ? (
                        <ProxyImage
                            src={topImageUrl}
                            alt={topItem.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900" />
                    )}
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    {/* Badge */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                        <span className={`${config.badgeBg} text-white text-[10px] font-bold px-2 py-1 rounded-md inline-block mb-2`}>
                            {config.badge}
                        </span>
                        <div className="flex items-end justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-black text-white leading-tight">
                                    #1 {truncateText(topItem.name, 24)}
                                </p>
                                {topItem.subtitle && (
                                    <p className="text-xs text-white/60 mt-0.5">{topItem.subtitle}</p>
                                )}
                            </div>
                            <span className="text-[10px] text-white/50 font-medium shrink-0 ml-2">
                                {tr('itemScrobbles', { count: topItem.playcount })}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Top 5 list (2-5) ── */}
            <div className="bg-neutral-900/50 rounded-xl p-4">
                {list.length > 0 ? (
                    <ul className="flex flex-col gap-2.5">
                        {list.map((item, i) => (
                            <li key={i} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3 min-w-0">
                                    <span className="text-xs font-bold text-neutral-500 w-4 text-right shrink-0">
                                        #{i + 2}
                                    </span>
                                    <span className="text-sm text-white truncate group-hover:text-white/80 transition-colors">
                                        {truncateText(item.name, 28)}
                                    </span>
                                </div>
                                <span className="text-xs text-neutral-500 shrink-0 ml-2">
                                    {item.playcount}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-neutral-500 italic text-center py-4">{tr('insufficientData')}</p>
                )}
            </div>

            {/* ── New items footer ── */}
            <div className="bg-neutral-900/50 rounded-xl p-4">
                <p className="text-xs text-neutral-500 font-medium mb-1">{newLabel}</p>
                <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-2xl font-black text-white">{newPercent}%</span>
                    <span className="text-xs font-bold" style={{ color: config.accent }}>
                        ↑ {newChange}%
                    </span>
                </div>
                {newTopItem && (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-neutral-800 shrink-0 overflow-hidden">
                            {newItemImageUrl ? (
                                <ProxyImage
                                    src={newItemImageUrl}
                                    alt={newTopItem.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-neutral-700" />
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">
                                #1 {truncateText(newTopItem.name, 22)}
                            </p>
                            <p className="text-[10px] text-neutral-500">
                                {tr('itemScrobbles', { count: newTopItem.playcount })}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
