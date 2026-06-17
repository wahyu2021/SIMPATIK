import {
    Package,
    FolderTree,
    Users,
    AlertTriangle,
    Clock,
    CheckCircle,
    PackagePlus,
    Building2,
    ClipboardCheck,
} from 'lucide-react';
import { StatCard } from '../../UI';
import { DashboardStats, PageProps } from '../../../Types';
import { usePage } from '@inertiajs/react';

/**
 * Komponen StatsGrid — Menampilkan statistik dashboard yang relevan sesuai role.
 */
export default function StatsGrid({ stats }: { stats: DashboardStats }) {
    const { auth } = usePage<PageProps>().props;
    const role = auth.user.roles?.[0]?.name ?? '';
    const isAdmin = role === 'warehouse_admin';
    const isPenyelia = role === 'division_head';
    const isGeneralAffairs = role === 'general_affairs';

    return (
        <>
            {/* Baris 1: Konteks & Data Master */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6">
                <StatCard
                    title="Katalog Barang"
                    value={stats.total_items}
                    icon={<Package className="w-6 h-6" />}
                    color="blue"
                />
                
                {isAdmin ? (
                    <>
                        <StatCard
                            title="Total Kategori"
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
                    </>
                ) : (
                    <>
                        <StatCard
                            title="Unit Kerja"
                            value={auth.user.department?.name || 'Umum'}
                            icon={<Building2 className="w-6 h-6" />}
                            color="purple"
                        />
                        <StatCard
                            title="Role User"
                            value={isPenyelia ? 'Penyelia' : 'Staf Unit'}
                            icon={<Users className="w-6 h-6" />}
                            color="blue"
                        />
                        <StatCard
                            title="Peringatan Stok"
                            value={stats.low_stock_count}
                            icon={<AlertTriangle className="w-6 h-6" />}
                            color={stats.low_stock_count > 0 ? 'red' : 'green'}
                        />
                    </>
                )}
            </div>

            {/* Baris 2: Aktivitas Transaksi (Terfilter per Role) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-8">
                {/* Admin melihat global, Penyelia melihat unitnya, Staff melihat pribadinya */}
                <StatCard
                    title={
                        isAdmin ? "Permintaan Menunggu" : 
                        isPenyelia ? "Perlu Persetujuan" : 
                        "Permintaan Saya"
                    }
                    value={stats.pending_requests}
                    icon={<Clock className="w-6 h-6" />}
                    color={stats.pending_requests > 0 ? 'yellow' : 'green'}
                />

                <StatCard
                    title={
                        isAdmin ? "Disetujui Hari Ini" : 
                        isPenyelia ? "Disetujui Baru" : 
                        "Status Disetujui"
                    }
                    value={stats.approved_today}
                    icon={<ClipboardCheck className="w-6 h-6" />}
                    color="green"
                />

                {isGeneralAffairs ? (
                    <>
                        <StatCard
                            title="Barang Masuk (Bulan Ini)"
                            value={stats.inbound_this_month}
                            icon={<PackagePlus className="w-6 h-6" />}
                            color="blue"
                        />
                         <StatCard
                            title="Stok Kritis"
                            value={stats.low_stock_count}
                            icon={<AlertTriangle className="w-6 h-6" />}
                            color={stats.low_stock_count > 0 ? 'red' : 'green'}
                        />
                    </>
                ) : isAdmin ? (
                    <>
                        <StatCard
                            title="Unit Aktif"
                            value={stats.total_departments}
                            icon={<Building2 className="w-6 h-6" />}
                            color="blue"
                        />
                         <StatCard
                            title="Stok Kritis"
                            value={stats.low_stock_count}
                            icon={<AlertTriangle className="w-6 h-6" />}
                            color={stats.low_stock_count > 0 ? 'red' : 'green'}
                        />
                    </>
                ) : (
                    <>
                        <StatCard
                            title="Unit Aktif"
                            value={stats.total_departments}
                            icon={<Building2 className="w-6 h-6" />}
                            color="blue"
                        />
                        <StatCard
                            title="Total Kategori"
                            value={stats.total_categories}
                            icon={<FolderTree className="w-6 h-6" />}
                            color="green"
                        />
                    </>
                )}
            </div>
        </>
    );
}
