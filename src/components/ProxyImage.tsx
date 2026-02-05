'use client';

import { useState } from "react";

interface ProxyImageProps {
    src: string | null;
    alt: string;
    className?: string;
}

export const ProxyImage = ({ src, alt, className }: ProxyImageProps) => {
    const [hasError, setHasError] = useState(false);

    if (!src || hasError) {
        return <div className={`bg-neutral-800 ${className}`} aria-label={alt} />;
    }

    const proxyUrl = `/api/proxy?url=${encodeURIComponent(src)}`;

    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={proxyUrl}
            alt={alt}
            className={className}
            crossOrigin="anonymous"
            onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                setHasError(true);
            }}
        />
    );
};