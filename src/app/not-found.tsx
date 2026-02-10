// ═══════════════════════════════════════════════════════════════════════════════
// WIJA - 404 Not Found Page
// ═══════════════════════════════════════════════════════════════════════════════

import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-teal-50 to-cyan-50 px-4">
            <div className="text-center max-w-md">
                <div className="text-8xl font-bold text-teal-200 mb-4">404</div>
                <h1 className="text-2xl font-bold text-stone-800 mb-2">
                    Halaman Tidak Ditemukan
                </h1>
                <p className="text-stone-600 mb-6">
                    Halaman yang Anda cari tidak ada atau telah dipindahkan.
                </p>
                <Link
                    href="/"
                    className="inline-block px-6 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg hover:from-teal-600 hover:to-cyan-600 transition font-medium shadow-lg"
                >
                    🏠 Kembali ke Beranda
                </Link>
            </div>
        </div>
    );
}
