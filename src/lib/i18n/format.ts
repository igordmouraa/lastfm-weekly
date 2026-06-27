import { ptBR, enUS } from 'date-fns/locale';
import type { Locale } from '@/i18n/routing';

export function getDateFnsLocale(locale: string) {
    return locale === 'en-US' ? enUS : ptBR;
}

export function getIntlLocale(locale: string): string {
    return locale === 'en-US' ? 'en-US' : 'pt-BR';
}

export type AppLocale = Locale;
