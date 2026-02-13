'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

interface FemaleNodeData {
    label: string;
    person: {
        personId: string;
        firstName?: string;
        fullName?: string;
        gender: string;
        photoUrl?: string;
        lontaraName?: { first?: string; middle?: string; last?: string };
        biography?: string;
    };
    displayName: string;
    lontaraFullName: string;
    shapeSize: number;
    scriptMode: string;
    isSelected: boolean;
    isHighlighted: boolean;
    isOnAncestryPath: boolean;
    hasAncestryActive: boolean;
    onPersonClick?: () => void;
    onHover?: (rect: DOMRect) => void;
    onHoverEnd?: () => void;
}

function FemaleNodeComponent({ data }: NodeProps) {
    const d = data as unknown as FemaleNodeData;
    const shapeSize = d.shapeSize || 56;

    return (
        <div
            className={`flex flex-col items-center gap-1 ${d.isSelected ? 'scale-110' : ''
                } ${d.isHighlighted ? 'animate-pulse' : ''}`}
            style={{
                opacity: d.hasAncestryActive && !d.isOnAncestryPath ? 0.3 : 1,
                filter: d.isOnAncestryPath ? 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.6))' : undefined,
            }}
            onMouseEnter={(e) => {
                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                d.onHover?.(rect);
            }}
            onMouseLeave={() => d.onHoverEnd?.()}
        >
            {/* Handle: top */}
            <Handle
                type="target"
                position={Position.Top}
                id="top"
                style={{ background: 'transparent', border: 'none', width: 1, height: 1, top: 0 }}
            />

            {/* Triangle Shape */}
            <div className="relative" style={{ width: shapeSize, height: shapeSize }}>
                <svg width={shapeSize} height={shapeSize} viewBox="0 0 56 56" className="drop-shadow-lg">
                    <defs>
                        <clipPath id={`tri-${d.person.personId}`}>
                            <polygon points="28,50 4,10 52,10" />
                        </clipPath>
                        <linearGradient id={`grad-f-${d.person.personId}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f9a8d4" />
                            <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                    </defs>
                    {d.person.photoUrl ? (
                        <image
                            href={d.person.photoUrl}
                            x="0" y="0" width="56" height="56"
                            clipPath={`url(#tri-${d.person.personId})`}
                            preserveAspectRatio="xMidYMid slice"
                        />
                    ) : (
                        <polygon
                            points="28,50 4,10 52,10"
                            fill={`url(#grad-f-${d.person.personId})`}
                        />
                    )}
                    <polygon
                        points="28,50 4,10 52,10"
                        fill="none"
                        stroke={
                            d.isOnAncestryPath ? '#f59e0b' :
                                d.isSelected ? '#14b8a6' :
                                    d.isHighlighted ? '#f59e0b' : '#db2777'
                        }
                        strokeWidth={d.isOnAncestryPath || d.isSelected || d.isHighlighted ? 3 : 2}
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

            {/* Name below shape */}
            <div className="text-center w-full px-1" style={{ maxWidth: 140 }}>
                {(d.scriptMode === 'latin' || d.scriptMode === 'both') && (
                    <div className={`font-medium leading-tight text-stone-700 ${d.displayName.length > 25 ? 'text-[10px]' : 'text-xs'
                        }`}>
                        {d.displayName}
                    </div>
                )}
                {(d.scriptMode === 'lontara' || d.scriptMode === 'both') && d.lontaraFullName && (
                    <div className="text-teal-700 font-lontara leading-tight text-[11px] mt-0.5">
                        {d.lontaraFullName}
                    </div>
                )}
            </div>

            {/* Handle: bottom */}
            <Handle
                type="source"
                position={Position.Bottom}
                id="bottom"
                style={{ background: 'transparent', border: 'none', width: 1, height: 1, bottom: 0 }}
            />

            {/* Handle: right side */}
            <Handle
                type="source"
                position={Position.Right}
                id="right"
                style={{ background: 'transparent', border: 'none', width: 1, height: 1 }}
            />

            {/* Handle: left side */}
            <Handle
                type="target"
                position={Position.Left}
                id="left"
                style={{ background: 'transparent', border: 'none', width: 1, height: 1 }}
            />
        </div>
    );
}

export const FemaleNode = memo(FemaleNodeComponent);
