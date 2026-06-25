'use client';

import { DaysSelector } from '@/components/hub/GridSelector';
import { cn } from '@/lib/utils';

export type CollageGap = '0' | '1' | '4';
export type CollageRadius = '0' | 'md' | 'lg';
export type CollageLabelMode = 'both' | 'artist' | 'album';

interface CollageControlsProps {
    grid: string;
    days: 7 | 15 | 30;
    showLabels: boolean;
    gap: CollageGap;
    radius: CollageRadius;
    showBorder: boolean;
    labelMode: CollageLabelMode;
    disabled?: boolean;
    onGridChange: (grid: string) => void;
    onDaysChange: (days: 7 | 15 | 30) => void;
    onLabelsChange: (show: boolean) => void;
    onGapChange: (gap: CollageGap) => void;
    onRadiusChange: (radius: CollageRadius) => void;
    onBorderChange: (show: boolean) => void;
    onLabelModeChange: (mode: CollageLabelMode) => void;
}

function ToggleGroup<T extends string>({
    label,
    options,
    value,
    onChange,
    disabled,
}: {
    label: string;
    options: { value: T; label: string }[];
    value: T;
    onChange: (v: T) => void;
    disabled?: boolean;
}) {
    return (
        <div className="space-y-3">
            <p className="text-xs uppercase tracking-widest text-neutral-500">{label}</p>
            <div className="flex flex-wrap gap-2">
                {options.map((opt) => (
                    <button
                        key={opt.value}
                        type="button"
                        disabled={disabled}
                        onClick={() => onChange(opt.value)}
                        className={cn(
                            'px-3 py-2 rounded-lg text-sm border transition-colors',
                            disabled && 'opacity-50 pointer-events-none',
                            value === opt.value
                                ? 'bg-red-500/20 border-red-500/50 text-red-400'
                                : 'border-white/10 text-neutral-400 hover:text-white'
                        )}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export function CollageControls({
    grid,
    days,
    showLabels,
    gap,
    radius,
    showBorder,
    labelMode,
    disabled = false,
    onGridChange,
    onDaysChange,
    onLabelsChange,
    onGapChange,
    onRadiusChange,
    onBorderChange,
    onLabelModeChange,
}: CollageControlsProps) {
    return (
        <div className={cn('space-y-5 bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-xl p-6', disabled && 'opacity-60')}>
            <ToggleGroup label="Grade" options={[{ value: '3x3', label: '3×3' }, { value: '5x5', label: '5×5' }, { value: '10x10', label: '10×10' }]} value={grid} onChange={onGridChange} disabled={disabled} />
            <div className="space-y-3">
                <p className="text-xs uppercase tracking-widest text-neutral-500">Período</p>
                <DaysSelector value={days} onChange={onDaysChange} disabled={disabled} />
            </div>
            <ToggleGroup
                label="Nomes nas capas"
                options={[{ value: 'true', label: 'Com nomes' }, { value: 'false', label: 'Sem nomes' }]}
                value={showLabels ? 'true' : 'false'}
                onChange={(v) => onLabelsChange(v === 'true')}
                disabled={disabled}
            />
            {showLabels && (
                <ToggleGroup
                    label="Exibir nos rótulos"
                    options={[
                        { value: 'both', label: 'Artista + álbum' },
                        { value: 'artist', label: 'Só artista' },
                        { value: 'album', label: 'Só álbum' },
                    ]}
                    value={labelMode}
                    onChange={onLabelModeChange}
                    disabled={disabled}
                />
            )}
            <ToggleGroup
                label="Espaçamento"
                options={[
                    { value: '0', label: 'Nenhum' },
                    { value: '1', label: 'Fino' },
                    { value: '4', label: 'Médio' },
                ]}
                value={gap}
                onChange={onGapChange}
                disabled={disabled}
            />
            <ToggleGroup
                label="Cantos"
                options={[
                    { value: '0', label: 'Quadrado' },
                    { value: 'md', label: 'Suave' },
                    { value: 'lg', label: 'Arredondado' },
                ]}
                value={radius}
                onChange={onRadiusChange}
                disabled={disabled}
            />
            <ToggleGroup
                label="Borda externa"
                options={[{ value: 'true', label: 'Com borda' }, { value: 'false', label: 'Sem borda' }]}
                value={showBorder ? 'true' : 'false'}
                onChange={(v) => onBorderChange(v === 'true')}
                disabled={disabled}
            />
        </div>
    );
}
