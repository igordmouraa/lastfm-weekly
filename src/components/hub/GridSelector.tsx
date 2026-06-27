'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { GRID_PRESET_GROUPS, getGridGroup } from '@/lib/semaninha-params';
import { controlClass, controlStyles } from '@/components/semaninha/control-styles';
import { cn } from '@/lib/utils';

interface GridSelectorProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

const SHAPE_GROUPS = ['square', 'wide', 'tall'] as const;

function LayoutThumb({
    cols,
    rows,
    selected,
}: {
    cols: number;
    rows: number;
    selected?: boolean;
}) {
    return (
        <span
            className={cn(
                'inline-block rounded-[2px] border transition-colors duration-200',
                selected ? controlStyles.thumbActive : controlStyles.thumbIdle
            )}
            style={{
                width: cols >= rows ? 14 : Math.round(14 * (cols / rows)),
                height: rows >= cols ? 14 : Math.round(14 * (rows / cols)),
            }}
        />
    );
}

function parseGridKey(key: string): { cols: number; rows: number } {
    const [c, r] = key.split('x').map(Number);
    return { cols: c, rows: r };
}

export function GridSelector({ value, onChange, disabled = false }: GridSelectorProps) {
    const t = useTranslations('semaninha.grid');
    const tGroups = useTranslations('semaninha.gridGroups');
    const [activeGroup, setActiveGroup] = useState(() => getGridGroup(value));

    useEffect(() => {
        setActiveGroup(getGridGroup(value));
    }, [value]);

    return (
        <div className="space-y-2">
            <div className="flex rounded-lg bg-neutral-950/60 p-0.5 border border-white/[0.06] gap-0.5">
                {SHAPE_GROUPS.map((group) => {
                    const sample = GRID_PRESET_GROUPS[group][1] ?? GRID_PRESET_GROUPS[group][0];
                    const { cols, rows } = parseGridKey(sample);
                    const isActive = activeGroup === group;

                    return (
                        <button
                            key={group}
                            type="button"
                            disabled={disabled}
                            onClick={() => setActiveGroup(group)}
                            title={tGroups(group)}
                            className={cn(
                                'flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[10px] uppercase tracking-wide',
                                controlClass(isActive, 'segment'),
                                disabled && 'opacity-50 pointer-events-none'
                            )}
                        >
                            <LayoutThumb cols={cols} rows={rows} selected={isActive} />
                            <span className="hidden sm:inline">{tGroups(group)}</span>
                        </button>
                    );
                })}
            </div>

            <div className="flex flex-wrap gap-1">
                {GRID_PRESET_GROUPS[activeGroup].map((key) => {
                    const { cols, rows } = parseGridKey(key);
                    const selected = value === key;

                    return (
                        <button
                            key={key}
                            type="button"
                            disabled={disabled}
                            onClick={() => onChange(key)}
                            className={cn(
                                'inline-flex shrink-0 items-center gap-1.5 px-2.5 py-1 rounded-md text-xs',
                                controlClass(selected, 'chip'),
                                disabled && 'opacity-50 pointer-events-none'
                            )}
                        >
                            <LayoutThumb cols={cols} rows={rows} selected={selected} />
                            {t(key)}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

interface DaysSelectorProps {
    value: number;
    onChange: (days: 7 | 15 | 30) => void;
    disabled?: boolean;
    compact?: boolean;
}

const DAY_KEYS = [
    { days: 7 as const, key: '7day' as const },
    { days: 15 as const, key: '15day' as const },
    { days: 30 as const, key: '30day' as const },
];

export function DaysSelector({ value, onChange, disabled = false, compact = false }: DaysSelectorProps) {
    const t = useTranslations('periods');

    return (
        <div className="flex rounded-lg bg-neutral-950/60 p-0.5 border border-white/[0.06] gap-0.5 w-full">
            {DAY_KEYS.map((o) => {
                const selected = value === o.days;
                return (
                    <button
                        key={o.days}
                        type="button"
                        disabled={disabled}
                        onClick={() => onChange(o.days)}
                        className={cn(
                            'flex-1 rounded-md',
                            compact ? 'py-1.5 text-xs' : 'py-2 text-sm',
                            controlClass(selected, 'segment'),
                            disabled && 'opacity-50 pointer-events-none'
                        )}
                    >
                        {t(o.key)}
                    </button>
                );
            })}
        </div>
    );
}
