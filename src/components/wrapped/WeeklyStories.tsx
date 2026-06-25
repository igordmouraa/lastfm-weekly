'use client';

import { forwardRef } from 'react';
import { CoverImage } from '@/components/CoverImage';
import { WeeklyData, LastFmTrack, LastFmArtist } from '@/types/lastfm';
import { getImageUrl, truncateText } from '@/lib/images';
import { cn } from '@/lib/utils';

interface WeeklyStoriesProps {
    data: WeeklyData;
    variant?: 'full' | 'preview';
}

const LastFmLogo = () => (
    <svg viewBox="0 0 512 512" fill="currentColor" className="w-8 h-8 text-red-500" xmlns="http://www.w3.org/2000/svg">
        <path d="M308.214,337.861l-5.663-13.064L253.93,209.107c-16.056-40.931-56.085-68.601-101.198-68.601 c-61.043,0-110.576,51.706-110.576,115.524c0,63.756,49.533,115.493,110.576,115.493c42.618,0,79.604-25.164,98.062-62.007 l19.668,47.329c-27.876,35.526-70.298,58.155-117.729,58.155C68.645,415.002,0.5,343.886,0.5,256.031 c0-87.834,68.145-159.033,152.231-159.033c63.446,0,114.696,35.361,140.741,98.093c1.946,4.865,27.516,67.255,49.834,120.369 c13.788,32.856,25.537,54.678,63.776,56.023c37.441,1.325,63.249-22.484,63.249-52.648c0-29.45-19.7-36.542-52.825-48.042 c-59.543-20.486-90.308-41.065-90.308-90.401c0-48.115,31.303-80.205,82.295-80.205c33.137,0,57.162,15.424,73.756,46.169 l-32.618,17.37c-12.235-17.909-25.765-25-42.97-25c-23.934,0-40.94,17.381-40.94,40.465c0,32.805,28.095,37.742,67.348,51.179 c52.866,17.981,77.431,38.529,77.431,89.801c0,53.86-44.232,93.093-102.006,93.01C356.256,412.942,327.861,385.769,308.214,337.861 z"/>
    </svg>
);

export const WeeklyStories = forwardRef<HTMLDivElement, WeeklyStoriesProps>(({ data, variant = 'full' }, ref) => {
    const { user, artists, tracks, totalScrobbles } = data;
    const isPreview = variant === 'preview';

    return (
        <div
            ref={ref}
            style={{ fontFamily: 'var(--font-body-family), sans-serif' }}
            className={cn(
                'bg-neutral-950 p-6 text-white flex flex-col shadow-2xl relative overflow-hidden select-none shrink-0',
                isPreview ? 'w-[280px] h-[498px] text-[0.9em]' : 'w-[360px] h-[640px]'
            )}
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-red-900/20 via-neutral-950 to-neutral-950 pointer-events-none" />

            <div className="z-10 mt-2 mb-4">
                <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xs font-bold text-red-500 tracking-widest uppercase mt-1">Últimos 7 dias</h2>
                    <LastFmLogo />
                </div>
                <h1 className="text-4xl font-black leading-[0.9] tracking-tighter mb-2">
                    Cápsula Musical<br />Semanal
                </h1>
                <p className="text-sm text-neutral-400 font-medium">@{user.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-x-3 z-10 flex-1 min-h-0 py-2">
                <div className="flex flex-col min-h-0 min-w-0">
                    <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest border-b border-white/10 pb-2 mb-3">
                        Top Músicas
                    </h3>
                    <ul className="flex flex-col justify-between flex-1 min-h-0 gap-1">
                        {tracks.slice(0, 5).map((track, i) => {
                            const imageUrl = (track as LastFmTrack & { imageUrl?: string | null }).imageUrl;
                            return (
                            <li key={`${track.name}-${i}`} className="flex items-center gap-3 group">
                                <span className="text-sm font-bold text-red-500 min-w-3">{i + 1}</span>
                                <CoverImage
                                    src={imageUrl ?? getImageUrl(track.image)}
                                    alt={track.name}
                                    className="w-9 h-9 rounded shrink-0"
                                    forceProxy={!isPreview}
                                />
                                <div className="flex flex-col min-w-0 justify-center flex-1">
                                    <span className="font-bold text-[11px] leading-tight truncate">{truncateText(track.name, 25)}</span>
                                    <span className="text-[10px] text-neutral-400 truncate">{truncateText(track.artist?.name ?? '', 20)}</span>
                                </div>
                            </li>
                            );
                        })}
                    </ul>
                </div>

                <div className="flex flex-col min-h-0 min-w-0">
                    <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest border-b border-white/10 pb-2 mb-3">
                        Top Artistas
                    </h3>
                    <ul className="flex flex-col justify-between flex-1 min-h-0 gap-1">
                        {artists.slice(0, 5).map((artist: LastFmArtist, i: number) => {
                            const imageUrl = (artist as LastFmArtist & { imageUrl?: string | null }).imageUrl;
                            return (
                            <li key={`${artist.name}-${i}`} className="flex items-center gap-2 min-h-9 min-w-0">
                                <span className="text-sm font-bold text-red-500 w-3 shrink-0">{i + 1}</span>
                                {!isPreview && (
                                    <CoverImage
                                        src={imageUrl ?? getImageUrl(artist.image)}
                                        alt={artist.name}
                                        className="w-8 h-8 rounded-full shrink-0 ring-1 ring-white/10"
                                        forceProxy
                                    />
                                )}
                                <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
                                    <span className="font-bold text-[11px] leading-tight truncate">{truncateText(artist.name, 20)}</span>
                                    <span className="text-[10px] text-neutral-400 truncate">{artist.playcount} plays</span>
                                </div>
                            </li>
                            );
                        })}
                    </ul>
                </div>
            </div>

            <div className="z-10 pt-4 border-t border-white/10 mt-auto">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">Tempo (est.)</p>
                        <p className="text-3xl font-black text-white tracking-tighter leading-none">
                            {(totalScrobbles * 3.5).toFixed(0)} <span className="text-sm font-bold text-red-500">min</span>
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">Scrobbles</p>
                        <p className="text-xl font-bold text-white">{totalScrobbles.toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
});

WeeklyStories.displayName = 'WeeklyStories';
