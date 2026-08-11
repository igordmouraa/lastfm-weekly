import { describe, it, expect } from 'vitest';
import { isLastFmPlaceholderUrl, getValidImageUrl } from '@/lib/lastfm/resolve-image';

const PLACEHOLDER_URL =
    'https://lastfm-img.freetls.fastly.net/i/u/34s/2a96cbd8b46e442fc41c2b86b821562f.png';
const VALID_URL = 'https://lastfm-img.freetls.fastly.net/i/u/174s/realcover.jpg';

describe('isLastFmPlaceholderUrl', () => {
    it('detecta o hash placeholder', () => {
        expect(isLastFmPlaceholderUrl(PLACEHOLDER_URL)).toBe(true);
    });

    it('não sinaliza URLs reais como placeholder', () => {
        expect(isLastFmPlaceholderUrl(VALID_URL)).toBe(false);
    });

    it('trata null/undefined como placeholder', () => {
        expect(isLastFmPlaceholderUrl(null)).toBe(true);
        expect(isLastFmPlaceholderUrl(undefined)).toBe(true);
    });
});

describe('getValidImageUrl', () => {
    it('retorna null para array só com placeholder', () => {
        const images = [{ size: 'large', '#text': PLACEHOLDER_URL }];
        expect(getValidImageUrl(images)).toBeNull();
    });

    it('retorna a URL válida quando presente', () => {
        const images = [{ size: 'large', '#text': VALID_URL }];
        expect(getValidImageUrl(images)).toBe(VALID_URL);
    });
});
