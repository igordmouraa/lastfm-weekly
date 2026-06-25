'use client';

import { motion } from 'framer-motion';
import { Disc3 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function getSemaninhaLoadingMessage(days: number, grid: string): string {
    const isLargeGrid = grid === '10x10';
    const isLongPeriod = days === 30;

    if (isLargeGrid && isLongPeriod) return 'Grade 10×10 dos últimos 30 dias';
    if (isLargeGrid) return 'Montando grade 10×10';
    if (isLongPeriod) return 'Buscando álbuns dos últimos 30 dias';
    if (days === 15) return 'Varrendo os últimos 15 dias';
    return 'Atualizando sua grade';
}

interface SemaninhaLoaderProps {
    message?: string;
    className?: string;
    size?: 'md' | 'lg';
}

export function SemaninhaLoader({ message = 'Montando sua grade', className, size = 'md' }: SemaninhaLoaderProps) {
    const discSize = size === 'lg' ? 'w-[4.5rem] h-[4.5rem]' : 'w-14 h-14';
    const iconSize = size === 'lg' ? 'w-8 h-8' : 'w-7 h-7';

    return (
        <div className={cn('flex flex-col items-center justify-center gap-6 text-center', className)}>
            <div className="relative flex items-center justify-center">
                <motion.div
                    className="absolute rounded-full border border-red-500/25"
                    style={{ width: size === 'lg' ? 88 : 72, height: size === 'lg' ? 88 : 72 }}
                    animate={{ scale: [1, 1.18, 1], opacity: [0.55, 0.08, 0.55] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute rounded-full border border-dashed border-red-500/15"
                    style={{ width: size === 'lg' ? 104 : 84, height: size === 'lg' ? 104 : 84 }}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: 'linear' }}
                    className={cn(
                        discSize,
                        'rounded-full bg-gradient-to-br from-red-500 via-red-700 to-red-950',
                        'flex items-center justify-center shadow-xl shadow-red-950/50 ring-1 ring-red-400/20'
                    )}
                >
                    <Disc3 className={cn(iconSize, 'text-white/95')} />
                </motion.div>
            </div>

            <div className="space-y-2 max-w-xs">
                <p className="text-sm font-medium text-white tracking-tight">{message}</p>
                <p className="text-xs text-neutral-500 leading-relaxed">
                    Resolvendo capas e montando a collage
                </p>
                <div className="flex justify-center gap-1 pt-1">
                    {[0, 1, 2].map((i) => (
                        <motion.span
                            key={i}
                            className="w-1 h-1 rounded-full bg-red-500"
                            animate={{ opacity: [0.25, 1, 0.25], scale: [0.85, 1.15, 0.85] }}
                            transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

interface SemaninhaGridSkeletonProps {
    gridSize?: 3 | 5 | 10;
}

export function SemaninhaGridSkeleton({ gridSize = 5 }: SemaninhaGridSkeletonProps) {
    const cells = gridSize * gridSize;

    return (
        <div
            className="grid w-full max-w-lg mx-auto border border-white/8 aspect-square overflow-hidden"
            style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
        >
            {Array.from({ length: cells }).map((_, i) => (
                <motion.div
                    key={i}
                    className="bg-neutral-900"
                    initial={{ opacity: 0.35 }}
                    animate={{ opacity: [0.35, 0.65, 0.35] }}
                    transition={{ duration: 1.6, repeat: Infinity, delay: (i % gridSize) * 0.06, ease: 'easeInOut' }}
                />
            ))}
        </div>
    );
}
