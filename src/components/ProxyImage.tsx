'use client';

import { useState } from "react";
import { resolveImageSrc } from '@/lib/image-hosts';

interface ProxyImageProps {
    src: string | null;
    alt: string;
    className?: string;
    forceProxy?: boolean;
}

export const ProxyImage = ({ src, alt, className, forceProxy = false }: ProxyImageProps) => {
    const [hasError, setHasError] = useState(false);

    if (!src || hasError) {
        return <div className={`bg-neutral-800 ${className}`} aria-label={alt} />;
    }

    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={resolveImageSrc(src, forceProxy)}
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