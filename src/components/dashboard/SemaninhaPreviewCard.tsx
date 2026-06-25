'use client';

import Link from 'next/link';
import { CoverImage } from '@/components/CoverImage';
import { CollagePreviewItem } from '@/types/lastfm';
import { LayoutGrid, ArrowUpRight } from 'lucide-react';

interface SemaninhaPreviewCardProps {
    albums: CollagePreviewItem[];
    username: string;
}

export function SemaninhaPreviewCard({ albums, username }: SemaninhaPreviewCardProps) {
    const base = `/${encodeURIComponent(username)}/semaninha?grid=3x3&days=7&labels=0`;

    return (
        <Link
            href={base}
            className="group relative flex flex-col h-full rounded-2xl border border-white/8 bg-neutral-900/40 p-4 hover:border-red-500/30 transition-all duration-300 overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-start justify-between mb-3 relative">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-red-600/15 flex items-center justify-center">
                        <LayoutGrid className="w-4 h-4 text-red-400" />
                    </div>
                    <div>
                        <p className="text-sm font-bold">Semaninha</p>
                        <p className="text-[10px] text-neutral-500">Top 9 · 7 dias</p>
                    </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral-600 group-hover:text-red-400 transition-colors" />
            </div>
            <div className="flex-1 flex items-center justify-center relative">
                <div className="grid grid-cols-3 gap-px w-[108px] aspect-square rounded-lg overflow-hidden ring-1 ring-white/10 group-hover:ring-red-500/20 transition-all">
                    {albums.slice(0, 9).map((album, i) => (
                        <div key={i} className="aspect-square bg-neutral-800 overflow-hidden">
                            <CoverImage
                                src={album.imageUrl}
                                alt={album.name}
                                className="w-full h-full group-hover:scale-110 transition-transform duration-500"
                            />
                        </div>
                    ))}
                </div>
            </div>
            <p className="text-[10px] text-neutral-600 text-center mt-3 group-hover:text-red-400 transition-colors">
                Abrir editor
            </p>
        </Link>
    );
}
