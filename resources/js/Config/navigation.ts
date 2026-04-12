import {
    LayoutDashboard,
    Package,
    PackagePlus,
    Send,
    FolderTree,
    Building2,
    Users,
    BarChart3,
    Settings,
    type LucideIcon,
} from 'lucide-react';

/**
 * Definisi satu item menu sidebar.
 * @property label - Teks menu
 * @property href - URL tujuan (Inertia route)
 * @property icon - Komponen icon dari lucide-react
 * @property routeMatch - Pattern untuk deteksi active state (match awal URL)
 * @property roles - Role yang boleh melihat menu ini (kosong = semua role)
 */
export interface MenuItem {
    label: string;
    href: string;
    icon: LucideIcon;
    routeMatch: string;
    roles?: string[];
}

/**
 * Definisi grup menu di sidebar (misal "Master Data", "Transaksi").
 * @property title - Judul grup (tersembunyi saat collapsed)
 * @property items - Array MenuItem di dalam grup ini
 */
export interface MenuGroup {
    title: string;
    items: MenuItem[];
}

/**
 * Konfigurasi seluruh menu navigasi SIMPATIK.
 * Disimpan terpisah dari komponen Sidebar agar mudah di-maintain.
 *
 * Aturan `roles`:
 * - Tidak ada / kosong → semua role bisa lihat
 * - Ada isi → hanya role yang tercantum yang bisa lihat
 */
export const menuGroups: MenuGroup[] = [
    {
        title: 'Utama',
        items: [
            { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, routeMatch: '/dashboard' },
        ],
    },
    {
        title: 'Transaksi',
        items: [
            { label: 'Barang Masuk', href: '/inbound', icon: PackagePlus, routeMatch: '/inbound' },
            { label: 'Pengajuan Barang', href: '/outbound', icon: Send, routeMatch: '/outbound' },
        ],
    },
    {
        title: 'Master Data',
        items: [
            { label: 'Barang', href: '/items', icon: Package, routeMatch: '/items' },
            { label: 'Kategori', href: '/categories', icon: FolderTree, routeMatch: '/categories' },
            { label: 'Unit Kerja', href: '/departments', icon: Building2, routeMatch: '/departments' },
        ],
    },
    {
        title: 'Sistem',
        items: [
            { label: 'Pengguna', href: '/users', icon: Users, routeMatch: '/users', roles: ['warehouse_admin'] },
            { label: 'Laporan', href: '/reports', icon: BarChart3, routeMatch: '/reports' },
            { label: 'Pengaturan', href: '/settings', icon: Settings, routeMatch: '/settings', roles: ['warehouse_admin'] },
        ],
    },
];
