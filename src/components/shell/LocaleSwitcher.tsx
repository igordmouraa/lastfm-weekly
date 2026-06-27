'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { locales, type Locale } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export function LocaleSwitcher({ className }: { className?: string }) {
    const locale = useLocale() as Locale;
    const pathname = usePathname();
    const router = useRouter();
    const t = useTranslations('nav.localeSwitcher');

    const switchLocale = (next: Locale) => {
        if (next === locale) return;
        router.replace(pathname, { locale: next });
    };

    return (
        <div
            className={cn('inline-flex items-center rounded-lg border border-white/10 bg-neutral-900/60 p-0.5', className)}
            role="group"
            aria-label={t('label')}
        >
            {locales.map((loc) => (
                <button
                    key={loc}
                    type="button"
                    onClick={() => switchLocale(loc)}
                    aria-pressed={locale === loc}
                    aria-label={loc === 'pt-BR' ? t('switchToPt') : t('switchToEn')}
                    className={cn(
                        'px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-colors',
                        locale === loc
                            ? 'bg-white/10 text-white'
                            : 'text-neutral-500 hover:text-neutral-300'
                    )}
                >
                    {loc === 'pt-BR' ? t('pt') : t('en')}
                </button>
            ))}
        </div>
    );
}
