import { Head } from '@inertiajs/react';
import { Users, Package, Clock, BarChart3 } from 'lucide-react';
import { PageProps } from '../../Types';

interface DashboardProps extends PageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            roles?: Array<{ name: string }>;
        };
    };
}

export default function Dashboard({ auth }: DashboardProps) {
    const role = auth.user.roles?.[0]?.name || 'Unknown';

    return (
        <>
            <Head title="Dashboard" />
            <div className="min-h-screen bg-gray-100">
                {/* Header */}
                <div className="bg-white shadow">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                                <p className="text-gray-600 mt-1">Selamat datang, {auth.user.name}</p>
                            </div>
                            <div className="bg-blue-50 px-4 py-3 rounded-lg">
                                <p className="text-sm text-gray-600">Role</p>
                                <p className="text-lg font-semibold text-blue-600 capitalize">{role.replace(/_/g, ' ')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <StatCard 
                            title="Total Users" 
                            value="24" 
                            icon={Users}
                            color="blue"
                        />
                        <StatCard 
                            title="Inventaris" 
                            value="156" 
                            icon={Package}
                            color="green"
                        />
                        <StatCard 
                            title="Pengajuan Pending" 
                            value="5" 
                            icon={Clock}
                            color="yellow"
                        />
                        <StatCard 
                            title="Laporan" 
                            value="12" 
                            icon={BarChart3}
                            color="purple"
                        />
                    </div>

                    {/* Welcome Card */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Selamat Datang di SIMPATIK
                        </h2>
                        <p className="text-gray-700 mb-4">
                            SIMPATIK adalah sistem terintegrasi untuk manajemen permintaan ATK dan transaksi gudang di Bank Sumsel Babel.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FeatureCard 
                                title="Manajemen Inventaris"
                                description="Kelola data barang dan stok secara real-time"
                            />
                            <FeatureCard 
                                title="Pengajuan Barang"
                                description="Ajukan kebutuhan barang dengan mudah dan cepat"
                            />
                            <FeatureCard 
                                title="Laporan & Analitik"
                                description="Dapatkan insight mendalam tentang mutasi barang"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ComponentType<{ className?: string }>;
    color: 'blue' | 'green' | 'yellow' | 'purple';
}

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        yellow: 'bg-yellow-50 text-yellow-600',
        purple: 'bg-purple-50 text-purple-600',
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-600 text-sm">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
                </div>
                <div className={`${colorClasses[color]} p-3 rounded-lg`}>
                    <Icon className="w-8 h-8" />
                </div>
            </div>
        </div>
    );
}

interface FeatureCardProps {
    title: string;
    description: string;
}

function FeatureCard({ title, description }: FeatureCardProps) {
    return (
        <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    );
}
