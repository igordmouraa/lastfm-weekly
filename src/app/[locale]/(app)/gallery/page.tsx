import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';

interface PageProps {
    params: Promise<{ locale: string }>;
}

export default async function GalleryRedirectPage({ params }: PageProps) {
    const { locale } = await params;
    setRequestLocale(locale as Locale);
    redirect(`/${locale}/tags`);
}
