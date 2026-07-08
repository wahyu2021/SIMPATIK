import { Head, router } from '@inertiajs/react';
import { Building2, Package, Search, FileSpreadsheet, FileText } from 'lucide-react';
import { PageProps, Department } from '../../Types';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { PageHeader, Breadcrumbs, Combobox, Label, StatCard, Button } from '../../Components/UI';
import { formatNumber } from '../../Lib/formatters';
import { MONTH_OPTIONS, getYearOptions } from '../../Lib/constants';
import ReportTabs from '../../Components/Features/Reports/ReportTabs';

interface ReportItem {
    id: number;
    name: string;
    item_code: string;
    unit_of_measure: string;
    total_qty: number;
}

interface Props extends PageProps {
    reportData: {
        items: ReportItem[];
        period: {
            month: number;
            year: number;
            label: string;
        };
    };
    departments: Department[];
    filters: {
        month: number;
        year: number;
        department_id: number | null;
    };
}

/**
 * Halaman Laporan Penggunaan Barang per Unit Kerja.
 */
/**
 * Komponen: Department
 *
 * [State & Rendering]
 * Merupakan komponen presentasional atau kontainer dalam arsitektur React.
 * Lifecycle dikendalikan oleh Inertia (jika Page) atau parent props (jika Component).
 */
export default function DepartmentReport({ reportData, departments, filters }: Props) {
    const { items } = reportData;

    const deptOptions = [
        { value: '', label: '— Pilih Unit Kerja —' },
        ...departments.map(d => ({ value: d.id.toString(), label: d.name }))
    ];

    const handleFilter = (key: string, value: string) => {
        router.get('/reports/department', { ...filters, [key]: value || undefined }, 
            { preserveState: true, preserveScroll: true });
    };

    const totalVolume = items.reduce((s, item) => s + Number(item.total_qty || 0), 0);

    return (
        <AuthenticatedLayout title="Laporan Unit Kerja">
            <Head title="Laporan Penggunaan per Unit" />
            
            <Breadcrumbs items={[{ label: 'Laporan' }, { label: 'Laporan Unit Kerja' }]} />

            <PageHeader 
                title="Laporan Penggunaan per Unit" 
                description="Rincian barang yang dikeluarkan untuk unit kerja tertentu"
            />

            <ReportTabs active="department" />

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
                <div className="flex flex-wrap items-end gap-4">
                    <div className="w-full sm:w-64">
                        <Label htmlFor="dept">Unit Kerja</Label>
                        <Combobox 
                            id="dept" 
                            options={deptOptions} 
                            value={filters.department_id?.toString() || ''} 
                            onChange={(v) => handleFilter('department_id', v)} 
                            placeholder="Pilih unit..." 
                        />
                    </div>
                    <div className="w-36">
                        <Label htmlFor="month">Bulan</Label>
                        <Combobox id="month" options={MONTH_OPTIONS} value={filters.month.toString()} onChange={(v) => handleFilter('month', v)} />
                    </div>
                    <div className="w-32">
                        <Label htmlFor="year">Tahun</Label>
                        <Combobox id="year" options={getYearOptions()} value={filters.year.toString()} onChange={(v) => handleFilter('year', v)} />
                    </div>

                    <div className="ml-auto flex gap-2">
                        {filters.department_id ? (
                            <>
                                <a 
                                    href={route('reports.export.department.excel', { month: filters.month, year: filters.year, department_id: filters.department_id })}
                                    target="_blank"
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                                >
                                    <FileSpreadsheet className="w-4 h-4 mr-1.5" /> Excel
                                </a>
                                <a 
                                    href={route('reports.export.department', { month: filters.month, year: filters.year, department_id: filters.department_id })}
                                    target="_blank"
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                                >
                                    <FileText className="w-4 h-4 mr-1.5" /> PDF
                                </a>
                            </>
                        ) : (
                            <>
                                <Button variant="secondary" size="sm" className="bg-green-50 text-green-700 border-green-200 opacity-50 cursor-not-allowed">
                                    <FileSpreadsheet className="w-4 h-4 mr-1.5" /> Excel
                                </Button>
                                <Button variant="secondary" size="sm" className="bg-red-50 text-red-700 border-red-200 opacity-50 cursor-not-allowed">
                                    <FileText className="w-4 h-4 mr-1.5" /> PDF
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {filters.department_id ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <StatCard 
                            title="Total Jenis Barang" 
                            value={items.length} 
                            icon={<Package className="w-6 h-6" />} 
                            color="blue" 
                        />
                        <StatCard 
                            title="Total Volume Keluar" 
                            value={formatNumber(totalVolume)} 
                            icon={<Building2 className="w-6 h-6" />} 
                            color="purple" 
                        />
                        <div className="bg-blue-600 rounded-2xl p-5 text-white shadow-lg shadow-blue-200 flex flex-col justify-center">
                            <p className="text-blue-100 text-xs font-medium uppercase tracking-wider">Unit Kerja</p>
                            <h3 className="text-lg font-bold truncate mt-1">
                                {departments.find(d => d.id === filters.department_id)?.name}
                            </h3>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold">
                                        <th className="px-6 py-4 text-center w-16">NO</th>
                                        <th className="px-6 py-4 text-left w-32">KODE</th>
                                        <th className="px-6 py-4 text-left">NAMA BARANG</th>
                                        <th className="px-6 py-4 text-center w-32">SATUAN</th>
                                        <th className="px-6 py-4 text-right w-40">JUMLAH DIAMBIL</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {items.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                                <div className="flex flex-col items-center">
                                                    <Search className="w-10 h-10 mb-2 opacity-20" />
                                                    <p>Tidak ada pengeluaran barang untuk unit ini pada periode tersebut.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        items.map((item, idx) => (
                                            <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 text-center text-gray-500">{idx + 1}</td>
                                                <td className="px-6 py-4 font-mono text-xs text-gray-600">{item.item_code}</td>
                                                <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                                                <td className="px-6 py-4 text-center text-gray-500">{item.unit_of_measure}</td>
                                                <td className="px-6 py-4 text-right font-bold text-blue-700 font-mono">
                                                    {formatNumber(item.total_qty)}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                                {items.length > 0 && (
                                    <tfoot>
                                        <tr className="bg-gray-50 font-bold border-t border-gray-200">
                                            <td colSpan={4} className="px-6 py-4 text-right text-gray-700">TOTAL VOLUME PENGGUNAAN</td>
                                            <td className="px-6 py-4 text-right text-blue-800 font-mono">{formatNumber(totalVolume)}</td>
                                        </tr>
                                    </tfoot>
                                )}
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-20 text-center">
                    <Building2 className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-400">Pilih Unit Kerja</h3>
                    <p className="text-gray-400 max-w-xs mx-auto mt-1 text-sm">
                        Silakan pilih unit kerja pada filter di atas untuk melihat rincian penggunaan barang.
                    </p>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
