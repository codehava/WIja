// ═══════════════════════════════════════════════════════════════════════════════
// WIJA - Family Navigation Component
// Sub-navigation for family pages
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { useIsAdmin } from '@/hooks/useAuth';

interface FamilyNavProps {
    familyId: string;
}

export function FamilyNav({ familyId }: FamilyNavProps) {
    const pathname = usePathname();
    const { hasRole: isAdmin } = useIsAdmin(familyId);

    const links = [
        { href: `/family/${familyId}`, label: '🌳 Pohon', exact: true },
        { href: `/family/${familyId}/members`, label: '👥 Anggota' },
        ...(isAdmin ? [{ href: `/family/${familyId}/settings`, label: '⚙️ Pengaturan' }] : [])
    ];

    const isActive = (href: string, exact?: boolean) => {
        if (exact) return pathname === href;
        return pathname.startsWith(href);
    };

    return (
        <nav className="flex gap-1 bg-teal-600/50 rounded-lg p-1">
            {links.map(({ href, label, exact }) => (
                <Link
                    key={href}
                    href={href}
                    className={clsx(
                        'px-4 py-2 rounded-md text-sm font-medium transition',
                        isActive(href, exact)
                            ? 'bg-white text-teal-700 shadow'
                            : 'text-teal-100 hover:text-white hover:bg-white/10'
                    )}
                >
                    {label}
                </Link>
            ))}
        </nav>
    );
}

export default FamilyNav;
