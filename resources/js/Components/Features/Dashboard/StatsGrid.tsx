import {
    Package,
    FolderTree,
    Users,
    AlertTriangle,
    Clock,
    CheckCircle,
    PackagePlus,
    Building2,
} from 'lucide-react';
import { StatCard } from '../../UI';

/**
 * Data statistik dari DashboardService.
 */
export interface DashboardStats {
    total_items: number;
    total_categories: number;
    total_departments: number;
    total_users: number;
    low_stock_count: number;
    pending_requests: number;
    approved_today: number;
    inbound_this_month: number;
}

/**
 * Komponen StatsGrid — 2 baris × 4 kolom StatCard untuk Dashboard.
 *
 * @example
 * <StatsGrid stats={stats} />
 */
export default function StatsGrid({ stats }: { stats: DashboardStats }) {
    return (
        <>
            {/* Baris 1: Data Utama */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
                <StatCard
                    title="Total Barang"
                    value={stats.total_items}
                    icon={<Package className="w-6 h-6" />}
                    color="blue"
                />
                <StatCard
                    title="Kategori"
                    value={stats.total_categories}
                    icon={<FolderTree className="w-6 h-6" />}
                    color="green"
                />
                <StatCard
                    title="Unit Kerja"
                    value={stats.total_departments}
                    icon={<Building2 className="w-6 h-6" />}
                    color="purple"
                />
                <StatCard
                    title="Pengguna Aktif"
                    value={stats.total_users}
                    icon={<Users className="w-6 h-6" />}
                    color="blue"
                />
            </div>

            {/* Baris 2: Aktivitas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <StatCard
                    title="Stok Rendah"
                    value={stats.low_stock_count}
                    icon={<AlertTriangle className="w-6 h-6" />}
                    color={stats.low_stock_count > 0 ? 'red' : 'green'}
                />
                <StatCard
                    title="Pengajuan Pending"
                    value={stats.pending_requests}
                    icon={<Clock className="w-6 h-6" />}
                    color={stats.pending_requests > 0 ? 'yellow' : 'green'}
                />
                <StatCard
                    title="Disetujui Hari Ini"
                    value={stats.approved_today}
                    icon={<CheckCircle className="w-6 h-6" />}
                    color="green"
                />
                <StatCard
                    title="Barang Masuk (Bulan Ini)"
                    value={stats.inbound_this_month}
                    icon={<PackagePlus className="w-6 h-6" />}
                    color="blue"
                />
            </div>
        </>
    );
}
