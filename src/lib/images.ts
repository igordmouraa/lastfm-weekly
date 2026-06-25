import { LastFmImage } from '@/types/lastfm';
import { LASTFM_PLACEHOLDER_PREFIX } from '@/lib/lastfm/images';

export function isLastFmPlaceholder(url: string | null | undefined): boolean {
    if (!url || url.trim() === '') return true;
    return url.includes(LASTFM_PLACEHOLDER_PREFIX);
}

export function getImageUrl(images: LastFmImage[] | undefined): string | null {
    if (!images || !Array.isArray(images)) return null;
    const mega = images.find((img) => img.size === 'mega')?.['#text'];
    const extralarge = images.find((img) => img.size === 'extralarge')?.['#text'];
    const large = images.find((img) => img.size === 'large')?.['#text'];
    const medium = images.find((img) => img.size === 'medium')?.['#text'];
    const url = mega || extralarge || large || medium || null;
    if (!url || isLastFmPlaceholder(url)) return null;
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
