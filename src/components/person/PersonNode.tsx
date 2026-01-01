// ═══════════════════════════════════════════════════════════════════════════════
// WIJA - Person Node Component
// Tree node for family visualization
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useMemo } from 'react';
import { clsx } from 'clsx';
import { Person, ScriptMode } from '@/types';
import { transliterateLatin } from '@/lib/transliteration/engine';
import { getGenerationLabel } from '@/lib/generation/calculator';

export interface PersonNodeProps {
    person: Person;
    scriptMode?: ScriptMode;
    generation?: number;
    selected?: boolean;
    onClick?: () => void;
    showDetails?: boolean;
    compact?: boolean;
}

export function PersonNode({
    person,
    scriptMode = 'both',
    generation = -1,
    selected = false,
    onClick,
    showDetails = true,
    compact = false
}: PersonNodeProps) {
    // Get display name
    const displayName = person.fullName || person.firstName;

    // Auto-transliterate full name for Lontara display
    const lontaraName = useMemo(() => {
        if (person.lontaraNameCustom?.first) {
            const parts = [person.lontaraNameCustom.first, person.lontaraNameCustom.middle, person.lontaraNameCustom.last].filter(Boolean);
            return parts.join(' ');
        }
        return transliterateLatin(displayName).lontara;
    }, [displayName, person.lontaraNameCustom]);

    // Gender-based styling
    const genderStyles = {
        male: {
            bg: 'from-blue-50 to-blue-100',
            border: 'border-blue-300',
            avatar: 'bg-blue-500',
            icon: '👨'
        },
        female: {
            bg: 'from-pink-50 to-pink-100',
            border: 'border-pink-300',
            avatar: 'bg-pink-500',
            icon: '👩'
        },
        other: {
            bg: 'from-purple-50 to-purple-100',
            border: 'border-purple-300',
            avatar: 'bg-purple-500',
            icon: '👤'
        },
        unknown: {
            bg: 'from-gray-50 to-gray-100',
            border: 'border-gray-300',
            avatar: 'bg-gray-500',
            icon: '👤'
        }
    };

    const style = genderStyles[person.gender];
    const generationText = generation > 0 ? getGenerationLabel(generation) : null;

    return (
        <div
            onClick={onClick}
            className={clsx(
                'cursor-pointer transition-all duration-200 hover:scale-105',
                selected && 'ring-4 ring-teal-400 shadow-xl scale-105'
            )}
            style={person.position ? {
                position: 'absolute',
                left: person.position.x,
                top: person.position.y
            } : undefined}
        >
            <div className={clsx(
                'rounded-xl border-2 bg-gradient-to-br shadow-md',
                style.bg,
                style.border,
                compact ? 'p-2 min-w-[100px]' : 'p-3 min-w-[140px]'
            )}>
                {/* Avatar and Name */}
                <div className="flex items-center gap-2 mb-2">
                    <div className={clsx(
                        'rounded-full flex items-center justify-center text-white font-bold',
                        style.avatar,
                        compact ? 'w-8 h-8 text-sm' : 'w-10 h-10 text-lg'
                    )}>
                        {person.photoUrl ? (
                            <img
                                src={person.photoUrl}
                                alt={person.firstName}
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            style.icon
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        {/* Latin Name */}
                        {(scriptMode === 'latin' || scriptMode === 'both') && (
                            <div className={clsx(
                                'font-semibold text-stone-800 truncate',
                                compact ? 'text-xs' : 'text-sm'
                            )}>
                                {displayName}
                            </div>
                        )}

                        {/* Lontara Name */}
                        {(scriptMode === 'lontara' || scriptMode === 'both') && (
                            <div className={clsx(
                                'font-lontara text-teal-700 truncate',
                                compact ? 'text-sm' : 'text-sm'
                            )}>
                                {lontaraName}
                            </div>
                        )}
                    </div>
                </div>

                {/* Details */}
                {showDetails && !compact && (
                    <div className="text-xs text-stone-500 space-y-0.5">
                        {person.birthDate && (
                            <div>
                                🎂 {person.birthDate.split('-')[0]}
                                {person.deathDate && ` - ${person.deathDate.split('-')[0]}`}
                            </div>
                        )}

                        {generationText && (
                            <div className="flex items-center gap-1">
                                <span className="bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded text-[10px]">
                                    {generationText}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* Deceased indicator */}
                {!person.isLiving && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-stone-400 rounded-full flex items-center justify-center text-white text-[8px]">
                        ✝
                    </div>
                )}
            </div>
        </div>
    );
}

export default PersonNode;
