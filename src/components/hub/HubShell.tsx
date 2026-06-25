'use client';

import { ReactNode } from 'react';
import { NoiseBackground, GradientBlobs } from '@/components/ui/background-elements';
import { Footer } from '@/components/ui/footer';

interface HubShellProps {
    children: ReactNode;
    showMarquee?: boolean;
    marqueeTop?: string[];
    marqueeBottom?: string[];
}

const DEFAULT_GENRES = ['ROCK', 'INDIE', 'POP', 'JAZZ', 'MPB', 'HIP HOP', 'SOUL', 'METAL'];
const DEFAULT_VIBES = ['WEEKSTER', 'WRAPPED', 'CAPSULA', 'GRADE', 'SCROBBLE', 'TAGS', 'CHARTS'];

export function HubShell({
    children,
    showMarquee = false,
    marqueeTop = DEFAULT_GENRES,
    marqueeBottom = DEFAULT_VIBES,
}: HubShellProps) {
    return (
        <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden selection:bg-red-500/30 flex flex-col">
            <NoiseBackground />
            <GradientBlobs />
            {showMarquee && (
                <>
                    <div className="absolute top-20 w-[120%] -left-[10%] -rotate-3 z-0 mix-blend-overlay pointer-events-none opacity-10">
                        <MarqueeStatic items={marqueeTop} />
                    </div>
                    <div className="absolute bottom-20 w-[120%] -left-[10%] rotate-2 z-0 mix-blend-overlay pointer-events-none opacity-10">
                        <MarqueeStatic items={marqueeBottom} direction="right" />
                    </div>
                </>
            )}
            <div className="relative z-10 grow flex flex-col">{children}</div>
            <Footer />
        </div>
    );
}

function MarqueeStatic({ items, direction = 'left' }: { items: string[]; direction?: 'left' | 'right' }) {
    const repeated = [...items, ...items, ...items];
    return (
        <div className={`flex gap-12 py-4 whitespace-nowrap ${direction === 'right' ? 'flex-row-reverse' : ''}`}>
            {repeated.map((item, i) => (
                <span key={i} className="text-8xl font-black text-white uppercase tracking-tighter">
                    {item}
                </span>
            ))}
        </div>
    );
}
