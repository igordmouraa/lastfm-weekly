'use client';

import { useEffect, useState } from 'react';
import { CoverImage } from '@/components/CoverImage';
import { cn } from '@/lib/utils';

type LazyCoverType = 'artist' | 'album' | 'track';

const pendingFetches = new Map<string, Promise<string | null>>();

function fetchKey(type: LazyCoverType, artist: string, name: string): string {
    return `${type}:${artist}:${name}`;
}

async function fetchCoverUrl(
    type: LazyCoverType,
    artist: string,
    name: string
): Promise<string | null> {
    const key = fetchKey(type, artist, name);
    const pending = pendingFetches.get(key);
    if (pending) return pending;

    const promise = (async () => {
        try {
            if (type === 'artist') {
                const res = await fetch(
                    `/api/artist-image?name=${encodeURIComponent(name)}`
                );
                if (!res.ok) return null;
                const data = await res.json();
                return (data.imageUrl as string | null) ?? null;
            }
            if (type === 'track') {
                const res = await fetch(
                    `/api/track-image?artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(name)}`
                );
                if (!res.ok) return null;
                const data = await res.json();
                return (data.imageUrl as string | null) ?? null;
            }
            const res = await fetch(
                `/api/album-image?artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(name)}`
            );
            if (!res.ok) return null;
            const data = await res.json();
            return (data.imageUrl as string | null) ?? null;
        } catch {
            return null;
        } finally {
            pendingFetches.delete(key);
        }
    })();

    pendingFetches.set(key, promise);
    return promise;
}

interface LazyCoverImageProps {
    src?: string | null;
    alt: string;
    className?: string;
    fallbackChar?: string;
    forceProxy?: boolean;
    size?: number;
    priority?: boolean;
    lazyType?: LazyCoverType;
    lazyArtist?: string;
    lazyName?: string;
}

export function LazyCoverImage({
    src,
    alt,
    className,
    fallbackChar,
    forceProxy,
    size,
    priority,
    lazyType,
    lazyArtist,
    lazyName,
}: LazyCoverImageProps) {
    const needsFetch = !src && Boolean(lazyType && lazyName);
    const [fetchedUrl, setFetchedUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!needsFetch || !lazyType || !lazyName) {
            return;
        }

        const artist = lazyArtist ?? lazyName;
        let cancelled = false;

        void fetchCoverUrl(lazyType, artist, lazyName).then((url) => {
            if (!cancelled) {
                setFetchedUrl(url);
            }
        });

        return () => {
            cancelled = true;
        };
    }, [needsFetch, lazyType, lazyArtist, lazyName]);

    const displaySrc = src ?? fetchedUrl;
    const loading = needsFetch && !displaySrc;

    if (loading) {
        return (
            <div
                className={cn('bg-neutral-800 animate-pulse', className)}
                style={size ? { width: size, height: size } : undefined}
            />
        );
    }

    return (
        <CoverImage
            src={displaySrc}
            alt={alt}
            className={className}
            fallbackChar={fallbackChar}
            forceProxy={forceProxy}
            size={size}
            priority={priority}
        />
    );
}
