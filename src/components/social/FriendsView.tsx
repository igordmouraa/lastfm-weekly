'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { LastFmFriend } from '@/types/lastfm';
import { useCurrentUser } from '@/components/shell/UserContext';
import { CoverImage } from '@/components/CoverImage';
import { getImageUrl } from '@/lib/images';
import { GitCompare, ArrowUpRight, Users } from 'lucide-react';

interface FriendsViewProps {
    username: string;
    friends: LastFmFriend[];
}

const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } },
};

export function FriendsView({ username, friends }: FriendsViewProps) {
    const t = useTranslations('social');
    const currentUser = useCurrentUser();
    const compareAs = currentUser ?? username;

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.04 } } }}
            className="space-y-8 -mt-2"
        >
            <motion.header variants={fadeUp} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500 mb-1">{t('badge')}</p>
                    <h1 className="text-2xl font-display font-bold tracking-tight">{t('friends.title')}</h1>
                    <p className="text-sm text-neutral-500 mt-1">
                        {friends.length > 0
                            ? t('friends.count', { count: friends.length, username })
                            : t('friends.network', { username })}
                    </p>
                </div>
                <Link
                    href={`/compare?user1=${encodeURIComponent(compareAs)}`}
                    className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-red-400 transition-colors"
                >
                    <GitCompare className="w-4 h-4" />
                    {t('friends.compareTaste')}
                    <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
            </motion.header>

            {friends.length === 0 ? (
                <motion.div variants={fadeUp} className="py-16 text-center">
                    <Users className="w-10 h-10 text-neutral-700 mx-auto mb-3" />
                    <p className="text-neutral-500">{t('friends.empty')}</p>
                    <p className="text-sm text-neutral-600 mt-1">{t('friends.privacyNote')}</p>
                </motion.div>
            ) : (
                <motion.ul variants={fadeUp} className="divide-y divide-white/[0.04]">
                    {friends.map((friend) => {
                        const avatar = getImageUrl(friend.image, 'thumb');
                        const profileHref = `/${encodeURIComponent(friend.name)}`;
                        const compareHref = `/compare?user1=${encodeURIComponent(compareAs)}&user2=${encodeURIComponent(friend.name)}`;

                        return (
                            <li key={friend.name}>
                                <div className="flex items-center gap-4 py-4 group">
                                    <Link href={profileHref} className="flex items-center gap-4 min-w-0 flex-1">
                                        <CoverImage
                                            src={avatar}
                                            alt={friend.name}
                                            className="w-11 h-11 rounded-full ring-1 ring-white/10 group-hover:ring-red-500/30 transition-all"
                                            size={44}
                                        />
                                        <div className="min-w-0">
                                            <p className="font-medium truncate group-hover:text-red-400 transition-colors">
                                                {friend.name}
                                            </p>
                                            {friend.realname && (
                                                <p className="text-sm text-neutral-600 truncate">{friend.realname}</p>
                                            )}
                                        </div>
                                    </Link>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <Link
                                            href={compareHref}
                                            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-red-400 transition-colors"
                                        >
                                            <GitCompare className="w-3.5 h-3.5" />
                                            {t('friends.compare')}
                                        </Link>
                                        <Link
                                            href={profileHref}
                                            className="p-2 rounded-lg text-neutral-600 hover:text-white hover:bg-white/5 transition-colors"
                                            aria-label={t('friends.viewProfileAria', { name: friend.name })}
                                        >
                                            <ArrowUpRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </motion.ul>
            )}
        </motion.div>
    );
}
