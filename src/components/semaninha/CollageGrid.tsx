'use client';

import { CoverImage } from '@/components/CoverImage';
import { truncateText } from '@/lib/images';
import { GridLayout } from '@/lib/semaninha-params';
import { CollageAlbum } from '@/lib/semaninha-params';
import { CollageGap, CollageLabelMode, CollageRadius } from './CollageControls';
import { cn } from '@/lib/utils';

const GAP_MAP: Record<CollageGap, string> = { '0': '0px', '1': '1px', '4': '4px', '8': '8px' };
const RADIUS_MAP: Record<CollageRadius, string> = { '0': '0px', 'md': '4px', 'lg': '8px', 'xl': '12px' };

interface CollageCellProps {
    album: CollageAlbum;
    showLabels: boolean;
    labelMode: CollageLabelMode;
    radius: CollageRadius;
}

function CollageCell({ album, showLabels, labelMode, radius }: CollageCellProps) {
    return (
        <div
            className="relative aspect-square overflow-hidden bg-neutral-800"
            style={{ borderRadius: RADIUS_MAP[radius] }}
        >
            <CoverImage src={album.imageUrl} alt={album.name} className="w-full h-full" forceProxy />
            {showLabels && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-2 py-1.5">
                    {(labelMode === 'both' || labelMode === 'artist') && (
                        <p className="text-[10px] font-medium text-white leading-tight truncate">
                            {truncateText(album.artist, 24)}
                        </p>
                    )}
                    {(labelMode === 'both' || labelMode === 'album') && (
                        <p className="text-[9px] text-white/70 leading-tight truncate">
                            {truncateText(album.name, 24)}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

interface CollageGridProps {
    albums: CollageAlbum[];
    layout: GridLayout;
    showLabels: boolean;
    gap?: CollageGap;
    radius?: CollageRadius;
    showBorder?: boolean;
    labelMode?: CollageLabelMode;
}

export function CollageGrid({
    albums,
    layout,
    showLabels,
    gap = '0',
    radius = '0',
    showBorder = true,
    labelMode = 'both',
}: CollageGridProps) {
    const emptyCells = Math.max(0, layout.count - albums.length);
    const isWide = layout.cols > layout.rows;

    return (
        <div
            className={cn(
                'grid w-full mx-auto',
                isWide ? 'max-w-2xl' : layout.rows > layout.cols ? 'max-w-sm' : 'max-w-lg',
                showBorder && 'border border-white/10'
            )}
            style={{
                gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
                gap: GAP_MAP[gap],
                aspectRatio: `${layout.cols} / ${layout.rows}`,
            }}
        >
            {albums.map((album, i) => (
                <CollageCell
                    key={`${album.name}-${album.artist}-${i}`}
                    album={album}
                    showLabels={showLabels}
                    labelMode={labelMode}
                    radius={radius}
                />
            ))}
            {Array.from({ length: emptyCells }).map((_, i) => (
                <div
                    key={`empty-${i}`}
                    className="aspect-square bg-neutral-900"
                    style={{ borderRadius: RADIUS_MAP[radius] }}
                />
            ))}
        </div>
    );
}
