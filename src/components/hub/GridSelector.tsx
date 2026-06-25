'use client';

import { cn } from '@/lib/utils';

interface GridSelectorProps {
    value: string;
    onChange: (value: string) => void;
}

const GRIDS = [
    { value: '3x3', label: '3×3' },
    { value: '5x5', label: '5×5' },
    { value: '10x10', label: '10×10' },
];

export function GridSelector({ value, onChange }: GridSelectorProps) {
    return (
        <div className="flex gap-2">
            {GRIDS.map((g) => (
                <button
                    key={g.value}
                    type="button"
                    onClick={() => onChange(g.value)}
                    className={cn(
                        'px-4 py-2 rounded-lg text-sm font-bold border transition-colors',
                        value === g.value
                            ? 'bg-red-500/20 border-red-500/50 text-red-400'
                            : 'border-white/10 text-neutral-400 hover:text-white'
                    )}
                >
                    {g.label}
                </button>
            ))}
        </div>
    );
}

interface DaysSelectorProps {
    value: number;
    onChange: (days: 7 | 15 | 30) => void;
    disabled?: boolean;
}

export function DaysSelector({ value, onChange, disabled = false }: DaysSelectorProps) {
    const options: { days: 7 | 15 | 30; label: string }[] = [
        { days: 7, label: '7 dias' },
        { days: 15, label: '15 dias' },
        { days: 30, label: '30 dias' },
    ];

    return (
        <div className="flex gap-2">
            {options.map((o) => (
                <button
                    key={o.days}
                    type="button"
                    disabled={disabled}
                    onClick={() => onChange(o.days)}
                    className={cn(
                        'px-4 py-2 rounded-lg text-sm font-medium border transition-colors',
                        disabled && 'opacity-50 pointer-events-none',
                        value === o.days
                            ? 'bg-red-500/20 border-red-500/50 text-red-400'
                            : 'border-white/10 text-neutral-400 hover:text-white'
                    )}
                >
                    {o.label}
                </button>
            ))}
        </div>
    );
}
