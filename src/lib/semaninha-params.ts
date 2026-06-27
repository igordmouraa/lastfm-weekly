export interface CollageAlbum {
    name: string;
    artist: string;
    playcount: number;
    imageUrl: string | null;
}

export type CollageDays = 7 | 15 | 30;

export interface GridLayout {
    key: string;
    cols: number;
    rows: number;
    count: number;
}

export const GRID_PRESET_GROUPS = {
    square: ['3x3', '4x4', '5x5', '6x6', '10x10'],
    wide: ['3x2', '4x3', '5x3', '5x4', '6x4'],
    tall: ['2x3', '3x4', '3x5', '4x5'],
} as const;

export type GridPresetKey =
    | (typeof GRID_PRESET_GROUPS.square)[number]
    | (typeof GRID_PRESET_GROUPS.wide)[number]
    | (typeof GRID_PRESET_GROUPS.tall)[number];

const PRESET_DEFINITIONS: Record<GridPresetKey, Omit<GridLayout, 'key'>> = {
    '3x3': { cols: 3, rows: 3, count: 9 },
    '4x4': { cols: 4, rows: 4, count: 16 },
    '5x5': { cols: 5, rows: 5, count: 25 },
    '6x6': { cols: 6, rows: 6, count: 36 },
    '10x10': { cols: 10, rows: 10, count: 100 },
    '3x2': { cols: 3, rows: 2, count: 6 },
    '4x3': { cols: 4, rows: 3, count: 12 },
    '5x3': { cols: 5, rows: 3, count: 15 },
    '5x4': { cols: 5, rows: 4, count: 20 },
    '6x4': { cols: 6, rows: 4, count: 24 },
    '2x3': { cols: 2, rows: 3, count: 6 },
    '3x4': { cols: 3, rows: 4, count: 12 },
    '3x5': { cols: 3, rows: 5, count: 15 },
    '4x5': { cols: 4, rows: 5, count: 20 },
};

export const GRID_PRESETS: GridLayout[] = Object.entries(PRESET_DEFINITIONS).map(([key, layout]) => ({
    key,
    ...layout,
}));

export const DEFAULT_GRID = '5x5';

export const MIN_COLLAGE_COUNT = 4;
export const MAX_COLLAGE_COUNT = 100;

export function parseGridSize(grid: string): GridLayout {
    const preset = PRESET_DEFINITIONS[grid as GridPresetKey];
    if (preset) {
        return { key: grid, ...preset };
    }

    const match = grid.match(/^(\d+)x(\d+)$/i);
    if (match) {
        const cols = parseInt(match[1], 10);
        const rows = parseInt(match[2], 10);
        const count = cols * rows;
        if (
            cols >= 2 &&
            cols <= 10 &&
            rows >= 2 &&
            rows <= 10 &&
            count >= MIN_COLLAGE_COUNT &&
            count <= MAX_COLLAGE_COUNT
        ) {
            return { key: `${cols}x${rows}`, cols, rows, count };
        }
    }

    return { key: DEFAULT_GRID, ...PRESET_DEFINITIONS[DEFAULT_GRID] };
}

export function clampCollageCount(count: number): number {
    if (!Number.isFinite(count)) return 25;
    return Math.min(MAX_COLLAGE_COUNT, Math.max(MIN_COLLAGE_COUNT, Math.round(count)));
}

export function isHeavyGridLayout(layout: GridLayout): boolean {
    return layout.count >= 64;
}

export function getGridGroup(key: string): keyof typeof GRID_PRESET_GROUPS {
    if ((GRID_PRESET_GROUPS.wide as readonly string[]).includes(key)) return 'wide';
    if ((GRID_PRESET_GROUPS.tall as readonly string[]).includes(key)) return 'tall';
    return 'square';
}

export function parseDays(days: string): CollageDays {
    const n = parseInt(days, 10);
    if (n === 15) return 15;
    if (n === 30) return 30;
    return 7;
}
