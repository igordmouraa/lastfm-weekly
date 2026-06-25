'use client';

import { cn } from '@/lib/utils';

interface PeriodSelectorProps {
    value: string;
    onChange: (value: string) => void;
    options?: { value: string; label: string }[];
}

const DEFAULT_OPTIONS = [
    { value: '7day', label: '7 dias' },
    { value: '1month', label: '1 mês' },
    { value: '3month', label: '3 meses' },
    { value: '6month', label: '6 meses' },
    { value: '12month', label: '12 meses' },
    { value: 'overall', label: 'Sempre' },
];

export function PeriodSelector({ value, onChange, options = DEFAULT_OPTIONS }: PeriodSelectorProps) {
    return (
        <div className="flex flex-wrap gap-2">
            {options.map((opt) => (
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
