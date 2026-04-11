import { PageProps } from '../../Types';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import StatsGrid, { DashboardStats } from '../../Components/Features/Dashboard/StatsGrid';
import RecentRequests, { RecentRequest } from '../../Components/Features/Dashboard/RecentRequests';
import LowStockAlerts, { LowStockItemData } from '../../Components/Features/Dashboard/LowStockAlerts';

interface DashboardProps extends PageProps {
    stats: DashboardStats;
    recentRequests: RecentRequest[];
    lowStockItems: LowStockItemData[];
}

export default function Dashboard({ auth, stats, recentRequests, lowStockItems }: DashboardProps) {
    return (
        <AuthenticatedLayout title="Dashboard">
            {/* ── Welcome Header ── */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-1">
                    Selamat datang kembali, <span className="font-medium text-gray-700">{auth.user.name}</span>
                </p>
            </div>

            {/* ── Stats ── */}
            <StatsGrid stats={stats} />

            {/* ── Content Cards ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentRequests data={recentRequests} />
                <LowStockAlerts data={lowStockItems} />
            </div>
        </AuthenticatedLayout>
    );
}
