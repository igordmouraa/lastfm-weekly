import { describe, it, expect } from 'vitest';
import { isAllowedImageHost, resolveImageSrc } from '@/lib/image-hosts';

describe('isAllowedImageHost', () => {
    it('aceita lastfm-img.freetls.fastly.net (fix principal)', () => {
        expect(isAllowedImageHost('lastfm-img.freetls.fastly.net')).toBe(true);
    });

    it('aceita lastfm.freetls.fastly.net (host legado)', () => {
        expect(isAllowedImageHost('lastfm.freetls.fastly.net')).toBe(true);
    });

    it('aceita *.dzcdn.net', () => {
        expect(isAllowedImageHost('cdn-images.dzcdn.net')).toBe(true);
    });

    it('aceita *.mzstatic.com (iTunes)', () => {
        expect(isAllowedImageHost('is1-ssl.mzstatic.com')).toBe(true);
    });

    it('bloqueia domínios arbitrários', () => {
        expect(isAllowedImageHost('evil.com')).toBe(false);
        expect(isAllowedImageHost('spotify.com')).toBe(false);
    });
});

describe('resolveImageSrc', () => {
    it('bypass direto para host confiável', () => {
        const url = 'https://lastfm-img.freetls.fastly.net/i/u/64s/abc.jpg';
        expect(resolveImageSrc(url)).toBe(url);
    });

    it('usa proxy para host desconhecido', () => {
        const url = 'https://unknown-cdn.example.com/image.jpg';
        expect(resolveImageSrc(url)).toContain('/api/proxy?url=');
    });
});
