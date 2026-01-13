// ═══════════════════════════════════════════════════════════════════════════════
// WIJA - Tree Minimap Component
// Overview navigation for large family trees
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useMemo, useCallback } from 'react';
import { clsx } from 'clsx';

interface NodePosition {
    x: number;
    y: number;
}

interface Person {
    personId: string;
    gender: 'male' | 'female' | 'other' | 'unknown';
}

export interface TreeMinimapProps {
    positions: Map<string, NodePosition>;
    persons: Person[];
    canvasSize: { width: number; height: number };
    viewport: {
        pan: { x: number; y: number };
        zoom: number;
        containerWidth: number;
        containerHeight: number;
    };
    onNavigate: (pan: { x: number; y: number }) => void;
    className?: string;
}

// Minimap dimensions
const MINIMAP_WIDTH = 180;
const MINIMAP_HEIGHT = 120;
const NODE_DOT_SIZE = 4;

export function TreeMinimap({
    positions,
    persons,
    canvasSize,
    viewport,
    onNavigate,
    className
}: TreeMinimapProps) {
    // Calculate scale to fit canvas in minimap
    const scale = useMemo(() => {
        const scaleX = MINIMAP_WIDTH / canvasSize.width;
        const scaleY = MINIMAP_HEIGHT / canvasSize.height;
        return Math.min(scaleX, scaleY);
    }, [canvasSize]);

    // Build persons map for quick lookup
    const personsMap = useMemo(() => {
        const map = new Map<string, Person>();
        persons.forEach(p => map.set(p.personId, p));
        return map;
    }, [persons]);

    // Calculate viewport rectangle in minimap coordinates
    const viewportRect = useMemo(() => {
        // Viewport in canvas coordinates
        const viewX = -viewport.pan.x / viewport.zoom;
        const viewY = -viewport.pan.y / viewport.zoom;
        const viewWidth = viewport.containerWidth / viewport.zoom;
        const viewHeight = viewport.containerHeight / viewport.zoom;

        return {
            x: viewX * scale,
            y: viewY * scale,
            width: viewWidth * scale,
            height: viewHeight * scale
        };
    }, [viewport, scale]);

    // Handle click on minimap to navigate
    const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        // Convert minimap coords to canvas coords
        const canvasX = clickX / scale;
        const canvasY = clickY / scale;

        // Calculate pan to center on clicked point
        const newPanX = -(canvasX * viewport.zoom) + viewport.containerWidth / 2;
        const newPanY = -(canvasY * viewport.zoom) + viewport.containerHeight / 2;

        onNavigate({ x: newPanX, y: newPanY });
    }, [scale, viewport, onNavigate]);

    return (
        <div
            className={clsx(
                'bg-white/90 backdrop-blur-sm rounded-lg border border-stone-200 shadow-lg overflow-hidden cursor-crosshair',
                className
            )}
            style={{ width: MINIMAP_WIDTH, height: MINIMAP_HEIGHT }}
            onClick={handleClick}
        >
            {/* Nodes as dots */}
            <svg
                width={MINIMAP_WIDTH}
                height={MINIMAP_HEIGHT}
                className="absolute inset-0"
            >
                {/* Background grid pattern */}
                <defs>
                    <pattern id="minimapGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#minimapGrid)" />

                {/* Node dots */}
                {Array.from(positions.entries()).map(([personId, pos]) => {
                    const person = personsMap.get(personId);
                    const color = person?.gender === 'female' ? '#ec4899' : '#3b82f6';
                    return (
                        <circle
                            key={personId}
                            cx={pos.x * scale}
                            cy={pos.y * scale}
                            r={NODE_DOT_SIZE / 2}
                            fill={color}
                            opacity={0.8}
                        />
                    );
                })}

                {/* Viewport rectangle */}
                <rect
                    x={viewportRect.x}
                    y={viewportRect.y}
                    width={Math.max(viewportRect.width, 10)}
                    height={Math.max(viewportRect.height, 10)}
                    fill="rgba(13, 148, 136, 0.15)"
                    stroke="#0d9488"
                    strokeWidth="1.5"
                    rx="2"
                />
            </svg>

            {/* Label */}
            <div className="absolute bottom-1 right-1 text-[9px] text-stone-400 bg-white/80 px-1 rounded">
                {positions.size} nodes
            </div>
        </div>
    );
}

export default TreeMinimap;
