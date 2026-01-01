// ═══════════════════════════════════════════════════════════════════════════════
// WIJA - Root Layout
// Next.js App Router root layout with AuthProvider
// ═══════════════════════════════════════════════════════════════════════════════

import type { Metadata } from 'next';
import { AuthProvider } from '@/contexts/AuthContext';
import './globals.css';

export const metadata: Metadata = {
    title: 'WIJA - Warisan Jejak Keluarga',
    description: 'Aplikasi Pohon Keluarga Digital dengan Aksara Lontara',
    keywords: ['family tree', 'pohon keluarga', 'silsilah', 'lontara', 'bugis', 'aksara'],
    authors: [{ name: 'WIJA Team' }],
    openGraph: {
        title: 'WIJA - Warisan Jejak Keluarga',
        description: 'Aplikasi Pohon Keluarga Digital dengan Aksara Lontara',
        type: 'website',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="id">
            <head>
                {/* Noto Sans Buginese font for Lontara script */}
                <link
                    href="https://fonts.googleapis.com/css2?family=Noto+Sans+Buginese&display=swap"
                    rel="stylesheet"
                />
                {/* Inter font for Latin text */}
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="font-sans antialiased">
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
