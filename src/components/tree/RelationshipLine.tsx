// ═══════════════════════════════════════════════════════════════════════════════
// WIJA - Relationship Line Component
// SVG lines connecting nodes in family tree
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { RelationshipType } from '@/types';

export interface RelationshipLineProps {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    type: RelationshipType;
    animated?: boolean;
}

export function RelationshipLine({
    x1,
    y1,
    x2,
    y2,
    type,
    animated = false
}: RelationshipLineProps) {
    const lineStyles: Record<string, { stroke: string; strokeWidth: number; strokeDasharray?: string }> = {
        spouse: {
            stroke: '#EC4899',
            strokeWidth: 2,
            strokeDasharray: '8, 4'
        },
        'parent-child': {
            stroke: '#3B82F6',
            strokeWidth: 2,
            strokeDasharray: undefined
        },
        sibling: {
            stroke: '#8B5CF6',
            strokeWidth: 1.5,
            strokeDasharray: '4, 4'
        }
    };

    const style = lineStyles[type] || lineStyles['parent-child'];

    // Calculate control points for curved line
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    // For vertical parent-child lines
    const isVertical = Math.abs(x2 - x1) < 50;

    // Create path
    let pathD: string;

    if (type === 'parent-child') {
        if (isVertical) {
            // Straight vertical line with small curve
            pathD = `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`;
        } else {
            // Curved line for non-vertical connections
            pathD = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
        }
    } else if (type === 'spouse') {
        // Horizontal line for spouses
        pathD = `M ${x1} ${y1} L ${x2} ${y2}`;
    } else {
        // Simple curve for siblings
        pathD = `M ${x1} ${y1} Q ${midX} ${Math.min(y1, y2) - 30}, ${x2} ${y2}`;
    }

    return (
        <path
            d={pathD}
            fill="none"
            stroke={style.stroke}
            strokeWidth={style.strokeWidth}
            strokeDasharray={style.strokeDasharray}
            strokeLinecap="round"
            className={animated ? 'animate-draw' : ''}
        />
    );
}

// Arrow marker for parent-child relationships
export function ArrowMarker() {
    return (
        <defs>
            <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
            >
                <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill="#3B82F6"
                />
            </marker>
        </defs>
    );
}

export default RelationshipLine;
