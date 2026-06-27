'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface PeriodSelectorProps {
    value: string;
    onChange: (value: string) => void;
    options?: { value: string; label: string }[];
}

const PERIOD_KEYS = ['7day', '1month', '3month', '6month', '12month', 'overall'] as const;

export function PeriodSelector({ value, onChange, options }: PeriodSelectorProps) {
    const t = useTranslations('periods');
    const defaultOptions = PERIOD_KEYS.map((key) => ({
        value: key,
        label: t(key),
    }));
    const resolvedOptions = options ?? defaultOptions;

    return (
        <div className="flex flex-wrap gap-2">
            {resolvedOptions.map((opt) => (
                <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChange(opt.value)}
                    className={cn(
                        'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                        value === opt.value
                            ? 'bg-red-500/20 border-red-500/50 text-red-400'
                            : 'border-white/10 text-neutral-500 hover:text-white'
                    )}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
}
