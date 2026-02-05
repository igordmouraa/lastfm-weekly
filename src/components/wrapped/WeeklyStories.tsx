'use client';

import { forwardRef } from 'react';
import { WeeklyData, LastFmImage, LastFmTrack, LastFmArtist } from "@/types/lastfm";

interface WeeklyStoriesProps {
    data: WeeklyData;
}

const getImageUrl = (images: LastFmImage[]) => {
    if (!images || !Array.isArray(images)) return null;
    const mega = images.find((img) => img.size === 'mega')?.['#text'];
    const extralarge = images.find((img) => img.size === 'extralarge')?.['#text'];
    const large = images.find((img) => img.size === 'large')?.['#text'];
    return mega || extralarge || large || null;
};

const ProxyImage = ({ src, alt, className }: { src: string, alt: string, className?: string }) => {
    // Aponta para sua nova rota de API
    const proxyUrl = `/api/proxy?url=${encodeURIComponent(src)}`;

    return (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
            src={proxyUrl}
            alt={alt}
            className={className}
            crossOrigin="anonymous"
        />
    );
};

const LastFmLogo = () => (
    <svg viewBox="0 0 512 512" fill="currentColor" className="w-8 h-8 text-red-500" xmlns="http://www.w3.org/2000/svg">
        <path d="M308.214,337.861l-5.663-13.064L253.93,209.107c-16.056-40.931-56.085-68.601-101.198-68.601 c-61.043,0-110.576,51.706-110.576,115.524c0,63.756,49.533,115.493,110.576,115.493c42.618,0,79.604-25.164,98.062-62.007 l19.668,47.329c-27.876,35.526-70.298,58.155-117.729,58.155C68.645,415.002,0.5,343.886,0.5,256.031 c0-87.834,68.145-159.033,152.231-159.033c63.446,0,114.696,35.361,140.741,98.093c1.946,4.865,27.516,67.255,49.834,120.369 c13.788,32.856,25.537,54.678,63.776,56.023c37.441,1.325,63.249-22.484,63.249-52.648c0-29.45-19.7-36.542-52.825-48.042 c-59.543-20.486-90.308-41.065-90.308-90.401c0-48.115,31.303-80.205,82.295-80.205c33.137,0,57.162,15.424,73.756,46.169 l-32.618,17.37c-12.235-17.909-25.765-25-42.97-25c-23.934,0-40.94,17.381-40.94,40.465c0,32.805,28.095,37.742,67.348,51.179 c52.866,17.981,77.431,38.529,77.431,89.801c0,53.86-44.232,93.093-102.006,93.01C356.256,412.942,327.861,385.769,308.214,337.861 z"/>
    </svg>
);

export const WeeklyStories = forwardRef<HTMLDivElement, WeeklyStoriesProps>(({ data }, ref) => {
    const { user, artists, tracks, totalScrobbles } = data;

    return (
        <div
            ref={ref}
            className="w-90 h-160 bg-neutral-950 p-6 text-white flex flex-col shadow-2xl relative overflow-hidden font-sans justify-between"
        >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-red-900/20 via-neutral-950 to-neutral-950 pointer-events-none" />

            {/* Header */}
            <div className="z-10 mt-2 mb-4">
                <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xs font-bold text-red-500 tracking-widest uppercase mt-1">
                        Últimos 7 dias
                    </h2>
                    <LastFmLogo />
                </div>

                <h1 className="text-4xl font-black leading-[0.9] tracking-tighter mb-2">
                    Minha Cápsula<br/>Semanal
                </h1>
                <p className="text-sm text-neutral-400 font-medium">@{user.name}</p>
            </div>

            {/* Conteúdo Grid */}
            <div className="grid grid-cols-2 gap-x-6 z-10 grow h-full py-2">

                {/* Esquerda: Músicas */}
                <div className="flex flex-col h-full">
                    <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest border-b border-white/10 pb-2 mb-4">
                        Top Músicas
                    </h3>
                    <ul className="flex flex-col justify-between h-full max-h-80">
                        {tracks.slice(0, 5).map((track: LastFmTrack, i: number) => {
                            const trackImg = getImageUrl(track.image);
                            return (
                                <li key={`${track.name}-${i}`} className="flex items-center gap-3 group">
                                    <span className="text-sm font-bold text-red-500 min-w-3">{i + 1}</span>

                                    {/* Capa da Música via Proxy */}
                                    <div className="relative w-9 h-9 rounded overflow-hidden bg-white/10 shrink-0 shadow-lg border border-white/10">
                                        {trackImg && (
                                            <ProxyImage
                                                src={trackImg}
                                                alt={track.name}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>

                                    <div className="flex flex-col min-w-0 justify-center">
                                        <span className="font-bold text-[11px] leading-tight w-full group-hover:text-red-400 transition-colors">
                                            {track.name}
                                        </span>
                                        <span className="text-[10px] text-neutral-400 truncate w-full leading-tight mt-0.5">
                                            {track.artist.name}
                                        </span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Direita: Artistas */}
                <div className="flex flex-col h-full">
                    <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest border-b border-white/10 pb-2 mb-4 text-right">
                        Top Artistas
                    </h3>
                    <ul className="flex flex-col justify-between h-full max-h-80">
                        {artists.slice(0, 5).map((artist: LastFmArtist, i: number) => (
                            <li key={`${artist.name}-${i}`} className="flex flex-row-reverse items-center gap-3 text-right group h-9">
                                <span className="text-sm font-bold text-red-500 min-w-3">{i + 1}</span>

                                <div className="flex flex-col items-end min-w-0 justify-center">
                                    <span className="font-bold text-[11px] leading-tight w-full group-hover:text-red-400 transition-colors">
                                        {artist.name}
                                    </span>
                                    <span className="text-[10px] text-neutral-400 bg-white/5 px-1.5 rounded-sm mt-0.5 leading-tight inline-block">
                                        {artist.playcount} plays
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Footer */}
            <div className="z-10 pt-4 border-t border-white/10 mt-auto">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-0.5">Tempo total (Est.)</p>
                        <p className="text-3xl font-black text-white tracking-tighter leading-none">
                            {(totalScrobbles * 3.5).toFixed(0)} <span className="text-sm font-bold text-red-500">min</span>
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-0.5">Total Plays</p>
                        <p className="text-xl font-bold text-white tracking-tight leading-none">
                            {totalScrobbles.toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
});

WeeklyStories.displayName = "WeeklyStories";