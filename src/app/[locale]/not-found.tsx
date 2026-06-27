import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function NotFound() {
    const t = await getTranslations('errors.notFound');

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] px-6 text-center">
            <h1 className="text-2xl font-display font-bold mb-2">{t('title')}</h1>
            <p className="text-neutral-400 mb-6">{t('description')}</p>
            <Link href="/" className="text-red-400 hover:text-red-300 text-sm font-medium">
                {t('backHome')}
            </Link>
        </div>
    );
}
