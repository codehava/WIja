// ═══════════════════════════════════════════════════════════════════════════════
// WIJA - Skeleton Loading Component
// ═══════════════════════════════════════════════════════════════════════════════

import { HTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'text' | 'circular' | 'rectangular' | 'card';
    width?: string | number;
    height?: string | number;
    lines?: number;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
    ({ variant = 'rectangular', width, height, lines = 1, className, ...props }, ref) => {
        const baseStyles = 'skeleton';

        const variantStyles = {
            text: 'h-4 rounded',
            circular: 'rounded-full',
            rectangular: 'rounded-lg',
            card: 'rounded-xl'
        };

        const getSize = () => {
            const w = typeof width === 'number' ? `${width}px` : width;
            const h = typeof height === 'number' ? `${height}px` : height;
            return { width: w, height: h };
        };

        if (variant === 'text' && lines > 1) {
            return (
                <div ref={ref} className={clsx('space-y-2', className)} {...props}>
                    {Array.from({ length: lines }).map((_, i) => (
                        <div
                            key={i}
                            className={clsx(baseStyles, variantStyles.text)}
                            style={{
                                ...getSize(),
                                width: i === lines - 1 ? '75%' : width
                            }}
                        />
                    ))}
                </div>
            );
        }

        return (
            <div
                ref={ref}
                className={clsx(baseStyles, variantStyles[variant], className)}
                style={getSize()}
                {...props}
            />
        );
    }
);

Skeleton.displayName = 'Skeleton';

// Skeleton Card - Pre-built skeleton for family cards
export const SkeletonCard = () => (
    <div className="p-5 rounded-xl glass">
        <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
                <Skeleton variant="text" width="70%" height={20} className="mb-2" />
                <Skeleton variant="text" width="50%" height={14} />
            </div>
            <Skeleton variant="circular" width={40} height={40} />
        </div>
        <div className="flex gap-4">
            <Skeleton variant="text" width={80} height={14} />
            <Skeleton variant="text" width={60} height={14} />
        </div>
    </div>
);

// Skeleton Tree Node - loading placeholder for tree nodes
export const SkeletonTreeNode = () => (
    <div className="inline-flex items-center gap-3 p-3 rounded-xl bg-stone-100 border-2 border-stone-200 animate-pulse" style={{ width: 200, height: 80 }}>
        <div className="w-12 h-12 rounded-full bg-stone-200 flex-shrink-0" />
        <div className="flex-1 space-y-2">
            <div className="h-4 w-24 bg-stone-200 rounded" />
            <div className="h-3 w-16 bg-stone-200 rounded" />
        </div>
    </div>
);

// Full page skeleton for tree view
export const SkeletonTreeView = () => (
    <div className="h-full w-full flex flex-col items-center justify-center gap-8 bg-gradient-to-br from-stone-100 to-stone-50 animate-pulse">
        {/* Top row */}
        <div className="flex gap-8">
            <SkeletonTreeNode />
        </div>
        {/* Line */}
        <div className="w-px h-8 bg-stone-200" />
        {/* Second row */}
        <div className="flex gap-8">
            <SkeletonTreeNode />
            <SkeletonTreeNode />
        </div>
        {/* Line */}
        <div className="w-px h-8 bg-stone-200" />
        {/* Third row */}
        <div className="flex gap-8">
            <SkeletonTreeNode />
            <SkeletonTreeNode />
            <SkeletonTreeNode />
        </div>
    </div>
);
