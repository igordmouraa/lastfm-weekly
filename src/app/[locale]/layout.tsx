import type { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Outfit, DM_Sans } from 'next/font/google';
import { routing, type Locale } from '@/i18n/routing';
import '../globals.css';

const outfit = Outfit({
    variable: '--font-display-family',
    subsets: ['latin'],
    weight: ['600', '700', '800'],
});

const dmSans = DM_Sans({
    variable: '--font-body-family',
    subsets: ['latin'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata' });

    return {
        metadataBase: new URL(siteUrl),
        title: {
            default: t('defaultTitle'),
            template: `%s ${t('titleSuffix')}`,
        },
        description: t('description'),
        keywords: Object.values(t.raw('keywords') as Record<string, string>),
        authors: [{ name: 'Igor Moura' }],
        creator: 'Igor Moura',
        icons: { icon: '/icon.svg' },
        openGraph: {
            title: t('defaultTitle'),
            description: t('description'),
            type: 'website',
            locale: locale === 'en-US' ? 'en_US' : 'pt_BR',
            siteName: 'Weekster Hub',
            images: [
                {
                    url: '/og.png',
                    width: 1200,
                    height: 630,
                    alt: t('ogImageAlt'),
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: t('defaultTitle'),
            description: t('description'),
            images: ['/og.png'],
        },
        robots: { index: true, follow: true },
    };
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    setRequestLocale(locale);
    const messages = await getMessages();

    return (
        <html lang={locale} className="dark scroll-smooth" data-scroll-behavior="smooth">
            <body
                className={`${outfit.variable} ${dmSans.variable} font-sans antialiased bg-neutral-950 text-white min-h-screen selection:bg-red-600/30 selection:text-red-100`}
            >
                <NextIntlClientProvider locale={locale as Locale} messages={messages}>
                    {children}
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
