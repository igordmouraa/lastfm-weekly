'use client';

import { FormEvent, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link, useRouter } from '@/i18n/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Hash, ArrowUpRight } from 'lucide-react';

const CURATED_TAGS = [
    { slug: 'rock', key: 'rock' },
    { slug: 'indie', key: 'indie' },
    { slug: 'electronic', key: 'electronic' },
    { slug: 'jazz', key: 'jazz' },
    { slug: 'hip-hop', key: 'hipHop' },
    { slug: 'metal', key: 'metal' },
    { slug: 'pop', key: 'pop' },
    { slug: 'classical', key: 'classical' },
    { slug: 'ambient', key: 'ambient' },
    { slug: 'soul', key: 'soul' },
    { slug: 'punk', key: 'punk' },
    { slug: 'folk', key: 'folk' },
] as const;

const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } },
};

export function TagsHub() {
    const t = useTranslations('discovery');
    const tc = useTranslations('common');
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const tag = query.trim().toLowerCase();
        if (!tag) return;
        router.push(`/tag/${encodeURIComponent(tag)}`);
    };

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.04 } } }}
            className="space-y-10 -mt-2 max-w-2xl"
        >
            <motion.header variants={fadeUp}>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500 mb-1">{t('badge')}</p>
                <h1 className="text-2xl font-display font-bold tracking-tight">{t('tags.title')}</h1>
                <p className="text-sm text-neutral-500 mt-1">{t('tags.subtitle')}</p>
            </motion.header>

            <motion.form variants={fadeUp} onSubmit={handleSubmit} className="flex gap-2">
                <div className="relative flex-1">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                    <Input
                        placeholder={t('tags.searchPlaceholder')}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="pl-9 bg-transparent border-white/10 h-11 focus-visible:ring-red-500/30"
                    />
                </div>
                <Button type="submit" className="bg-red-600 hover:bg-red-700 font-bold shrink-0">
                    {tc('actions.explore')}
                </Button>
            </motion.form>

            <motion.section variants={fadeUp}>
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-600 mb-4">{t('tags.popular')}</p>
                <div className="flex flex-wrap gap-2">
                    {CURATED_TAGS.map((tag) => (
                        <Link
                            key={tag.slug}
                            href={`/tag/${encodeURIComponent(tag.slug)}`}
                            className="group inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm border border-white/8 text-neutral-400 hover:text-red-400 hover:border-red-500/30 transition-all"
                        >
                            {t(`tags.curated.${tag.key}`)}
                            <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    ))}
                </div>
            </motion.section>
        </motion.div>
    );
}
