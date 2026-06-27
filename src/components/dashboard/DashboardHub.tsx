'use client';

import { Suspense } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { DashboardData, WeeklyData } from '@/types/lastfm';
import { CoverImage } from '@/components/CoverImage';
import { LazyCoverImage } from '@/components/LazyCoverImage';
import { NowPlayingCard } from '@/components/dashboard/NowPlayingCard';
import { WeeklyDigest } from '@/components/dashboard/WeeklyDigest';
import { SemaninhaPreviewCard } from '@/components/dashboard/SemaninhaPreviewCard';
import { CapsulePreviewCard } from '@/components/dashboard/CapsulePreviewCard';
import { WeeklyTagsPanel } from '@/components/dashboard/WeeklyTagsPanel';
import { getImageUrl } from '@/lib/images';
import { getIntlLocale } from '@/lib/i18n/format';
import { Disc3, Headphones } from 'lucide-react';

interface DashboardHubProps {
    data: DashboardData;
    weekly: WeeklyData;
    username: string;
}

const STAGGER_MS = [0, 70, 140, 210];

function DashboardContent({ data, weekly, username }: DashboardHubProps) {
    const t = useTranslations('dashboard');
    const tc = useTranslations('common');
    const locale = useLocale();
    const intlLocale = getIntlLocale(locale);
    const avatar = getImageUrl(data.user.image, 'thumb');
    const topArtist = data.artists[0];
    const topArtistImage = topArtist?.imageUrl || getImageUrl(topArtist?.image, 'thumb');

    return (
        <div className="space-y-5 -mt-2">
            <header
                className="dashboard-fade-up flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 pb-1"
                style={{ animationDelay: `${STAGGER_MS[0]}ms` }}
            >
                <div className="flex items-center gap-4 min-w-0">
                    <CoverImage
                        src={avatar}
                        alt={data.user.name}
                        className="w-14 h-14 rounded-2xl ring-2 ring-red-500/20"
                        size={56}
                        priority
                    />
                    <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500 mb-0.5">{t('profile')}</p>
                        <h1 className="text-2xl font-display font-bold tracking-tight truncate">{data.user.name}</h1>
                        <p className="text-sm text-neutral-500 flex items-center gap-1.5 mt-0.5">
                            <Disc3 className="w-3.5 h-3.5" />
                            {data.totalScrobbles.toLocaleString(intlLocale)} {tc('scrobbles')}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-6 sm:gap-8 shrink-0">
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-neutral-600 flex items-center gap-1.5 mb-0.5">
                            <Headphones className="w-3 h-3 text-red-400" />
                            {t('scrobblesSevenDays')}
                        </p>
                        <p className="text-2xl font-display font-bold tabular-nums leading-none">
                            {data.periodScrobbles.toLocaleString(intlLocale)}
                        </p>
                    </div>

                    <div className="w-px h-10 bg-white/[0.06] hidden sm:block" />

                    <div className="flex items-center gap-3 min-w-0">
                        <LazyCoverImage
                            src={topArtistImage}
                            alt={topArtist?.name ?? tc('artistFallback')}
                            className="w-10 h-10 rounded-full ring-1 ring-white/10 shrink-0"
                            size={40}
                            lazyType="artist"
                            lazyName={topArtist?.name ?? ''}
                        />
                        <div className="min-w-0">
                            <p className="text-[10px] uppercase tracking-widest text-neutral-600 mb-0.5">{tc('artistNumberOne')}</p>
                            <p className="text-sm font-bold text-red-400 truncate max-w-[140px]">
                                {topArtist?.name ?? tc('emDash')}
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="dashboard-fade-up" style={{ animationDelay: `${STAGGER_MS[1]}ms` }}>
                <NowPlayingCard username={username} />
            </div>

            <div
                className="dashboard-fade-up grid sm:grid-cols-2 gap-4"
                style={{ animationDelay: `${STAGGER_MS[2]}ms` }}
            >
                <SemaninhaPreviewCard albums={data.collagePreview} username={username} />
                <CapsulePreviewCard data={weekly} username={username} />
            </div>

            <section className="dashboard-fade-up pt-4" style={{ animationDelay: `${STAGGER_MS[3]}ms` }}>
                <div className="grid lg:grid-cols-[minmax(0,260px)_1fr] gap-x-14 gap-y-10 lg:gap-y-0">
                    <WeeklyTagsPanel weeklyTags={weekly.topTags} profileTags={data.tags} />
                    <div className="lg:border-l lg:border-white/[0.04] lg:pl-14">
                        <WeeklyDigest data={weekly} />
                    </div>
                </div>
            </section>
        </div>
    );
}

export function DashboardHub(props: DashboardHubProps) {
    return (
        <Suspense>
            <DashboardContent {...props} />
        </Suspense>
    );
}
