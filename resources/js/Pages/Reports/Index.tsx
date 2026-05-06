import { Head, router, usePage, Link } from '@inertiajs/react';
import { FileSpreadsheet, FileText, TrendingDown, TrendingUp, Wallet, Archive } from 'lucide-react';
import { PageProps, Category } from '../../Types';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { PageHeader, Breadcrumbs, StatCard, Combobox, Label } from '../../Components/UI';
import { ComboboxOption } from '../../Components/UI/Combobox';
import { formatCurrency } from '../../Lib/formatters';
import SaldistatTable from '../../Components/Features/Reports/SaldistatTable';

interface SaldistatItem {
    no: number;
    item_id: number;
    name: string;
    unit: string;
    unit_price: number;
    opening_qty: number;
    opening_value: number;
    inbound_qty: number;
    inbound_value: number;
    outbound_qty: number;
    outbound_value: number;
    closing_qty: number;
    closing_value: number;
}

interface SaldistatCategory {
    id: number;
    name: string;
    items: SaldistatItem[];
    subtotal_opening: number;
    subtotal_inbound: number;
    subtotal_outbound: number;
    subtotal_closing: number;
}

interface SaldistatData {
    categories: SaldistatCategory[];
    summary: {
        opening_value: number;
        inbound_value: number;
        outbound_value: number;
        closing_value: number;
    };
    period: {
        month: number;
        year: number;
        label: string;
        prev_label: string;
        end_label: string;
    };
}

interface Props extends PageProps {
    saldistat: SaldistatData;
    signatory: { company_name: string; company_branch: string; company_address: string };
    categories: Category[];
    filters: { month: number; year: number; category_id: number | null };
}

const MONTHS: ComboboxOption[] = [
    { value: '1', label: 'Januari' }, { value: '2', label: 'Februari' },
    { value: '3', label: 'Maret' }, { value: '4', label: 'April' },
    { value: '5', label: 'Mei' }, { value: '6', label: 'Juni' },
    { value: '7', label: 'Juli' }, { value: '8', label: 'Agustus' },
    { value: '9', label: 'September' }, { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' }, { value: '12', label: 'Desember' },
];

export default function ReportsIndex({ saldistat, signatory, categories, filters }: Props) {
    const { auth } = usePage<PageProps>().props;

    const yearOptions: ComboboxOption[] = Array.from({ length: 5 }, (_, i) => {
        const y = new Date().getFullYear() - i;
        return { value: y.toString(), label: y.toString() };
    });

    const catOptions: ComboboxOption[] = [
        { value: '', label: 'Semua Kategori' },
        ...categories.map(c => ({ value: c.id.toString(), label: c.name })),
    ];

    const handleFilter = (key: string, value: string) => {
        router.get('/reports', {
            ...filters,
            [key]: value || undefined,
        }, { preserveState: true, preserveScroll: true });
    };

    const { summary, period } = saldistat;

    return (
        <AuthenticatedLayout title="Laporan">
            <Head title="Laporan Saldistat ATK" />

            <Breadcrumbs items={[{ label: 'Laporan' }]} />

            <PageHeader
                title="Laporan Saldistat ATK"
                description={`Saldo, penerimaan, dan pengeluaran barang — ${period.label}`}
            />

            {/* Tab Navigation */}
            <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
                <span className="px-4 py-2 text-sm font-medium text-white bg-[#003366] rounded-md shadow-sm">
                    Saldistat ATK
                </span>
                <Link href="/reports/stock-ledger" className="px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-white/60 transition-colors">
                    Kartu Mutasi
                </Link>
                <Link href="/reports/reconciliation" className="px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-white/60 transition-colors">
                    Rekonsiliasi
                </Link>
            </div>

            {/* ── Filters ── */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-wrap items-end gap-3">
                    <div className="w-36">
                        <Label htmlFor="month">Bulan</Label>
                        <Combobox
                            id="month"
                            options={MONTHS}
                            value={filters.month.toString()}
                            onChange={(v) => handleFilter('month', v)}
                            placeholder="Bulan"
                        />
                    </div>
                    <div className="w-28">
                        <Label htmlFor="year">Tahun</Label>
                        <Combobox
                            id="year"
                            options={yearOptions}
                            value={filters.year.toString()}
                            onChange={(v) => handleFilter('year', v)}
                            placeholder="Tahun"
                        />
                    </div>
                    <div className="w-44">
                        <Label htmlFor="category">Kategori</Label>
                        <Combobox
                            id="category"
                            options={catOptions}
                            value={filters.category_id?.toString() || ''}
                            onChange={(v) => handleFilter('category_id', v)}
                            placeholder="Semua"
                        />
                    </div>
                    <div className="ml-auto flex gap-2">
                        <a
                            href={`/reports/export/excel?month=${filters.month}&year=${filters.year}&category_id=${filters.category_id || ''}`}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                        >
                            <FileSpreadsheet className="w-4 h-4" />
                            Excel
                        </a>
                        <a
                            href={`/reports/export/pdf?month=${filters.month}&year=${filters.year}&category_id=${filters.category_id || ''}`}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                        >
                            <FileText className="w-4 h-4" />
                            PDF
                        </a>
                    </div>
                </div>
            </div>

            {/* ── Summary Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6">
                <StatCard
                    title="Saldo Awal"
                    value={formatCurrency(summary.opening_value)}
                    icon={<Wallet className="w-6 h-6" />}
                    color="blue"
                />
                <StatCard
                    title="Penerimaan"
                    value={formatCurrency(summary.inbound_value)}
                    icon={<TrendingUp className="w-6 h-6" />}
                    color="green"
                />
                <StatCard
                    title="Pengeluaran"
                    value={formatCurrency(summary.outbound_value)}
                    icon={<TrendingDown className="w-6 h-6" />}
                    color="red"
                />
                <StatCard
                    title="Saldo Akhir"
                    value={formatCurrency(summary.closing_value)}
                    icon={<Archive className="w-6 h-6" />}
                    color="purple"
                />
            </div>

            {/* ── Saldistat Table ── */}
            <SaldistatTable
                categories={saldistat.categories}
                summary={summary}
                period={period}
                signatory={signatory}
                signerName={auth.user.name}
                filters={filters}
            />
        </AuthenticatedLayout>
    );
}
