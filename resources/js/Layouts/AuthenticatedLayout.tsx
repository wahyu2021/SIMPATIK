import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Sidebar from './Partials/Sidebar';
import Topbar from './Partials/Topbar';

/**
 * Props untuk AuthenticatedLayout.
 * @property title - Judul halaman (untuk <Head>)
 * @property children - Konten halaman utama
 */
interface AuthenticatedLayoutProps {
    title?: string;
    children: React.ReactNode;
}

/** Key localStorage untuk menyimpan preferensi collapsed sidebar */
const SIDEBAR_COLLAPSED_KEY = 'simpatik_sidebar_collapsed';

/**
 * Layout utama aplikasi SIMPATIK setelah login.
 * Menyediakan Sidebar (kiri) + Topbar (atas) + main content area.
 *
 * Fitur:
 * - Sidebar collapsible (tersimpan di localStorage)
 * - Mobile drawer overlay dengan backdrop
 * - Responsive: sidebar tersembunyi < lg, muncul sebagai drawer
 *
 * @example
 * // Cara pakai di halaman:
 * export default function CategoriesIndex() {
 *     return (
 *         <AuthenticatedLayout title="Kategori">
 *             <PageHeader title="Kategori" />
 *             <Card><DataTable ... /></Card>
 *         </AuthenticatedLayout>
 *     );
 * }
 */
export default function AuthenticatedLayout({ title, children }: AuthenticatedLayoutProps) {
    // ── State ──
    const [collapsed, setCollapsed] = useState(() => {
        if (typeof window === 'undefined') return false;
        return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true';
    });
    const [mobileOpen, setMobileOpen] = useState(false);

    // ── Simpan preferensi collapsed ke localStorage ──
    useEffect(() => {
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(collapsed));
    }, [collapsed]);

    // ── Kunci scroll body saat mobile drawer terbuka ──
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileOpen]);

    return (
        <>
            {title && <Head title={title} />}

            <div className="flex h-screen bg-gray-50 overflow-hidden">
                {/* ══════════════════════════════════════════
                    SIDEBAR — Desktop (static)
                   ══════════════════════════════════════════ */}
                <div className="hidden lg:flex shrink-0">
                    <Sidebar
                        collapsed={collapsed}
                        onToggle={() => setCollapsed(!collapsed)}
                    />
                </div>

                {/* ══════════════════════════════════════════
                    SIDEBAR — Mobile Drawer (overlay)
                   ══════════════════════════════════════════ */}
                {mobileOpen && (
                    <div className="fixed inset-0 z-40 lg:hidden">
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                            onClick={() => setMobileOpen(false)}
                        />

                        {/* Drawer Panel */}
                        <div className="fixed inset-y-0 left-0 flex w-[260px] animate-slide-in-left">
                            <Sidebar
                                collapsed={false}
                                onToggle={() => {}}
                                onClose={() => setMobileOpen(false)}
                            />

                            {/* Close button */}
                            <button
                                onClick={() => setMobileOpen(false)}
                                className="absolute top-4 right-[-44px] p-2 rounded-lg bg-white/10 backdrop-blur text-white hover:bg-white/20 transition-colors"
                                aria-label="Tutup menu"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}

                {/* ══════════════════════════════════════════
                    MAIN CONTENT AREA (Topbar + Page Content)
                   ══════════════════════════════════════════ */}
                <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                    {/* Topbar */}
                    <Topbar onMenuToggle={() => setMobileOpen(!mobileOpen)} />

                    {/* Page Content */}
                    <main className="flex-1 overflow-y-auto">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
