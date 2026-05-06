import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { StatusDistribution } from '../../../Types/dashboard';

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
    Pending:  { label: 'Menunggu',  color: '#f59e0b' },
    Approved: { label: 'Disetujui', color: '#3b82f6' },
    Issued:   { label: 'Diserahkan', color: '#10b981' },
    Rejected: { label: 'Ditolak',   color: '#ef4444' },
};

interface Props {
    data: StatusDistribution[];
}

/** Donut chart — distribusi status pengajuan barang. */
export default function StatusDistributionChart({ data }: Props) {
    if (!data || data.length === 0) {
        return (
            <div className="text-center text-sm text-gray-400 py-12">
                Belum ada data pengajuan.
            </div>
        );
    }

    const chartData = data.map((d) => ({
        name: STATUS_CONFIG[d.status]?.label || d.status,
        value: d.count,
        color: STATUS_CONFIG[d.status]?.color || '#9ca3af',
    }));

    const total = chartData.reduce((sum, d) => sum + d.value, 0);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Status Pengajuan</h3>
            <p className="text-xs text-gray-500 mb-5">Distribusi seluruh pengajuan barang</p>

            <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={100}
                        paddingAngle={3}
                        dataKey="value"
                        strokeWidth={0}
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value) => [`${value} pengajuan`, '']}
                        contentStyle={{
                            borderRadius: '12px',
                            border: '1px solid #e5e7eb',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            fontSize: '13px',
                        }}
                    />
                    <Legend
                        wrapperStyle={{ fontSize: '13px', paddingTop: '8px' }}
                        iconType="circle"
                        iconSize={8}
                    />
                    {/* Center label */}
                    <text x="50%" y="47%" textAnchor="middle" className="fill-gray-900 text-2xl font-bold">
                        {total}
                    </text>
                    <text x="50%" y="56%" textAnchor="middle" className="fill-gray-400 text-xs">
                        Total
                    </text>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
