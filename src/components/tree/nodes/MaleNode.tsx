'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

interface MaleNodeData {
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

function MaleNodeComponent({ data }: NodeProps) {
    const d = data as unknown as MaleNodeData;
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
            {/* Handle: top (for parent-child connections coming in) */}
            <Handle
                type="target"
                position={Position.Top}
                id="top"
                style={{ background: 'transparent', border: 'none', width: 1, height: 1, top: 0 }}
            />

            {/* Shape wrapper — spouse handles attach HERE so lines connect to the shape */}
            <div className="relative">
                {/* Circle Shape */}
                <div
                    className={`rounded-full overflow-hidden flex items-center justify-center text-white text-lg drop-shadow-lg ${d.isSelected ? 'ring-3 ring-teal-400 ring-offset-2' :
                            d.isOnAncestryPath ? 'ring-3 ring-amber-400 ring-offset-2' :
                                d.isHighlighted ? 'ring-3 ring-amber-400 ring-offset-2' : ''
                        }`}
                    style={{
                        width: shapeSize, height: shapeSize,
                        background: 'linear-gradient(135deg, #93c5fd, #3b82f6)',
                        border: `2px solid ${d.isOnAncestryPath ? '#f59e0b' :
                                d.isSelected ? '#14b8a6' :
                                    d.isHighlighted ? '#f59e0b' : '#2563eb'
                            }`
                    }}
                >
                    {d.person.photoUrl ? (
                        <img src={d.person.photoUrl} alt={d.person.firstName} className="w-full h-full object-cover" />
                    ) : (
                        <span className={`font-light opacity-90 ${shapeSize < 44 ? 'text-sm' : 'text-xl'}`}>♂</span>
                    )}
                </div>

                {/* Spouse handles — positioned at shape center height */}
                <Handle
                    type="source"
                    position={Position.Right}
                    id="right"
                    style={{ background: 'transparent', border: 'none', width: 1, height: 1, top: '50%', right: -1 }}
                />
                <Handle
                    type="target"
                    position={Position.Left}
                    id="left"
                    style={{ background: 'transparent', border: 'none', width: 1, height: 1, top: '50%', left: -1 }}
                />
            </div>

            {/* Text below shape — Lontara FIRST, then Latin */}
            <div className="text-center w-full px-1" style={{ maxWidth: 140 }}>
                {(d.scriptMode === 'lontara' || d.scriptMode === 'both') && d.lontaraFullName && (
                    <div className="text-teal-700 font-lontara leading-tight text-[11px]">
                        {d.lontaraFullName}
                    </div>
                )}
                {(d.scriptMode === 'latin' || d.scriptMode === 'both') && (
                    <div className={`font-medium leading-tight text-stone-700 ${d.displayName.length > 25 ? 'text-[10px]' : 'text-xs'
                        }`}>
                        {d.displayName}
                    </div>
                )}
            </div>

            {/* Handle: bottom (for parent-child connections going out) */}
            <Handle
                type="source"
                position={Position.Bottom}
                id="bottom"
                style={{ background: 'transparent', border: 'none', width: 1, height: 1, bottom: 0 }}
            />
        </div>
    );
}

export const MaleNode = memo(MaleNodeComponent);
