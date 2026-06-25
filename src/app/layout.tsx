import type { Metadata, Viewport } from 'next';
import { Outfit, DM_Sans } from 'next/font/google';
import './globals.css';

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
const siteDescription =
    'Digite seu username e acesse dashboard, grades, cápsulas e wrapped do Last.fm — tudo num só lugar.';

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: 'Weekster Hub — Seu som, visualizado',
        template: '%s | Weekster Hub',
    },
    description: siteDescription,
    keywords: [
        'Last.fm',
        'scrobbles',
        'dashboard musical',
        'wrapped',
        'grade semanal',
        'cápsula',
        'Weekster Hub',
        'charts',
        'tags',
    ],
    authors: [{ name: 'Igor Moura' }],
    creator: 'Igor Moura',
    icons: {
        icon: '/icon.svg',
    },
    openGraph: {
        title: 'Weekster Hub — Seu som, visualizado',
        description: siteDescription,
        type: 'website',
        locale: 'pt_BR',
        siteName: 'Weekster Hub',
        images: [
            {
                url: '/og.png',
                width: 1200,
                height: 630,
                alt: 'Weekster Hub — dashboard, grade semanal, cápsula e wrapped do Last.fm',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Weekster Hub — Seu som, visualizado',
        description: siteDescription,
        images: ['/og.png'],
    },
    robots: {
        index: true,
        follow: true,
    },
};

export const viewport: Viewport = {
    themeColor: '#0a0a0a',
    colorScheme: 'dark',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="pt-BR" className="dark scroll-smooth" data-scroll-behavior="smooth">
            <body
                className={`${outfit.variable} ${dmSans.variable} font-sans antialiased bg-neutral-950 text-white min-h-screen selection:bg-red-600/30 selection:text-red-100`}
            >
                {children}
            </body>
        </html>
    );
}
