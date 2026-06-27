import { cn } from '@/lib/utils';

/** Shared Weekster control tokens — red as accent, not muddy fill+text combo */
export const controlStyles = {
    segmentActive:
        'bg-red-950/50 text-red-200 font-medium border border-red-500/25 shadow-[inset_0_1px_0_0_rgba(248,113,113,0.12)]',
    segmentIdle:
        'text-neutral-500 border border-transparent hover:text-neutral-300 hover:bg-white/[0.03]',
    chipActive:
        'bg-red-950/40 text-red-200 font-medium border border-red-500/20',
    chipIdle:
        'text-neutral-500 border border-transparent hover:text-neutral-300 hover:bg-white/[0.04]',
    thumbActive: 'border-red-400/60 bg-red-500/20',
    thumbIdle: 'border-white/12 bg-white/[0.04]',
} as const;

export function controlClass(active: boolean, variant: 'segment' | 'chip' = 'segment') {
    return cn(
        'transition-all duration-200',
        active
            ? variant === 'segment'
                ? controlStyles.segmentActive
                : controlStyles.chipActive
            : variant === 'segment'
              ? controlStyles.segmentIdle
              : controlStyles.chipIdle
    );
}
