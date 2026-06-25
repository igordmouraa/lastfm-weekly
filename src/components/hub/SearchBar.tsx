'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Music2 } from 'lucide-react';

interface SearchBarProps {
    placeholder?: string;
    className?: string;
    defaultValue?: string;
    variant?: 'default' | 'compact';
}

export function SearchBar({
    placeholder = 'Seu usuário do Last.fm',
    className = '',
    defaultValue = '',
    variant = 'default',
}: SearchBarProps) {
    const [username, setUsername] = useState(defaultValue);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const trimmed = username.trim();
        if (!trimmed) return;
        setLoading(true);
        router.push(`/${encodeURIComponent(trimmed)}`);
    };

    if (variant === 'compact') {
        return (
            <form onSubmit={handleSubmit} className={`relative ${className}`}>
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4 pointer-events-none" />
                <Input
                    placeholder={placeholder}
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
                        placeholder={placeholder}
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
                    {loading ? <Music2 className="animate-bounce w-5 h-5" /> : 'Buscar'}
                </Button>
            </div>
        </form>
    );
}
