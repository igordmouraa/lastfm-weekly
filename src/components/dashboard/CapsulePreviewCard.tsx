'use client';

import Link from 'next/link';
import { WeeklyData } from '@/types/lastfm';
import { WeeklyStories } from '@/components/wrapped/WeeklyStories';
import { Sparkles, ArrowUpRight } from 'lucide-react';

interface CapsulePreviewCardProps {
    data: WeeklyData;
    username: string;
}

export function CapsulePreviewCard({ data, username }: CapsulePreviewCardProps) {
    const exportHref = `/${encodeURIComponent(username)}/week`;

    return (
        <div className="group relative flex flex-col h-full rounded-2xl border border-white/8 bg-neutral-900/40 p-4 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-bl from-pink-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="flex items-start justify-between mb-3 relative">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-pink-600/15 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-pink-400" />
                    </div>
                    <div>
                        <p className="text-sm font-bold">Cápsula</p>
                        <p className="text-[10px] text-neutral-500">Stories semanal</p>
                    </div>
                </div>
                <Link
                    href={exportHref}
                    className="inline-flex items-center gap-1 text-[10px] text-neutral-500 hover:text-pink-400 transition-colors"
                >
                    Exportar <ArrowUpRight className="w-3 h-3" />
                </Link>
            </div>
            <div className="flex-1 flex items-center justify-center relative min-h-[160px]">
                <div className="relative w-[126px] h-[224px] overflow-hidden rounded-xl ring-1 ring-white/10 shadow-lg shadow-black/40 group-hover:ring-pink-500/20 transition-all">
                    <div
                        className="absolute top-0 left-1/2 origin-top"
                        style={{ transform: 'translateX(-50%) scale(0.45)' }}
                    >
                        <WeeklyStories data={data} variant="preview" />
                    </div>
                </div>
            </div>
            <Link
                href={exportHref}
                className="text-[10px] text-neutral-600 text-center mt-2 group-hover:text-pink-400 transition-colors"
            >
                Ver em tamanho real
            </Link>
        </div>
    );
}
