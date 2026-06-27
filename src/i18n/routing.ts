import { defineRouting } from 'next-intl/routing';

export const locales = ['pt-BR', 'en-US'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
    locales,
    defaultLocale: 'pt-BR',
    localePrefix: 'always',
    localeCookie: {
        name: 'NEXT_LOCALE',
        maxAge: 60 * 60 * 24 * 365,
    },
});

export const GLOBAL_ROUTES = new Set([
    'charts',
    'compare',
    'gallery',
    'tags',
    'artist',
    'tag',
]);

export function isLocale(value: string): value is Locale {
    return (locales as readonly string[]).includes(value);
}
