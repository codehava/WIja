// ═══════════════════════════════════════════════════════════════════════════════
// WIJA - Dual Script Display Component
// Shows Latin text with auto-transliterated Lontara
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useMemo } from 'react';
import { clsx } from 'clsx';
import { transliterateLatin } from '@/lib/transliteration/engine';
import { ScriptMode } from '@/types';

export interface DualScriptDisplayProps {
    latinText: string;
    displayMode?: ScriptMode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    layout?: 'stacked' | 'inline';
    className?: string;
    lontaraClassName?: string;
    latinClassName?: string;
    customLontara?: string; // Optional override
}

export function DualScriptDisplay({
    latinText,
    displayMode = 'both',
    size = 'md',
    layout = 'stacked',
    className,
    lontaraClassName,
    latinClassName,
    customLontara
}: DualScriptDisplayProps) {
    // Auto-transliterate if no custom Lontara provided
    const lontaraText = useMemo(() => {
        if (customLontara) return customLontara;
        return transliterateLatin(latinText).lontara;
    }, [latinText, customLontara]);

    const sizes = {
        sm: { latin: 'text-sm', lontara: 'text-base' },
        md: { latin: 'text-base', lontara: 'text-lg' },
        lg: { latin: 'text-lg', lontara: 'text-xl' },
        xl: { latin: 'text-xl', lontara: 'text-2xl' }
    };

    if (displayMode === 'latin') {
        return (
            <span className={clsx(sizes[size].latin, className, latinClassName)}>
                {latinText}
            </span>
        );
    }

    if (displayMode === 'lontara') {
        return (
            <span className={clsx(
                'font-lontara text-teal-700',
                sizes[size].lontara,
                className,
                lontaraClassName
            )}>
                {lontaraText}
            </span>
        );
    }

    // Both modes
    if (layout === 'inline') {
        return (
            <span className={clsx('inline-flex items-center gap-2', className)}>
                <span className={clsx(sizes[size].latin, latinClassName)}>
                    {latinText}
                </span>
                <span className={clsx(
                    'font-lontara text-teal-700',
                    sizes[size].lontara,
                    lontaraClassName
                )}>
                    ({lontaraText})
                </span>
            </span>
        );
    }

    // Stacked layout (default)
    return (
        <div className={clsx('flex flex-col', className)}>
            <span className={clsx(sizes[size].latin, latinClassName)}>
                {latinText}
            </span>
            <span className={clsx(
                'font-lontara text-teal-700',
                sizes[size].lontara,
                lontaraClassName
            )}>
                {lontaraText}
            </span>
        </div>
    );
}

// Compact badge version
export interface DualScriptBadgeProps {
    latinText: string;
    variant?: 'default' | 'outlined';
}

export function DualScriptBadge({ latinText, variant = 'default' }: DualScriptBadgeProps) {
    const lontaraText = useMemo(() => transliterateLatin(latinText).lontara, [latinText]);

    const variants = {
        default: 'bg-teal-50 border-teal-200',
        outlined: 'bg-white border-teal-300'
    };

    return (
        <span className={clsx(
            'inline-flex flex-col items-center px-2 py-1 rounded-lg border text-center',
            variants[variant]
        )}>
            <span className="text-xs font-medium text-stone-700">{latinText}</span>
            <span className="text-sm font-lontara text-teal-700">{lontaraText}</span>
        </span>
    );
}
