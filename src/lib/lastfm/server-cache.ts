import { unstable_cache } from 'next/cache';

export interface CacheAggregatorOptions<TArgs extends unknown[]> {
    revalidate: number;
    tags: (...args: TArgs) => string[];
}

function serializeArg(arg: unknown): string {
    if (typeof arg === 'object' && arg !== null) {
        return JSON.stringify(arg);
    }
    return String(arg);
}

/**
 * Wraps an async aggregator with Next.js Data Cache (cross-request).
 * React.cache() in user.ts still dedupes within a single request.
 */
export function cacheAggregator<TArgs extends unknown[], TResult>(
    name: string,
    fn: (...args: TArgs) => Promise<TResult>,
    options: CacheAggregatorOptions<TArgs>
): (...args: TArgs) => Promise<TResult> {
    const cached = (...args: TArgs): Promise<TResult> =>
        unstable_cache(
            async () => fn(...args),
            [name, ...args.map(serializeArg)],
            {
                revalidate: options.revalidate,
                tags: options.tags(...args),
            }
        )();

    return cached;
}
