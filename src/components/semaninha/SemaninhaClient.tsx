'use client';

import { useCallback, useRef, useState } from 'react';
import {
    CollageAlbum,
    CollageDays,
    parseGridSize,
} from '@/lib/semaninha-params';
import { CollageGrid } from './CollageGrid';
import { CollageControls, CollageGap, CollageLabelMode, CollageRadius } from './CollageControls';
import { ExportPanel } from '@/hooks/useExportPng';
import { getSemaninhaLoadingMessage, SemaninhaLoader } from './SemaninhaLoader';
import { cn } from '@/lib/utils';

interface SemaninhaClientProps {
    username: string;
    albums: CollageAlbum[];
    grid: string;
    days: CollageDays;
    showLabels: boolean;
    gap: CollageGap;
    radius: CollageRadius;
    showBorder: boolean;
    labelMode: CollageLabelMode;
}

function isHeavySemaninhaLoad(days: number, grid: string): boolean {
    return days === 30 || grid === '10x10';
}

async function fetchCollageAlbums(username: string, days: CollageDays, count: number): Promise<CollageAlbum[]> {
    const res = await fetch(
        `/api/lastfm/user/${encodeURIComponent(username)}/collage?days=${days}&count=${count}`
    );
    if (!res.ok) throw new Error('fetch failed');
    return res.json();
}

export function SemaninhaClient({
    username,
    albums: initialAlbums,
    grid: initialGrid,
    days: initialDays,
    showLabels: initialShowLabels,
    gap: initialGap,
    radius: initialRadius,
    showBorder: initialShowBorder,
    labelMode: initialLabelMode,
}: SemaninhaClientProps) {
    const [grid, setGrid] = useState(initialGrid);
    const [days, setDays] = useState<CollageDays>(initialDays);
    const [showLabels, setShowLabels] = useState(initialShowLabels);
    const [gap, setGap] = useState<CollageGap>(initialGap);
    const [radius, setRadius] = useState<CollageRadius>(initialRadius);
    const [showBorder, setShowBorder] = useState(initialShowBorder);
    const [labelMode, setLabelMode] = useState<CollageLabelMode>(initialLabelMode);
    const [albums, setAlbums] = useState(initialAlbums);
    const [isFetching, setIsFetching] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState<string | null>(null);

    const albumCacheRef = useRef<Map<CollageDays, CollageAlbum[]>>(new Map([[initialDays, initialAlbums]]));
    const fetchGenRef = useRef(0);

    const { size: gridSize } = parseGridSize(grid);

    const syncUrl = useCallback(
        (updates: Record<string, string>) => {
            const params = new URLSearchParams(window.location.search);
            Object.entries(updates).forEach(([k, v]) => params.set(k, v));
            const path = `/${encodeURIComponent(username)}/semaninha?${params.toString()}`;
            window.history.replaceState(null, '', path);
        },
        [username]
    );

    const applyAlbumsFromCache = useCallback((targetDays: CollageDays, targetGrid: string) => {
        const { count } = parseGridSize(targetGrid);
        const cached = albumCacheRef.current.get(targetDays) ?? [];
        setAlbums(cached.slice(0, count));
        return cached.length >= count;
    }, []);

    const ensureAlbums = useCallback(
        async (targetDays: CollageDays, targetGrid: string) => {
            const { count } = parseGridSize(targetGrid);
            const cached = albumCacheRef.current.get(targetDays) ?? [];

            if (cached.length >= count) {
                setAlbums(cached.slice(0, count));
                return;
            }

            const generation = ++fetchGenRef.current;
            const heavy = isHeavySemaninhaLoad(targetDays, targetGrid);

            if (heavy) {
                setLoadingMessage(getSemaninhaLoadingMessage(targetDays, targetGrid));
            }
            setIsFetching(true);

            try {
                const fetched = await fetchCollageAlbums(username, targetDays, count);
                if (generation !== fetchGenRef.current) return;

                albumCacheRef.current.set(targetDays, fetched);
                setAlbums(fetched.slice(0, count));
            } catch {
                if (generation === fetchGenRef.current) {
                    applyAlbumsFromCache(targetDays, targetGrid);
                }
            } finally {
                if (generation === fetchGenRef.current) {
                    setIsFetching(false);
                    setLoadingMessage(null);
                }
            }
        },
        [username, applyAlbumsFromCache]
    );

    const handleGridChange = (nextGrid: string) => {
        setGrid(nextGrid);
        syncUrl({ grid: nextGrid });

        if (applyAlbumsFromCache(days, nextGrid)) return;
        void ensureAlbums(days, nextGrid);
    };

    const handleDaysChange = (nextDays: CollageDays) => {
        setDays(nextDays);
        syncUrl({ days: String(nextDays) });

        if (applyAlbumsFromCache(nextDays, grid)) return;
        void ensureAlbums(nextDays, grid);
    };

    const showLoading = isFetching && loadingMessage !== null;

    return (
        <div className="grid lg:grid-cols-2 gap-10 items-start">
            <CollageControls
                grid={grid}
                days={days}
                showLabels={showLabels}
                gap={gap}
                radius={radius}
                showBorder={showBorder}
                labelMode={labelMode}
                disabled={isFetching}
                onGridChange={handleGridChange}
                onDaysChange={handleDaysChange}
                onLabelsChange={(show) => {
                    setShowLabels(show);
                    syncUrl({ labels: show ? '1' : '0' });
                }}
                onGapChange={(g) => {
                    setGap(g);
                    syncUrl({ gap: g });
                }}
                onRadiusChange={(r) => {
                    setRadius(r);
                    syncUrl({ radius: r });
                }}
                onBorderChange={(show) => {
                    setShowBorder(show);
                    syncUrl({ border: show ? '1' : '0' });
                }}
                onLabelModeChange={(mode) => {
                    setLabelMode(mode);
                    syncUrl({ labelMode: mode });
                }}
            />

            <div className="relative">
                <ExportPanel filename={`semaninha-${username}-${grid}.png`}>
                    <CollageGrid
                        albums={albums}
                        gridSize={gridSize}
                        showLabels={showLabels}
                        gap={gap}
                        radius={radius}
                        showBorder={showBorder}
                        labelMode={labelMode}
                    />
                </ExportPanel>

                {showLoading && (
                    <div
                        className={cn(
                            'absolute inset-0 z-20 flex items-center justify-center',
                            'rounded-xl bg-neutral-950/75 backdrop-blur-md border border-white/5'
                        )}
                        aria-live="polite"
                        aria-busy="true"
                    >
                        <SemaninhaLoader message={loadingMessage} size="lg" />
                    </div>
                )}
            </div>
        </div>
    );
}
