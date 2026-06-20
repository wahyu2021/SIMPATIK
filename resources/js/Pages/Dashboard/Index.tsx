import { PageProps, DashboardStats, RecentRequest, LowStockItemData } from '../../Types';
import { MonthlyTrend, StatusDistribution } from '../../Types/dashboard';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import StatsGrid from '../../Components/Features/Dashboard/StatsGrid';
import RecentRequests from '../../Components/Features/Dashboard/RecentRequests';
import LowStockAlerts from '../../Components/Features/Dashboard/LowStockAlerts';
import MonthlyTrendChart from '../../Components/Features/Dashboard/MonthlyTrendChart';
import StatusDistributionChart from '../../Components/Features/Dashboard/StatusDistributionChart';

interface DashboardProps extends PageProps {
    stats: DashboardStats;
    recentRequests: RecentRequest[];
    lowStockItems: LowStockItemData[];
    monthlyTrend: MonthlyTrend[];
    statusDistribution: StatusDistribution[];
}

export default function Dashboard({ auth, stats, recentRequests, lowStockItems, monthlyTrend, statusDistribution }: DashboardProps) {
    const role = auth.user.roles?.[0]?.name ?? '';
    
    // Konfigurasi Visibilitas per Role
    const showTrendChart = role === 'general_affairs';
    const showDistributionChart = role === 'warehouse_admin' || role === 'general_affairs';
    const showLowStock = role === 'general_affairs' || role === 'warehouse_admin';

    return (
        <AuthenticatedLayout title="Dashboard">
            {/* ── Welcome Header ── */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-1">
                    Selamat datang kembali, <span className="font-medium text-gray-700">{auth.user.name}</span>
                </p>
            </div>

            {/* ── Stats Cards ── */}
            <StatsGrid stats={stats} />

            {/* ── Charts ── */}
            {(showTrendChart || showDistributionChart) && (
                <div className={`grid grid-cols-1 ${showTrendChart && showDistributionChart ? 'lg:grid-cols-2' : 'lg:grid-cols-1'} gap-6 mb-6`}>
                    {showTrendChart && (
                        <div className={showDistributionChart ? "lg:col-span-2" : "col-span-1"}>
                            <MonthlyTrendChart data={monthlyTrend} />
                        </div>
                    )}
                    {showDistributionChart && (
                        <div className="col-span-1">
                            <StatusDistributionChart data={statusDistribution} />
                        </div>
                    )}
                </div>
            )}

            {/* ── Tables ── */}
            <div className={`grid grid-cols-1 ${showLowStock ? 'lg:grid-cols-2' : ''} gap-6`}>
                <RecentRequests data={recentRequests} />
                {showLowStock && <LowStockAlerts data={lowStockItems} />}
            </div>
        </AuthenticatedLayout>
    );
}
