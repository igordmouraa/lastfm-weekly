'use client';

import { motion } from 'framer-motion';
import { Disc3 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface SemaninhaLoaderProps {
    message?: string;
    className?: string;
    size?: 'md' | 'lg';
}

export function SemaninhaLoader({ message, className, size = 'md' }: SemaninhaLoaderProps) {
    const t = useTranslations('semaninha.loading');
    const displayMessage = message ?? t('default');
    const discSize = size === 'lg' ? 'w-[4.5rem] h-[4.5rem]' : 'w-14 h-14';
    const iconSize = size === 'lg' ? 'w-8 h-8' : 'w-7 h-7';
    const animBox = size === 'lg' ? 'size-[7.5rem]' : 'size-[5.5rem]';
    const pulseSize = size === 'lg' ? 72 : 56;
    const dashSize = size === 'lg' ? 84 : 64;

    return (
        <div className={cn('flex flex-col items-center justify-center gap-6 text-center', className)}>
            <div className={cn('relative flex items-center justify-center overflow-hidden', animBox)}>
                <motion.div
                    className="absolute rounded-full border border-red-500/20"
                    style={{ width: pulseSize, height: pulseSize }}
                    animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.06, 0.4] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute rounded-full border border-dashed border-red-500/10"
                    style={{ width: dashSize, height: dashSize }}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: 'linear' }}
                    className={cn(
                        discSize,
                        'relative z-10 rounded-full bg-gradient-to-br from-red-500 via-red-700 to-red-950',
                        'flex items-center justify-center ring-1 ring-red-400/25'
                    )}
                >
                    <Disc3 className={cn(iconSize, 'text-white/95')} />
                </motion.div>
            </div>

            <div className="space-y-2 max-w-xs">
                <p className="text-sm font-medium text-white tracking-tight">{displayMessage}</p>
                <p className="text-xs text-neutral-500 leading-relaxed">{t('subtitle')}</p>
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
    cols?: number;
    rows?: number;
}

export function SemaninhaGridSkeleton({ cols = 5, rows = 5 }: SemaninhaGridSkeletonProps) {
    const cells = cols * rows;

    return (
        <div
            className="grid w-full max-w-lg mx-auto border border-white/8 overflow-hidden"
            style={{
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                aspectRatio: `${cols} / ${rows}`,
            }}
        >
            {Array.from({ length: cells }).map((_, i) => (
                <motion.div
                    key={i}
                    className="aspect-square bg-neutral-900"
                    initial={{ opacity: 0.35 }}
                    animate={{ opacity: [0.35, 0.65, 0.35] }}
                    transition={{ duration: 1.6, repeat: Infinity, delay: (i % cols) * 0.06, ease: 'easeInOut' }}
                />
            ))}
        </div>
    );
}
