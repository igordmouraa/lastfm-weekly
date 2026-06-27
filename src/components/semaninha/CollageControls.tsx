'use client';

import { useState, type ReactNode } from 'react';
import { DaysSelector, GridSelector } from '@/components/hub/GridSelector';
import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import { controlClass } from '@/components/semaninha/control-styles';
import { cn } from '@/lib/utils';

export type CollageGap = '0' | '1' | '4' | '8';
export type CollageRadius = '0' | 'md' | 'lg' | 'xl';
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

function ControlLabel({ children }: { children: ReactNode }) {
    return (
        <span className="text-[10px] uppercase tracking-widest text-neutral-500 shrink-0">{children}</span>
    );
}

function ChipRow<T extends string>({
    options,
    value,
    onChange,
    disabled,
}: {
    options: { value: T; label: string }[];
    value: T;
    onChange: (v: T) => void;
    disabled?: boolean;
}) {
    return (
        <div className="flex rounded-lg bg-neutral-950/60 p-0.5 border border-white/[0.06] gap-0.5 w-full">
            {options.map((opt) => (
                <button
                    key={opt.value}
                    type="button"
                    disabled={disabled}
                    onClick={() => onChange(opt.value)}
                    title={opt.label}
                    className={cn(
                        'flex-1 min-w-0 px-1.5 py-1 rounded-md text-[11px] truncate text-center',
                        controlClass(value === opt.value, 'segment'),
                        disabled && 'opacity-50 pointer-events-none'
                    )}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
}

function StyleRow({
    label,
    children,
}: {
    label: string;
    children: ReactNode;
}) {
    return (
        <div className="space-y-1.5 py-2.5 border-b border-white/[0.04] last:border-0">
            <ControlLabel>{label}</ControlLabel>
            {children}
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
    const t = useTranslations('semaninha');
    const hasCustomStyle =
        showLabels || gap !== '0' || radius !== '0' || !showBorder || labelMode !== 'both';
    const [styleOpen, setStyleOpen] = useState(hasCustomStyle);

    return (
        <div
            className={cn(
                'bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden',
                disabled && 'opacity-60 pointer-events-none'
            )}
        >
            <div className="p-4 space-y-4">
                <div className="space-y-2">
                    <ControlLabel>{t('controls.grid')}</ControlLabel>
                    <GridSelector value={grid} onChange={onGridChange} disabled={disabled} />
                </div>

                <div className="space-y-2">
                    <ControlLabel>{t('controls.period')}</ControlLabel>
                    <DaysSelector value={days} onChange={onDaysChange} disabled={disabled} compact />
                </div>
            </div>

            <div className="border-t border-white/[0.06]">
                <button
                    type="button"
                    onClick={() => setStyleOpen((o) => !o)}
                    className="flex items-center justify-between w-full px-4 py-2.5 text-left hover:bg-white/[0.02] transition-colors"
                >
                    <span className="text-xs text-neutral-400">{t('controls.appearance')}</span>
                    <span className="flex items-center gap-2">
                        {!styleOpen && hasCustomStyle && (
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400/80" aria-hidden />
                        )}
                        <ChevronDown
                            className={cn(
                                'w-3.5 h-3.5 text-neutral-600 transition-transform',
                                styleOpen && 'rotate-180'
                            )}
                        />
                    </span>
                </button>

                {styleOpen && (
                    <div className="px-4 pb-3 space-y-0">
                        <StyleRow label={t('controls.labelsOnCovers')}>
                            <ChipRow
                                options={[
                                    { value: 'true', label: t('labels.withNames') },
                                    { value: 'false', label: t('labels.withoutNames') },
                                ]}
                                value={showLabels ? 'true' : 'false'}
                                onChange={(v) => onLabelsChange(v === 'true')}
                                disabled={disabled}
                            />
                        </StyleRow>

                        {showLabels && (
                            <StyleRow label={t('controls.labelContent')}>
                                <ChipRow
                                    options={[
                                        { value: 'both', label: t('labels.artistAndAlbum') },
                                        { value: 'artist', label: t('labels.artistOnly') },
                                        { value: 'album', label: t('labels.albumOnly') },
                                    ]}
                                    value={labelMode}
                                    onChange={onLabelModeChange}
                                    disabled={disabled}
                                />
                            </StyleRow>
                        )}

                        <StyleRow label={t('controls.spacing')}>
                            <ChipRow
                                options={[
                                    { value: '0', label: t('spacing.none') },
                                    { value: '1', label: t('spacing.thin') },
                                    { value: '4', label: t('spacing.medium') },
                                    { value: '8', label: t('spacing.large') },
                                ]}
                                value={gap}
                                onChange={onGapChange}
                                disabled={disabled}
                            />
                        </StyleRow>

                        <StyleRow label={t('controls.corners')}>
                            <ChipRow
                                options={[
                                    { value: '0', label: t('corners.square') },
                                    { value: 'md', label: t('corners.soft') },
                                    { value: 'lg', label: t('corners.rounded') },
                                    { value: 'xl', label: t('corners.pill') },
                                ]}
                                value={radius}
                                onChange={onRadiusChange}
                                disabled={disabled}
                            />
                        </StyleRow>

                        <StyleRow label={t('controls.outerBorder')}>
                            <ChipRow
                                options={[
                                    { value: 'true', label: t('border.with') },
                                    { value: 'false', label: t('border.without') },
                                ]}
                                value={showBorder ? 'true' : 'false'}
                                onChange={(v) => onBorderChange(v === 'true')}
                                disabled={disabled}
                            />
                        </StyleRow>
                    </div>
                )}
            </div>
        </div>
    );
}
