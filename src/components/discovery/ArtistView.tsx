'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { LazyCoverImage } from '@/components/LazyCoverImage';
import { RankedList } from '@/components/discovery/RankedList';
import { LastFmTag } from '@/types/lastfm';
import { formatTagName } from '@/lib/tags';

interface ArtistViewProps {
    name: string;
    heroImage: string | null;
    listeners: string;
    playcount: string;
    bio: string;
    tags: LastFmTag[];
    similar: { name: string; playcount?: string; imageUrl: string | null }[];
}

const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } },
};

export function ArtistView({ name, heroImage, listeners, playcount, bio, tags, similar }: ArtistViewProps) {
    const t = useTranslations('discovery.artist');

    const similarItems = similar.map((a) => ({
        name: a.name,
        playcount: a.playcount,
        image: a.imageUrl,
        lazyType: 'artist' as const,
    }));

    const listenerCount = parseInt(listeners, 10);
    const playcountNum = parseInt(playcount, 10);

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.05 } } }}
            className="space-y-10 -mt-2"
        >
            <motion.header variants={fadeUp} className="flex flex-col sm:flex-row gap-6 sm:gap-8">
                <div className="relative shrink-0">
                    <LazyCoverImage
                        src={heroImage}
                        alt={name}
                        className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl ring-1 ring-white/10 shadow-2xl shadow-black/50"
                        lazyType="artist"
                        lazyName={name}
                    />
                    <div className="absolute -inset-4 bg-red-600/10 rounded-3xl blur-2xl -z-10" />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500 mb-1">{t('badge')}</p>
                    <h1 className="text-3xl font-display font-bold tracking-tight">{name}</h1>
                    <p className="text-sm text-neutral-500 mt-2">
                        {t('stats', {
                            listeners: listenerCount,
                            playcount: playcountNum,
                        })}
                    </p>
                    {bio && (
                        <p className="text-sm text-neutral-400 mt-4 leading-relaxed line-clamp-4 max-w-2xl">
                            {bio}
                        </p>
                    )}
                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {tags.map((tag) => (
                                <Link
                                    key={tag.name}
                                    href={`/tag/${encodeURIComponent(tag.name)}`}
                                    className="text-xs text-neutral-500 hover:text-red-400 transition-colors px-2 py-1 rounded-full border border-white/6 hover:border-red-500/30"
                                >
                                    {formatTagName(tag.name)}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </motion.header>

            {similarItems.length > 0 && (
                <motion.section variants={fadeUp}>
                    <div className="flex items-center gap-2 mb-5">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                        <h2 className="text-xs font-bold uppercase tracking-widest text-violet-400">
                            {t('similar')}
                        </h2>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-x-10">
                        <RankedList items={similarItems.slice(0, 6)} accent="#a78bfa" linkPrefix="/artist" />
                        <RankedList items={similarItems.slice(6)} accent="#a78bfa" linkPrefix="/artist" startIndex={7} />
                    </div>
                </motion.section>
            )}
        </motion.div>
    );
}
