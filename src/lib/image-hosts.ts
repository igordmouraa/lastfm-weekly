const IMAGE_PROXY_HOSTS = [
    'lastfm.freetls.fastly.net',
    'lastfm-img.freetls.fastly.net',
    'lastfm-img1.akamaized.net',
    'lastfm-img2.akamaized.net',
    'lastfm-img3.akamaized.net',
    'cdn-images.dzcdn.net',
    'e-cdns-images.dzcdn.net',
    'e-cdn-images.dzcdn.net',
];

export function isAllowedImageHost(hostname: string): boolean {
    if (IMAGE_PROXY_HOSTS.some((host) => hostname === host || hostname.endsWith(`.${host}`))) {
        return true;
    }
    // lastfm-img, lastfm-img1, lastfm-img2, ... no Fastly
    if (/^lastfm-img\d*\.freetls\.fastly\.net$/.test(hostname)) return true;
    if (/^lastfm-img\d+\.akamaized\.net$/.test(hostname)) return true;
    if (hostname.endsWith('.dzcdn.net')) return true;
    if (hostname.endsWith('.mzstatic.com')) return true;
    return false;
}

/** URLs de hosts confiáveis podem carregar direto no browser (sem passar pelo proxy). */
export function canBypassImageProxy(url: string): boolean {
    try {
        return isAllowedImageHost(new URL(url).hostname);
    } catch {
        return false;
    }
}

export function resolveImageSrc(url: string, forceProxy = false): string {
    if (!forceProxy && canBypassImageProxy(url)) return url;
    return `/api/proxy?url=${encodeURIComponent(url)}`;
}
