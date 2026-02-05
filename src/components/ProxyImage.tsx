'use client';

export const ProxyImage = ({ src, alt, className }: { src: string, alt: string, className?: string }) => {
    if (!src) return <div className={`bg-neutral-800 ${className}`} />;

    const proxyUrl = `/api/proxy?url=${encodeURIComponent(src)}`;

    return (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
            src={proxyUrl}
            alt={alt}
            className={className}
            crossOrigin="anonymous"
        />
    );
};