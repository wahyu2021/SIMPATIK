/**
 * Props untuk komponen StatCard.
 * @property title - Label statistik (misal "Total Barang")
 * @property value - Angka/nilai utama yang ditampilkan besar
 * @property icon - Icon ReactNode (gunakan dari lucide-react)
 * @property trend - Indikator tren: { value: '+12 bulan ini', type: 'up' | 'down' | 'neutral' }
 * @property color - Warna aksen icon: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
 */
interface StatCardProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    trend?: {
        value: string;
        type: 'up' | 'down' | 'neutral';
    };
    color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
    className?: string;
}

/**
 * Komponen StatCard — widget statistik untuk halaman Dashboard.
 *
 * @example
 * import { Package } from 'lucide-react';
 * <StatCard title="Total Barang" value={156} icon={<Package />} color="blue" />
 */
export default function StatCard({ title, value, icon, trend, color = 'blue', className = '' }: StatCardProps) {
    const colors = {
        blue: 'bg-blue-50 text-[#0052A3]',
        green: 'bg-emerald-50 text-emerald-600',
        yellow: 'bg-amber-50 text-amber-600',
        red: 'bg-red-50 text-red-600',
        purple: 'bg-purple-50 text-purple-600',
    };

    const trendColors = {
        up: 'text-emerald-600',
        down: 'text-red-600',
        neutral: 'text-gray-500',
    };

    const trendIcons = {
        up: '↑',
        down: '↓',
        neutral: '→',
    };

    return (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow ${className}`}>
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                    {trend && (
                        <p className={`text-xs font-medium mt-1 ${trendColors[trend.type]}`}>
                            {trendIcons[trend.type]} {trend.value}
                        </p>
                    )}
                </div>
                {icon && (
                    <div className={`p-3 rounded-lg ${colors[color]}`}>
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
}
