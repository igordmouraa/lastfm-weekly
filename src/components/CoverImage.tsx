'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { resolveImageSrc } from '@/lib/image-hosts';
import { optimizeImageUrl } from '@/lib/images';

interface CoverImageProps {
    src?: string | null;
    alt: string;
    className?: string;
    fallbackChar?: string;
    /** Necessário para export PNG (CORS). */
    forceProxy?: boolean;
    /** Pixels CSS do lado maior — otimiza URL e define width/height. */
    size?: number;
    /** Prioridade alta para LCP (fetchPriority + eager). */
    priority?: boolean;
}

export function CoverImage({
    src,
    alt,
    className,
    fallbackChar,
    forceProxy = false,
    size,
    priority = false,
}: CoverImageProps) {
    const [error, setError] = useState(false);
    const char = fallbackChar ?? alt[0]?.toUpperCase() ?? '?';

    if (!src || error) {
        return (
            <div
                className={cn('bg-neutral-800 flex items-center justify-center text-neutral-500 font-bold', className)}
                style={size ? { width: size, height: size } : undefined}
            >
                <span className="text-sm">{char}</span>
            </div>
        );
    }

    const optimized = size ? optimizeImageUrl(src, size) ?? src : src;
    const resolved = resolveImageSrc(optimized, forceProxy);

    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={resolved}
            alt={alt}
            width={size}
            height={size}
            className={cn('object-cover', className)}
            crossOrigin="anonymous"
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : undefined}
            decoding="async"
            onError={() => setError(true)}
        />
    );
}
