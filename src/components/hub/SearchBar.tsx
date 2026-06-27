'use client';

import { FormEvent, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useSession } from '@/components/shell/SessionProvider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Music2 } from 'lucide-react';

interface SearchBarProps {
    placeholder?: string;
    className?: string;
    defaultValue?: string;
    variant?: 'default' | 'compact';
    /** login: sets session cookie (landing). navigate: only opens profile (top bar). */
    mode?: 'login' | 'navigate';
    onError?: (message: string) => void;
}

export function SearchBar({
    placeholder,
    className = '',
    defaultValue = '',
    variant = 'default',
    mode,
    onError,
}: SearchBarProps) {
    const resolvedMode = mode ?? (variant === 'compact' ? 'navigate' : 'login');
    const tMarketing = useTranslations('marketing');
    const tCommon = useTranslations('common');
    const tErrors = useTranslations('errors.api');
    const resolvedPlaceholder = placeholder ?? tMarketing('searchPlaceholder');
    const [username, setUsername] = useState(defaultValue);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { setSession } = useSession();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const trimmed = username.trim();
        if (!trimmed) return;

        setLoading(true);
        try {
            if (resolvedMode === 'login') {
                const res = await fetch('/api/session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: trimmed }),
                });
                if (!res.ok) {
                    const msg =
                        res.status === 404
                            ? tErrors('userNotFound')
                            : res.status === 503
                              ? tErrors('sessionNotConfigured')
                              : tErrors('userFetchFailed');
                    onError?.(msg);
                    return;
                }
                const data = (await res.json()) as { username: string; avatarUrl: string | null };
                setSession(data.username, data.avatarUrl);
                router.push(`/${encodeURIComponent(trimmed.toLowerCase())}`);
            } else {
                router.push(`/${encodeURIComponent(trimmed.toLowerCase())}`);
            }
        } finally {
            setLoading(false);
        }
    };

    if (variant === 'compact') {
        return (
            <form onSubmit={handleSubmit} className={`relative ${className}`}>
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4 pointer-events-none" />
                <Input
                    placeholder={resolvedPlaceholder}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-neutral-900/80 border-white/10 pl-8 h-9 text-sm w-full min-w-[180px] focus-visible:ring-red-500/30 placeholder:text-neutral-600"
                />
            </form>
        );
    }

    return (
        <form onSubmit={handleSubmit} className={`relative group z-20 ${className}`}>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-800 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-700" />
            <div className="relative flex gap-2 p-2 bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-lg">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5" />
                    <Input
                        placeholder={resolvedPlaceholder}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-transparent border-none pl-10 h-12 text-lg focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-neutral-600 text-white"
                    />
                </div>
                <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="bg-white text-black hover:bg-neutral-200 font-bold px-8 h-12"
                >
                    {loading ? <Music2 className="animate-bounce w-5 h-5" /> : tCommon('actions.search')}
                </Button>
            </div>
        </form>
    );
}
