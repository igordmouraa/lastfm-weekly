/** Formata slug/nome de tag do Last.fm para exibição legível */
export function formatTagName(tag: string): string {
    return tag.replace(/\b([a-z0-9&]+)\b/gi, (word) => {
        const w = word.toLowerCase();
        if (/^\d{2,4}s$/.test(w)) return w;
        if (w === 'r&b') return 'R&B';
        if (w === 'uk') return 'UK';
        if (w === 'us') return 'US';
        if (w === 'edm') return 'EDM';
        return w.charAt(0).toUpperCase() + w.slice(1);
    });
}
