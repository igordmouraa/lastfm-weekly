import { LastFmImage } from '@/types/lastfm';
import { LASTFM_PLACEHOLDER_PREFIX } from '@/lib/lastfm/images';

export type ImageTier = 'thumb' | 'standard' | 'large';

const TIER_ORDER: Record<ImageTier, LastFmImage['size'][]> = {
    thumb: ['small', 'medium', 'large', 'extralarge'],
    standard: ['medium', 'large', 'extralarge'],
    large: ['extralarge', 'mega', 'large'],
};

export function isLastFmPlaceholder(url: string | null | undefined): boolean {
    if (!url || url.trim() === '') return true;
    return url.includes(LASTFM_PLACEHOLDER_PREFIX);
}

function pickFromImages(images: LastFmImage[], tier: ImageTier): string | null {
    for (const size of TIER_ORDER[tier]) {
        const url = images.find((img) => img.size === size)?.['#text'];
        if (url && !isLastFmPlaceholder(url)) return url;
    }
    return null;
}

export function getImageUrl(
    images: LastFmImage[] | undefined,
    tier: ImageTier = 'standard'
): string | null {
    if (!images || !Array.isArray(images)) return null;
    return pickFromImages(images, tier);
}

function lastFmSizeToken(displayPx: number): string {
    const px = displayPx * 2;
    if (px <= 40) return '34s';
    if (px <= 80) return '64s';
    if (px <= 180) return '174s';
    return '300x300';
}

function parseLastFmSizeToken(token: string): number {
    if (token === '34s') return 34;
    if (token === '64s') return 64;
    if (token === '174s') return 174;
    const match = token.match(/^(\d+)x(\d+)$/);
    if (match) return parseInt(match[1], 10);
    return 300;
}

function optimizeLastFmUrl(url: string, displayPx: number): string {
    if (/\.gif(\?|$)/i.test(url)) return url;
    const match = url.match(/\/i\/u\/([^/]+)\//);
    if (!match) return url;
    const token = lastFmSizeToken(displayPx);
    const currentPx = parseLastFmSizeToken(match[1]);
    const targetPx = parseLastFmSizeToken(token);
    if (currentPx <= targetPx) return url;
    return url.replace(/\/i\/u\/[^/]+\//, `/i/u/${token}/`);
}

function parseDeezerSize(url: string): number {
    const match = url.match(/\/(\d+)x(\d+)-/);
    return match ? parseInt(match[1], 10) : 1000;
}

function optimizeDeezerUrl(url: string, displayPx: number): string {
    const px = displayPx * 2;
    const target = px <= 56 ? 56 : px <= 250 ? 250 : 500;
    const current = parseDeezerSize(url);
    if (current <= target) return url;
    const size = `${target}x${target}`;
    if (/\/\d+x\d+(-\d+-\d+-\d+-\d+\.\w+)/.test(url)) {
        return url.replace(/\/\d+x\d+(-\d+-\d+-\d+-\d+\.\w+)/, `/${size}$1`);
    }
    return url.replace(/\/\d+x\d+(-000000-80-0-0\.\w+)/, `/${size}$1`);
}

function parseItunesSize(url: string): number {
    const match = url.match(/(\d+)x(\d+)bb/);
    return match ? parseInt(match[1], 10) : 600;
}

function optimizeItunesUrl(url: string, displayPx: number): string {
    const target = Math.min(displayPx * 2, 600);
    const current = parseItunesSize(url);
    if (current <= target) return url;
    return url.replace(/\d+x\d+bb/, `${target}x${target}bb`);
}

export function optimizeImageUrl(url: string | null | undefined, displayPx: number): string | null {
    if (!url) return null;
    try {
        const hostname = new URL(url).hostname;
        if (hostname.includes('lastfm') || hostname.includes('akamaized.net')) {
            return optimizeLastFmUrl(url, displayPx);
        }
        if (hostname.includes('dzcdn.net')) {
            return optimizeDeezerUrl(url, displayPx);
        }
        if (hostname.includes('mzstatic.com')) {
            return optimizeItunesUrl(url, displayPx);
        }
    } catch {
        return url;
    }
    return url;
}

export function truncateText(text: string, maxLength: number): string {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}

export function hasValidImageURL(images: LastFmImage[] | undefined): boolean {
    return getImageUrl(images) !== null;
}
