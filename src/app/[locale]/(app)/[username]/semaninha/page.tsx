import { getCollageAlbums } from '@/lib/lastfm/aggregators/collage';
import { parseDays, parseGridSize } from '@/lib/semaninha-params';
import { SemaninhaClient } from '@/components/semaninha/SemaninhaClient';
import { PageContainer } from '@/components/shell/PageContainer';
import { CollageGap, CollageLabelMode, CollageRadius } from '@/components/semaninha/CollageControls';
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';

interface PageProps {
    params: Promise<{ locale: string; username: string }>;
    searchParams: Promise<{
        grid?: string;
        days?: string;
        labels?: string;
        gap?: string;
        radius?: string;
        border?: string;
        labelMode?: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale, username } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata.pages.semaninha' });
    return { title: t('title', { username }) };
}

function parseGap(gap?: string): CollageGap {
    if (gap === '1' || gap === '4' || gap === '8') return gap;
    return '0';
}

function parseRadius(radius?: string): CollageRadius {
    if (radius === 'md' || radius === 'lg' || radius === 'xl') return radius;
    return '0';
}

function parseLabelMode(mode?: string): CollageLabelMode {
    if (mode === 'artist' || mode === 'album') return mode;
    return 'both';
}

export default async function SemaninhaPage({ params, searchParams }: PageProps) {
    const { locale, username } = await params;
    setRequestLocale(locale as Locale);
    const t = await getTranslations('metadata.pages.semaninha');
    const sp = await searchParams;
    const grid = sp.grid ?? '5x5';
    const days = parseDays(sp.days ?? '7');
    const showLabels = sp.labels !== '0';
    const gap = parseGap(sp.gap);
    const radius = parseRadius(sp.radius);
    const showBorder = sp.border !== '0';
    const labelMode = parseLabelMode(sp.labelMode);
    const { count } = parseGridSize(grid);

    const albums = await getCollageAlbums({ username, days, count, resolveCovers: true });

    return (
        <PageContainer title={t('heading')} description={t('description')}>
            <SemaninhaClient
                username={username}
                albums={albums}
                grid={grid}
                days={days}
                showLabels={showLabels}
                gap={gap}
                radius={radius}
                showBorder={showBorder}
                labelMode={labelMode}
            />
        </PageContainer>
    );
}
