export interface CollageAlbum {
    name: string;
    artist: string;
    playcount: number;
    imageUrl: string | null;
}

export type CollageCount = 9 | 25 | 100;
export type CollageGridSize = 3 | 5 | 10;
export type CollageDays = 7 | 15 | 30;

export function parseGridSize(grid: string): { size: CollageGridSize; count: CollageCount } {
    switch (grid) {
        case '3x3':
            return { size: 3, count: 9 };
        case '10x10':
            return { size: 10, count: 100 };
        default:
            return { size: 5, count: 25 };
    }
}

export function parseDays(days: string): CollageDays {
    const n = parseInt(days, 10);
    if (n === 15) return 15;
    if (n === 30) return 30;
    return 7;
}
