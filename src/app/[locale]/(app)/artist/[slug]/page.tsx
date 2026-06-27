import { getArtistProfile } from '@/lib/lastfm/aggregators/artist-profile';
import { ArtistView } from '@/components/discovery/ArtistView';
import { PageContainer } from '@/components/shell/PageContainer';
import { notFound } from 'next/navigation';
import { LastFmError } from '@/lib/lastfm/client';
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';

export const revalidate = 86400;

interface PageProps {
    params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale, slug } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata.pages.artist' });
    return { title: t('title', { artistName: decodeURIComponent(slug) }) };
}

export default async function ArtistPage({ params }: PageProps) {
    const { locale, slug } = await params;
    setRequestLocale(locale as Locale);

    let data;
    try {
        data = await getArtistProfile(slug, { resolveImages: false });
    } catch (err) {
        if (err instanceof LastFmError) notFound();
        throw err;
    }

    return (
        <PageContainer>
            <ArtistView
                name={data.artist.name}
                heroImage={data.heroImage}
                listeners={data.artist.stats?.listeners ?? '0'}
                playcount={data.artist.stats?.playcount ?? '0'}
                bio={data.bio}
                tags={data.tags}
                similar={data.similar}
            />
        </PageContainer>
    );
}
