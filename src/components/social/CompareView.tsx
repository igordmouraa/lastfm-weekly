'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CompareResult } from '@/lib/lastfm/aggregators/compare';
import { useUserContext } from '@/components/shell/UserContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeftRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompareViewProps {
    user1?: string;
    user2?: string;
    result: CompareResult | null;
}

const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } },
};

function UserAvatar({ name }: { name: string }) {
    const initial = name.trim()[0]?.toUpperCase() ?? '?';
    return (
        <div className="w-12 h-12 rounded-full bg-neutral-800 ring-1 ring-white/10 flex items-center justify-center shrink-0">
            <span className="text-lg font-display font-bold text-red-400">{initial}</span>
        </div>
    );
}

function UserSlot({
    label,
    value,
    onChange,
    placeholder,
    accent,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    accent?: 'left' | 'right';
}) {
    return (
        <div
            className={cn(
                'flex-1 rounded-2xl border border-white/8 p-5 space-y-4 transition-colors',
                'hover:border-white/12 bg-neutral-900/20',
                accent === 'left' && 'sm:rounded-r-none sm:border-r-0',
                accent === 'right' && 'sm:rounded-l-none'
            )}
        >
            <div className="flex items-center gap-3">
                <UserAvatar name={value || '?'} />
                <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-widest text-neutral-600">{label}</p>
                    <p className="text-sm font-medium truncate text-neutral-300">
                        {value ? `@${value}` : '—'}
                    </p>
                </div>
            </div>
            <Input
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="bg-neutral-950/50 border-white/10 h-10 focus-visible:ring-red-500/30"
            />
        </div>
    );
}

export function CompareView({ user1: initialUser1, user2: initialUser2, result }: CompareViewProps) {
    const { username } = useUserContext();
    const router = useRouter();
    const [user1Override, setUser1Override] = useState<string | null>(null);
    const [user2Override, setUser2Override] = useState<string | null>(null);

    const user1 = user1Override ?? initialUser1 ?? username ?? '';
    const user2 = user2Override ?? initialUser2 ?? '';

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const u1 = user1.trim();
        const u2 = user2.trim();
        if (!u1 || !u2) return;
        router.push(`/compare?user1=${encodeURIComponent(u1)}&user2=${encodeURIComponent(u2)}`);
    };

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.06 } } }}
            className="mx-auto max-w-2xl space-y-10 -mt-2"
        >
            <motion.header variants={fadeUp} className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500 mb-1">Social</p>
                <h1 className="text-3xl font-display font-bold tracking-tight">Comparar taste</h1>
                <p className="text-sm text-neutral-500 mt-2 max-w-md mx-auto">
                    Veja quantos artistas em comum existem entre dois perfis Last.fm
                </p>
            </motion.header>

            <motion.form variants={fadeUp} onSubmit={handleSubmit} className="space-y-5">
                <div className="relative flex flex-col sm:flex-row sm:items-stretch">
                    <UserSlot
                        label="Perfil A"
                        value={user1}
                        onChange={setUser1Override}
                        placeholder="seu usuário"
                        accent="left"
                    />
                    <div className="hidden sm:flex items-center justify-center w-12 shrink-0 relative z-10 -mx-1">
                        <div className="w-10 h-10 rounded-full bg-neutral-950 border border-white/10 flex items-center justify-center">
                            <span className="text-[10px] font-black text-neutral-500">VS</span>
                        </div>
                    </div>
                    <div className="sm:hidden flex items-center justify-center py-2">
                        <span className="text-xs font-bold text-neutral-600">vs</span>
                    </div>
                    <UserSlot
                        label="Perfil B"
                        value={user2}
                        onChange={setUser2Override}
                        placeholder="outro usuário"
                        accent="right"
                    />
                </div>
                <div className="flex justify-center">
                    <Button
                        type="submit"
                        disabled={!user1.trim() || !user2.trim()}
                        className="bg-red-600 hover:bg-red-700 font-bold px-8 h-11 rounded-full"
                    >
                        <ArrowLeftRight className="w-4 h-4 mr-2" />
                        Comparar perfis
                    </Button>
                </div>
            </motion.form>

            {result && (
                <motion.section variants={fadeUp} className="space-y-8 pt-4 border-t border-white/[0.06]">
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center gap-4">
                            <Link
                                href={`/${encodeURIComponent(result.user1)}`}
                                className="text-sm font-medium hover:text-red-400 transition-colors"
                            >
                                @{result.user1}
                            </Link>
                            <ArrowLeftRight className="w-4 h-4 text-neutral-600" />
                            <Link
                                href={`/${encodeURIComponent(result.user2)}`}
                                className="text-sm font-medium hover:text-red-400 transition-colors"
                            >
                                @{result.user2}
                            </Link>
                        </div>
                        <p className="text-7xl font-display font-bold text-red-400 tabular-nums leading-none">
                            {result.overlapPercent}%
                        </p>
                        <p className="text-sm text-neutral-500">overlap nos top 50 artistas</p>
                    </div>

                    <div className="h-2 rounded-full bg-neutral-800 overflow-hidden max-w-md mx-auto">
                        <div
                            className="h-full bg-gradient-to-r from-red-600 via-red-500 to-pink-500 rounded-full transition-all duration-700"
                            style={{ width: `${Math.max(result.overlapPercent, 3)}%` }}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="py-3">
                            <p className="text-2xl font-display font-bold tabular-nums text-white">
                                {result.overlapCount}
                            </p>
                            <p className="text-[10px] uppercase tracking-widest text-neutral-600 mt-1">Em comum</p>
                        </div>
                        <div className="py-3 border-x border-white/[0.06]">
                            <p className="text-2xl font-display font-bold tabular-nums text-neutral-400">
                                {result.user1Unique}
                            </p>
                            <p className="text-[10px] uppercase tracking-widest text-neutral-600 mt-1 truncate px-1">
                                Só {result.user1}
                            </p>
                        </div>
                        <div className="py-3">
                            <p className="text-2xl font-display font-bold tabular-nums text-neutral-400">
                                {result.user2Unique}
                            </p>
                            <p className="text-[10px] uppercase tracking-widest text-neutral-600 mt-1 truncate px-1">
                                Só {result.user2}
                            </p>
                        </div>
                    </div>

                    {result.overlap.length > 0 && (
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4 text-center">
                                Artistas em comum
                            </p>
                            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
                                {result.overlap.map((name) => (
                                    <Link
                                        key={name}
                                        href={`/artist/${encodeURIComponent(name)}`}
                                        className="text-sm text-neutral-400 hover:text-red-400 transition-colors"
                                    >
                                        {name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.section>
            )}
        </motion.div>
    );
}
