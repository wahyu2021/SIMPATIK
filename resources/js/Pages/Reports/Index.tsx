import { Head, router, usePage } from '@inertiajs/react';
import { FileSpreadsheet, FileText, TrendingDown, TrendingUp, Wallet, Archive } from 'lucide-react';
import { PageProps, Category } from '../../Types';
import { SaldistatData, Signatory, SaldistatFilters } from '../../Types/saldistat';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { PageHeader, Breadcrumbs, StatCard, Combobox, Label } from '../../Components/UI';
import { formatCurrency } from '../../Lib/formatters';
import { MONTH_OPTIONS, getYearOptions } from '../../Lib/constants';
import ReportTabs from '../../Components/Features/Reports/ReportTabs';
import SaldistatTable from '../../Components/Features/Reports/SaldistatTable';

interface Props extends PageProps {
    saldistat: SaldistatData;
    signatory: Signatory;
    categories: Category[];
    filters: SaldistatFilters;
}

export default function ReportsIndex({ saldistat, signatory, categories, filters }: Props) {
    const { auth } = usePage<PageProps>().props;
    const { summary, period } = saldistat;

    const catOptions = [
        { value: '', label: 'Semua Kategori' },
        ...categories.map(c => ({ value: c.id.toString(), label: c.name })),
    ];

    const handleFilter = (key: string, value: string) => {
        router.get('/reports', { ...filters, [key]: value || undefined },
            { preserveState: true, preserveScroll: true });
    };

    return (
        <AuthenticatedLayout title="Laporan">
            <Head title="Laporan Saldistat ATK" />
            <Breadcrumbs items={[{ label: 'Laporan' }]} />
            <PageHeader title="Laporan Saldistat ATK" description={`Saldo, penerimaan, dan pengeluaran barang — ${period.label}`} />
            <ReportTabs active="saldistat" />

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

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6">
                <StatCard title="Saldo Awal" value={formatCurrency(summary.opening_value)} icon={<Wallet className="w-6 h-6" />} color="blue" />
                <StatCard title="Penerimaan" value={formatCurrency(summary.inbound_value)} icon={<TrendingUp className="w-6 h-6" />} color="green" />
                <StatCard title="Pengeluaran" value={formatCurrency(summary.outbound_value)} icon={<TrendingDown className="w-6 h-6" />} color="red" />
                <StatCard title="Saldo Akhir" value={formatCurrency(summary.closing_value)} icon={<Archive className="w-6 h-6" />} color="purple" />
            </div>

            <SaldistatTable categories={saldistat.categories} summary={summary} period={period} signatory={signatory} signerName={auth.user.name} filters={filters} />
        </AuthenticatedLayout>
    );
}
