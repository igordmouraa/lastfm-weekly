'use client';

import React from 'react';
import { WeeklyData } from "@/types/lastfm";
import { ProxyImage } from '@/components/ProxyImage';
import { LastFmImage } from "@/types/lastfm";
import { Share2 } from 'lucide-react';
import {
    RadarChart, PolarGrid, PolarAngleAxis, Radar,
    AreaChart, Area, XAxis, YAxis, Tooltip,
    ResponsiveContainer,
    RadialBarChart, RadialBar, Legend
} from 'recharts';

interface WeeklyReportProps {
    data: WeeklyData;
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

/* ───────── Componente Principal ───────── */
export const WeeklyReport = ({ data }: WeeklyReportProps) => {
    const { artists, albums, tracks, dailyStats, totalScrobbles,
        uniqueArtistCount, uniqueAlbumCount, uniqueTrackCount } = data;

    /* ── Helpers ── */
    const getDayOfWeek = (dateStr: string) => {
        const date = new Date(dateStr + 'T12:00:00');
        const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        return days[date.getDay()];
    };

    const maxDaily = Math.max(...dailyStats.map(d => d.count), 1);

    // Simulated previous week (mock) – ~85% of current
    const prevWeekScrobbles = Math.round(totalScrobbles * 0.86);
    const scrobbleChange = totalScrobbles - prevWeekScrobbles;
    const scrobbleChangePercent = prevWeekScrobbles > 0
        ? Math.round((scrobbleChange / prevWeekScrobbles) * 100)
        : 0;

    const artistCount = uniqueArtistCount;
    const albumCount = uniqueAlbumCount;
    const trackCount = uniqueTrackCount;

    // Mock previous counts for comparison
    const prevArtistCount = Math.max(1, Math.round(artistCount * 0.82));
    const prevAlbumCount = Math.max(1, Math.round(albumCount * 0.68));
    const prevTrackCount = Math.max(1, Math.round(trackCount * 0.96));

    const artistChangePercent = Math.round(((artistCount - prevArtistCount) / prevArtistCount) * 100);
    const albumChangePercent = Math.round(((albumCount - prevAlbumCount) / prevAlbumCount) * 100);
    const trackChangePercent = Math.round(((trackCount - prevTrackCount) / prevTrackCount) * 100);

    const dailyValues = dailyStats.map(d => d.count);
    // Mock previous week daily values (deterministic based on index)
    const prevDailyValues = dailyValues.map((v, i) => Math.max(0, Math.round(v * (0.7 + ((i * 17 + 7) % 10) * 0.04))));

    // Top items
    const topArtist = artists[0];
    const topAlbum = albums[0];
    const topTrack = tracks[0];

    // Mock "new" percentages
    const newArtistsPercent = 25;
    const newAlbumsPercent = 32;
    const newTracksPercent = 31;
    const newArtistsChange = 5;
    const newAlbumsChange = 19;
    const newTracksChange = 28;

    /* ── Mock data for Charts section ── */
    const radarData = [
        { subject: 'Consistência', you: 78, global: 60 },
        { subject: 'Descobrir taxa', you: 45, global: 55 },
        { subject: 'Variação', you: 62, global: 50 },
        { subject: 'Concentração', you: 85, global: 45 },
        { subject: 'Taxa de repetições', you: 70, global: 40 },
    ];

    const radialData = [
        { name: 'Faixas', value: parseInt(tracks[0]?.playcount || '0'), fill: '#38bdf8' },
        { name: 'Álbuns', value: albumCount, fill: '#a78bfa' },
        { name: 'Artistas', value: artistCount, fill: '#34d399' },
    ];

    // Mock tag stream data
    const tagStreamData = [
        { week: '2 Abr', rock: 40, jazz: 25, pop: 15, classic_rock: 30, folk: 5, soft_rock: 20, '70s': 10 },
        { week: '9 Abr', rock: 35, jazz: 30, pop: 20, classic_rock: 25, folk: 8, soft_rock: 25, '70s': 15 },
        { week: '16 Abr', rock: 30, jazz: 20, pop: 25, classic_rock: 35, folk: 12, soft_rock: 18, '70s': 12 },
        { week: '23 Abr', rock: 25, jazz: 15, pop: 18, classic_rock: 40, folk: 15, soft_rock: 10, '70s': 8 },
        { week: '30 Abr', rock: 20, jazz: 10, pop: 12, classic_rock: 38, folk: 20, soft_rock: 8, '70s': 5 },
        { week: '7 Mai', rock: 22, jazz: 12, pop: 10, classic_rock: 42, folk: 18, soft_rock: 12, '70s': 7 },
    ];

    const tagColors: Record<string, string> = {
        rock: '#6366f1',
        jazz: '#8b5cf6',
        pop: '#ec4899',
        classic_rock: '#14b8a6',
        folk: '#10b981',
        soft_rock: '#f472b6',
        '70s': '#a855f7',
    };

    /* ── Category card accent colors ── */
    const categoryColors = {
        artists: { bg: 'bg-purple-500/20', accent: '#a78bfa', label: 'Artistas', badge: 'Principal artista', badgeBg: 'bg-purple-500' },
        albums: { bg: 'bg-emerald-500/20', accent: '#34d399', label: 'Álbuns', badge: 'Principal álbum', badgeBg: 'bg-emerald-500' },
        tracks: { bg: 'bg-sky-500/20', accent: '#38bdf8', label: 'Faixas', badge: 'Faixa principal', badgeBg: 'bg-sky-500' },
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
                            ↑ {scrobbleChangePercent}% versus semana passada
                        </p>
                        <h2 className="text-4xl md:text-5xl font-black text-neutral-950 tracking-tighter leading-none">
                            {totalScrobbles.toLocaleString()} <span className="text-3xl md:text-4xl">scrobbles</span>
                        </h2>
                    </div>

                    {/* Right: Daily bar chart */}
                    <div className="flex flex-col items-end gap-2">
                        {/* Legend */}
                        <div className="flex items-center gap-4 text-[10px] font-bold text-neutral-900/60">
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-sm bg-neutral-900 inline-block" /> Essa semana
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-sm bg-neutral-900/30 inline-block" /> Semana passada
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
                    <button className="flex items-center gap-2 bg-neutral-950 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-neutral-800 transition-colors">
                        <Share2 size={14} />
                        COMPARTILHAR RESUMO
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
                        newLabel="Novos artistas"
                    />

                    {/* ─── ÁLBUNS ─── */}
                    <CategoryColumn
                        config={categoryColors.albums}
                        count={albumCount}
                        changePercent={albumChangePercent}
                        dailyValues={dailyValues}
                        topItem={topAlbum ? {
                            name: topAlbum.name,
                            subtitle: topAlbum.artist,
                            playcount: topAlbum.playcount,
                            image: topAlbum.image,
                        } : null}
                        list={albums.slice(1, 5).map(a => ({
                            name: a.name,
                            playcount: a.playcount,
                        }))}
                        newPercent={newAlbumsPercent}
                        newChange={newAlbumsChange}
                        newTopItem={albums.length > 2 ? {
                            name: albums[albums.length - 1]?.name || '',
                            playcount: albums[albums.length - 1]?.playcount || '0',
                            image: albums[albums.length - 1]?.image,
                        } : null}
                        newLabel="Novos álbuns"
                    />

                    {/* ─── FAIXAS ─── */}
                    <CategoryColumn
                        config={categoryColors.tracks}
                        count={trackCount}
                        changePercent={trackChangePercent}
                        dailyValues={dailyValues}
                        topItem={topTrack ? {
                            name: topTrack.name,
                            subtitle: topTrack.artist.name,
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
                        newLabel="Novas faixas"
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
                        Tabelas
                    </h2>
                    <div className="w-10 h-1 bg-emerald-400 mt-2 rounded-full" />
                </div>

                {/* Top row: Coeficiente Musical + Impressão Digital */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Coeficiente Musical (Radial) */}
                    <div className="bg-neutral-900/60 border border-white/5 rounded-2xl p-6">
                        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">
                            Coeficiente Musical
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
                                    { label: 'Faixas', value: totalScrobbles, prev: prevWeekScrobbles },
                                    { label: 'Álbuns', value: albumCount, prev: prevAlbumCount },
                                    { label: 'Artistas', value: artistCount, prev: prevArtistCount },
                                ].map(item => (
                                    <div key={item.label}>
                                        <p className="text-xs text-neutral-500 font-medium">{item.label}</p>
                                        <p className="text-2xl font-black text-white leading-none">{item.value}</p>
                                        <p className="text-[10px] text-neutral-500">vs. {item.prev} (semana passada)</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Impressão Digital (Radar) */}
                    <div className="bg-neutral-900/60 border border-white/5 rounded-2xl p-6">
                        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">
                            Impressão Digital do que Você Ouve
                        </h3>
                        <div className="flex items-center gap-4 mb-4">
                            <span className="flex items-center gap-1.5 text-[10px] text-neutral-400">
                                <span className="w-2 h-2 rounded-full bg-purple-400 inline-block" /> Você
                            </span>
                            <span className="flex items-center gap-1.5 text-[10px] text-neutral-400">
                                <span className="w-2 h-2 rounded-full bg-neutral-500 inline-block" /> Média global
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
                                        name="Média global"
                                        dataKey="global"
                                        stroke="#666"
                                        fill="#666"
                                        fillOpacity={0.15}
                                    />
                                    <Radar
                                        name="Você"
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
                        Tags Mais Ouvidas
                    </h3>
                    <div className="w-full h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={tagStreamData}>
                                <XAxis
                                    dataKey="week"
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
    topItem,
    list,
    newPercent,
    newChange,
    newTopItem,
    newLabel,
}: CategoryColumnProps) => {
    const topImageUrl = topItem?.image ? getImageUrl(topItem.image) : null;
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
                                {topItem.playcount} scrobbles
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
                    <p className="text-sm text-neutral-500 italic text-center py-4">Sem dados suficientes</p>
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
                                {newTopItem.playcount} scrobbles
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
