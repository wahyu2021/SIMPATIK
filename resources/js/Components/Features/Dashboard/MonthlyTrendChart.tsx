import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { MonthlyTrend } from '../../../Types/dashboard';

interface Props {
    data: MonthlyTrend[];
}

/** Bar chart — tren barang masuk vs keluar per bulan (6 bulan terakhir). */
export default function MonthlyTrendChart({ data }: Props) {
    if (!data || data.length === 0) {
        return (
            <div className="text-center text-sm text-gray-400 py-12">
                Belum ada data transaksi untuk ditampilkan.
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Tren Transaksi</h3>
            <p className="text-xs text-gray-500 mb-5">Barang masuk vs keluar — 6 bulan terakhir</p>

            <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data} barGap={4} barCategoryGap="25%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        axisLine={{ stroke: '#e5e7eb' }}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        axisLine={false}
                        tickLine={false}
                        allowDecimals={false}
                    />
                    <Tooltip
                        contentStyle={{
                            borderRadius: '12px',
                            border: '1px solid #e5e7eb',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            fontSize: '13px',
                        }}
                    />
                    <Legend
                        wrapperStyle={{ fontSize: '13px', paddingTop: '12px' }}
                        iconType="circle"
                        iconSize={8}
                    />
                    <Bar
                        dataKey="inbound"
                        name="Barang Masuk"
                        fill="#3b82f6"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={40}
                    />
                    <Bar
                        dataKey="outbound"
                        name="Barang Keluar"
                        fill="#f97316"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={40}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
