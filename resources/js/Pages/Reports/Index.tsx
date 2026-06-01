import { Head, router, usePage } from '@inertiajs/react';
import { FileSpreadsheet, FileText, TrendingDown, TrendingUp, Archive, Package } from 'lucide-react';
import { PageProps, Category } from '../../Types';
import { MutationReportData, Signatory, MutationFilters } from '../../Types/mutation';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { PageHeader, Breadcrumbs, StatCard, Combobox, Label } from '../../Components/UI';
import { formatNumber } from '../../Lib/formatters';
import { MONTH_OPTIONS, getYearOptions } from '../../Lib/constants';
import ReportTabs from '../../Components/Features/Reports/ReportTabs';
import MutationTable from '../../Components/Features/Reports/MutationTable';

interface Props extends PageProps {
    reportData: MutationReportData;
    signatory: Signatory;
    categories: Category[];
    filters: MutationFilters;
}

export default function ReportsIndex({ reportData, signatory, categories, filters }: Props) {
    const { auth } = usePage<PageProps>().props;
    const { summary, period } = reportData;

    const catOptions = [
        { value: '', label: 'Semua Kategori' },
        ...categories.map(c => ({ value: c.id.toString(), label: c.name })),
    ];

    const handleFilter = (key: string, value: string) => {
        router.get('/reports', { ...filters, [key]: value || undefined },
            { preserveState: true, preserveScroll: true });
    };

    return (
        <AuthenticatedLayout title="Rekapitulasi Mutasi">
            <Head title="Rekapitulasi Mutasi Barang" />
            <Breadcrumbs items={[{ label: 'Laporan' }, { label: 'Rekapitulasi Mutasi' }]} />
            <PageHeader title="Rekapitulasi Mutasi Barang" description={`Ringkasan pergerakan stok barang — ${period.label}`} />
            <ReportTabs active="mutation" />

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-wrap items-end gap-3">
                    <div className="w-40">
                        <Label htmlFor="month">Bulan</Label>
                        <Combobox id="month" options={MONTH_OPTIONS} value={filters.month.toString()} onChange={(v) => handleFilter('month', v)} placeholder="Bulan" />
                    </div>
                    <div className="w-36">
                        <Label htmlFor="year">Tahun</Label>
                        <Combobox id="year" options={getYearOptions()} value={filters.year.toString()} onChange={(v) => handleFilter('year', v)} placeholder="Tahun" />
                    </div>
                    <div className="w-44">
                        <Label htmlFor="category">Kategori</Label>
                        <Combobox id="category" options={catOptions} value={filters.category_id?.toString() || ''} onChange={(v) => handleFilter('category_id', v)} placeholder="Semua" />
                    </div>
                    <div className="ml-auto flex gap-2">
                        <a href={`/reports/export/excel?month=${filters.month}&year=${filters.year}&category_id=${filters.category_id || ''}`}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                            <FileSpreadsheet className="w-4 h-4" /> Excel
                        </a>
                        <a href={`/reports/export/pdf?month=${filters.month}&year=${filters.year}&category_id=${filters.category_id || ''}`}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
                            <FileText className="w-4 h-4" /> PDF
                        </a>
                    </div>
                </div>
            </div>

            {/* Summary Cards (Stok, bukan Uang) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6">
                <StatCard title="Stok Awal" value={formatNumber(summary.opening_qty)} icon={<Package className="w-6 h-6" />} color="blue" />
                <StatCard title="Barang Masuk" value={formatNumber(summary.inbound_qty)} icon={<TrendingUp className="w-6 h-6" />} color="green" />
                <StatCard title="Barang Keluar" value={formatNumber(summary.outbound_qty)} icon={<TrendingDown className="w-6 h-6" />} color="red" />
                <StatCard title="Stok Akhir" value={formatNumber(summary.closing_qty)} icon={<Archive className="w-6 h-6" />} color="purple" />
            </div>

            <MutationTable categories={reportData.categories} summary={summary} period={period} signatory={signatory} signerName={auth.user.name} filters={filters} />
        </AuthenticatedLayout>
    );
}
