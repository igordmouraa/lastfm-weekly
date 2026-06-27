import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';

interface PageProps {
    params: Promise<{ locale: string; username: string }>;
}

export default async function MonthRedirectPage({ params }: PageProps) {
    const { locale, username } = await params;
    setRequestLocale(locale as Locale);
    redirect(`/${locale}/${encodeURIComponent(username)}/wrapped?period=1month`);
}
