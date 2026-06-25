'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { resolveImageSrc } from '@/lib/image-hosts';

interface CoverImageProps {
    src?: string | null;
    alt: string;
    className?: string;
    fallbackChar?: string;
    /** Necessário para export PNG (CORS). */
    forceProxy?: boolean;
}

export function CoverImage({ src, alt, className, fallbackChar, forceProxy = false }: CoverImageProps) {
    const [error, setError] = useState(false);
    const char = fallbackChar ?? alt[0]?.toUpperCase() ?? '?';

    if (!src || error) {
        return (
            <div className={cn('bg-neutral-800 flex items-center justify-center text-neutral-500 font-bold', className)}>
                <span className="text-sm">{char}</span>
            </div>
        );
    }

    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={resolveImageSrc(src, forceProxy)}
            alt={alt}
            className={cn('object-cover', className)}
            crossOrigin="anonymous"
            onError={() => setError(true)}
        />
    );
}
