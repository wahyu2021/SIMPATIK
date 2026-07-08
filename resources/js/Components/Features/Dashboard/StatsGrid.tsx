import {
    Package,
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
/**
 * Komponen: StatsGrid
 *
 * [State & Rendering]
 * Merupakan komponen presentasional atau kontainer dalam arsitektur React.
 * Lifecycle dikendalikan oleh Inertia (jika Page) atau parent props (jika Component).
 */
export default function StatsGrid({ stats }: { stats: DashboardStats }) {
    const { auth } = usePage<PageProps>().props;
    const role = auth.user.roles?.[0]?.name ?? '';

    // Render cards for Bagian Umum
    if (role === 'general_affairs') {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-8">
                <StatCard title="Katalog Barang" value={stats.total_items ?? 0} icon={<Package className="w-6 h-6" />} color="blue" />
                <StatCard title="Stok Kritis" value={stats.low_stock_count ?? 0} icon={<AlertTriangle className="w-6 h-6" />} color={(stats.low_stock_count ?? 0) > 0 ? 'red' : 'green'} />
                <StatCard title="Barang Masuk (Bln Ini)" value={stats.inbound_this_month ?? 0} icon={<PackagePlus className="w-6 h-6" />} color="purple" />
                <StatCard title="Total Pengguna" value={stats.total_users ?? 0} icon={<Users className="w-6 h-6" />} color="green" />
            </div>
        );
    }

    // Render cards for Admin Gudang
    if (role === 'warehouse_admin') {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-8">
                <StatCard title="Permintaan Menunggu" value={stats.pending_issue ?? 0} icon={<Clock className="w-6 h-6" />} color={(stats.pending_issue ?? 0) > 0 ? 'yellow' : 'blue'} />
                <StatCard title="Selesai / Diserahkan Hari Ini" value={stats.issued_today ?? 0} icon={<CheckCircle className="w-6 h-6" />} color="green" />
                <StatCard title="Katalog Barang" value={stats.total_items ?? 0} icon={<Package className="w-6 h-6" />} color="purple" />
                <StatCard title="Stok Kritis" value={stats.low_stock_count ?? 0} icon={<AlertTriangle className="w-6 h-6" />} color={(stats.low_stock_count ?? 0) > 0 ? 'red' : 'green'} />
            </div>
        );
    }

    // Render cards for Penyelia
    if (role === 'division_head') {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-8">
                <StatCard title="Perlu Persetujuan" value={stats.pending_approval ?? 0} icon={<Clock className="w-6 h-6" />} color={(stats.pending_approval ?? 0) > 0 ? 'yellow' : 'green'} />
                <StatCard title="Disetujui Hari Ini" value={stats.approved_today ?? 0} icon={<ClipboardCheck className="w-6 h-6" />} color="blue" />
                <StatCard title="Unit Kerja Anda" value={auth.user.department?.name || '-'} icon={<Building2 className="w-6 h-6" />} color="purple" />
                <StatCard title="Role Anda" value="Penyelia" icon={<Users className="w-6 h-6" />} color="blue" />
            </div>
        );
    }

    // Render cards for Staf (staff)
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-8">
            <StatCard title="Pengajuan Aktif" value={stats.my_active_requests ?? 0} icon={<Clock className="w-6 h-6" />} color={(stats.my_active_requests ?? 0) > 0 ? 'yellow' : 'green'} />
            <StatCard title="Pengajuan Selesai" value={stats.my_completed_requests ?? 0} icon={<CheckCircle className="w-6 h-6" />} color="blue" />
            <StatCard title="Unit Kerja Anda" value={auth.user.department?.name || '-'} icon={<Building2 className="w-6 h-6" />} color="purple" />
            <StatCard title="Role Anda" value="Staf Unit" icon={<Users className="w-6 h-6" />} color="blue" />
        </div>
    );
}
