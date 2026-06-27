'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { WeightedTag, LastFmTag } from '@/types/lastfm';
import { formatTagName } from '@/lib/tags';
import { cn } from '@/lib/utils';

const TAG_COLORS = [
    'bg-red-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-pink-500',
    'bg-violet-500',
    'bg-cyan-500',
    'bg-emerald-500',
];

interface WeeklyTagsPanelProps {
    weeklyTags: WeightedTag[];
    profileTags?: LastFmTag[];
}

export function WeeklyTagsPanel({ weeklyTags, profileTags = [] }: WeeklyTagsPanelProps) {
    const t = useTranslations('dashboard.tags');
    const maxCount = Math.max(...weeklyTags.map((tag) => tag.count), 1);
    const hasWeekly = weeklyTags.length > 0;

    return (
        <section>
            <header className="mb-6">
                <h2 className="text-lg font-display font-bold tracking-tight">{t('title')}</h2>
                <p className="text-sm text-neutral-500 mt-0.5">
                    {hasWeekly ? t('weekly') : t('profile')}
                </p>
            </header>

            {hasWeekly ? (
                <ul className="space-y-4">
                    {weeklyTags.slice(0, 7).map((tag, i) => {
                        const pct = Math.round((tag.count / maxCount) * 100);
                        return (
                            <li key={tag.name}>
                                <Link
                                    href={`/tag/${encodeURIComponent(tag.name)}`}
                                    className="group block"
                                >
                                    <div className="flex items-baseline justify-between gap-3 mb-1.5">
                                        <span className="text-sm font-medium group-hover:text-red-400 transition-colors">
                                            {formatTagName(tag.name)}
                                        </span>
                                        <span className="text-[11px] text-neutral-600 tabular-nums shrink-0">
                                            {tag.count}
                                        </span>
                                    </div>
                                    <div className="relative h-px bg-white/6 overflow-visible">
                                        <div
                                            className={cn(
                                                'absolute inset-y-0 left-0 h-px transition-all duration-700 group-hover:h-0.5',
                                                TAG_COLORS[i % TAG_COLORS.length],
                                                'opacity-70 group-hover:opacity-100'
                                            )}
                                            style={{ width: `${Math.max(pct, 12)}%` }}
                                        />
                                        <div
                                            className={cn(
                                                'absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity',
                                                TAG_COLORS[i % TAG_COLORS.length]
                                            )}
                                            style={{ left: `calc(${Math.max(pct, 12)}% - 6px)` }}
                                        />
                                    </div>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <div className="flex flex-wrap gap-x-3 gap-y-2">
                    {profileTags.map((tag) => (
                        <Link
                            key={tag.name}
                            href={`/tag/${encodeURIComponent(tag.name)}`}
                            className="text-sm text-neutral-400 hover:text-red-400 transition-colors after:content-['·'] after:ml-3 after:text-neutral-700 last:after:content-none"
                        >
                            {formatTagName(tag.name)}
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
}
