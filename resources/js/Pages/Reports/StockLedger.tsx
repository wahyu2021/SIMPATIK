import { Head, router, Link } from '@inertiajs/react';
import { BookOpen, ArrowDownCircle, ArrowUpCircle, RefreshCw } from 'lucide-react';
import { PageProps } from '../../Types';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { PageHeader, Breadcrumbs, Combobox, Label } from '../../Components/UI';
import { ComboboxOption } from '../../Components/UI/Combobox';
import { formatDate, formatNumber } from '../../Lib/formatters';

interface LedgerEntry {
    id: number;
    date: string;
    type: 'in' | 'out' | 'adjustment';
    reference: string;
    qty_in: number;
    qty_out: number;
    balance: number;
}

interface ItemOption {
    id: number;
    name: string;
    item_code: string | null;
    unit_of_measure: string;
}

interface Props extends PageProps {
    entries: LedgerEntry[];
    items: ItemOption[];
    filters: {
        item_id: number | null;
        month: number | null;
        year: number | null;
        movement_type: string | null;
    };
}

const MONTHS: ComboboxOption[] = [
    { value: '', label: 'Semua Bulan' },
    { value: '1', label: 'Januari' }, { value: '2', label: 'Februari' },
    { value: '3', label: 'Maret' }, { value: '4', label: 'April' },
    { value: '5', label: 'Mei' }, { value: '6', label: 'Juni' },
    { value: '7', label: 'Juli' }, { value: '8', label: 'Agustus' },
    { value: '9', label: 'September' }, { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' }, { value: '12', label: 'Desember' },
];

const MOVEMENT_TYPES: ComboboxOption[] = [
    { value: '', label: 'Semua Tipe' },
    { value: 'in', label: 'Masuk' },
    { value: 'out', label: 'Keluar' },
    { value: 'adjustment', label: 'Penyesuaian' },
];

const TYPE_CONFIG = {
    in: { label: 'Masuk', color: 'text-green-700 bg-green-50', icon: ArrowDownCircle },
    out: { label: 'Keluar', color: 'text-red-700 bg-red-50', icon: ArrowUpCircle },
    adjustment: { label: 'Penyesuaian', color: 'text-blue-700 bg-blue-50', icon: RefreshCw },
};

export default function StockLedger({ entries, items, filters }: Props) {
    const yearOptions: ComboboxOption[] = [
        { value: '', label: 'Semua Tahun' },
        ...Array.from({ length: 5 }, (_, i) => {
            const y = new Date().getFullYear() - i;
            return { value: y.toString(), label: y.toString() };
        }),
    ];

    const itemOptions: ComboboxOption[] = [
        { value: '', label: 'Pilih Barang...' },
        ...items.map(i => ({
            value: i.id.toString(),
            label: i.item_code ? `${i.item_code} — ${i.name}` : i.name,
        })),
    ];

    const selectedItem = items.find(i => i.id === filters.item_id);

    const handleFilter = (key: string, value: string) => {
        router.get('/reports/stock-ledger', {
            ...filters,
            [key]: value || undefined,
        }, { preserveState: true, preserveScroll: true });
    };

    // Hitung summary
    const totalIn = entries.reduce((s, e) => s + e.qty_in, 0);
    const totalOut = entries.reduce((s, e) => s + e.qty_out, 0);
    const lastBalance = entries.length > 0 ? entries[entries.length - 1].balance : 0;

    return (
        <AuthenticatedLayout title="Kartu Mutasi Stok">
            <Head title="Kartu Mutasi Stok" />

            <Breadcrumbs items={[
                { label: 'Laporan', href: '/reports' },
                { label: 'Kartu Mutasi Stok' },
            ]} />

            <PageHeader
                title="Kartu Mutasi Stok"
                description="Riwayat pergerakan stok per barang"
            />

            {/* Tab Navigation */}
            <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
                <Link href="/reports" className="px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-white/60 transition-colors">
                    Saldistat ATK
                </Link>
                <span className="px-4 py-2 text-sm font-medium text-white bg-[#003366] rounded-md shadow-sm">
                    Kartu Mutasi
                </span>
                <Link href="/reports/reconciliation" className="px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-white/60 transition-colors">
                    Rekonsiliasi
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-wrap items-end gap-3">
                    <div className="w-64">
                        <Label htmlFor="item">Barang</Label>
                        <Combobox
                            id="item"
                            options={itemOptions}
                            value={filters.item_id?.toString() || ''}
                            onChange={(v) => handleFilter('item_id', v)}
                            placeholder="Pilih barang..."
                        />
                    </div>
                    <div className="w-36">
                        <Label htmlFor="month">Bulan</Label>
                        <Combobox
                            id="month"
                            options={MONTHS}
                            value={filters.month?.toString() || ''}
                            onChange={(v) => handleFilter('month', v)}
                            placeholder="Semua"
                        />
                    </div>
                    <div className="w-28">
                        <Label htmlFor="year">Tahun</Label>
                        <Combobox
                            id="year"
                            options={yearOptions}
                            value={filters.year?.toString() || ''}
                            onChange={(v) => handleFilter('year', v)}
                            placeholder="Semua"
                        />
                    </div>
                    <div className="w-36">
                        <Label htmlFor="type">Tipe</Label>
                        <Combobox
                            id="type"
                            options={MOVEMENT_TYPES}
                            value={filters.movement_type || ''}
                            onChange={(v) => handleFilter('movement_type', v)}
                            placeholder="Semua"
                        />
                    </div>
                </div>
            </div>

            {/* Content */}
            {!filters.item_id ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">Pilih barang untuk melihat kartu mutasi stok</p>
                </div>
            ) : (
                <>
                    {/* Item Info + Summary */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{selectedItem?.name}</h3>
                                <p className="text-sm text-gray-500">
                                    {selectedItem?.item_code && <span className="font-mono mr-2">{selectedItem.item_code}</span>}
                                    Satuan: {selectedItem?.unit_of_measure}
                                </p>
                            </div>
                            <div className="flex gap-6 text-sm">
                                <div className="text-center">
                                    <p className="text-green-600 font-bold text-lg">{formatNumber(totalIn)}</p>
                                    <p className="text-gray-400">Total Masuk</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-red-600 font-bold text-lg">{formatNumber(totalOut)}</p>
                                    <p className="text-gray-400">Total Keluar</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[#003366] font-bold text-lg">{formatNumber(lastBalance)}</p>
                                    <p className="text-gray-400">Saldo Akhir</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ledger Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="px-4 py-3 text-left font-semibold text-gray-600 w-12">#</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-600">Tanggal</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-600">Tipe</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-600">Referensi</th>
                                        <th className="px-4 py-3 text-right font-semibold text-green-700">Masuk</th>
                                        <th className="px-4 py-3 text-right font-semibold text-red-700">Keluar</th>
                                        <th className="px-4 py-3 text-right font-semibold text-gray-600">Saldo</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {entries.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                                                Tidak ada data mutasi untuk periode ini
                                            </td>
                                        </tr>
                                    ) : entries.map((entry, idx) => {
                                        const config = TYPE_CONFIG[entry.type];
                                        const Icon = config.icon;
                                        return (
                                            <tr key={entry.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-4 py-2.5 text-gray-400 text-xs">{idx + 1}</td>
                                                <td className="px-4 py-2.5 text-gray-700">{formatDate(entry.date)}</td>
                                                <td className="px-4 py-2.5">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${config.color}`}>
                                                        <Icon className="w-3 h-3" />
                                                        {config.label}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2.5 font-mono text-xs text-gray-600">{entry.reference}</td>
                                                <td className="px-4 py-2.5 text-right text-green-700 font-medium">
                                                    {entry.qty_in > 0 ? `+${formatNumber(entry.qty_in)}` : '-'}
                                                </td>
                                                <td className="px-4 py-2.5 text-right text-red-700 font-medium">
                                                    {entry.qty_out > 0 ? `-${formatNumber(entry.qty_out)}` : '-'}
                                                </td>
                                                <td className="px-4 py-2.5 text-right font-bold text-gray-900">
                                                    {formatNumber(entry.balance)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </AuthenticatedLayout>
    );
}
