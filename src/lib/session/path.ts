import { GLOBAL_ROUTES } from '@/i18n/routing';

/**
 * Extract profile username from i18n pathname (without locale prefix).
 * Returns null for global routes like /charts or /compare.
 */
export function extractViewedUserFromPath(pathname: string): string | null {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length === 0) return null;
    const first = parts[0];
    if (GLOBAL_ROUTES.has(first)) return null;
    try {
        return decodeURIComponent(first);
    } catch {
        return first;
    }
}
