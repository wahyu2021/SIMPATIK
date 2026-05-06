import { Head, router, useForm, Link, usePage } from '@inertiajs/react';
import { CheckCircle, AlertTriangle, ClipboardCheck } from 'lucide-react';
import { PageProps } from '../../Types';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { PageHeader, Breadcrumbs, Combobox, Label, Alert } from '../../Components/UI';
import { ComboboxOption } from '../../Components/UI/Combobox';
import { formatNumber, formatDateLong } from '../../Lib/formatters';

interface ReconItem {
    item_id: number;
    name: string;
    item_code: string | null;
    unit: string;
    system_qty: number;
    physical_qty: number;
    difference: number;
    notes: string;
}

interface ReconDetail {
    id: number;
    item_id: number;
    system_qty: number;
    physical_qty: number;
    difference: number;
    notes: string | null;
    item: { id: number; name: string; item_code: string | null; unit_of_measure: string };
}

interface CompletedRecon {
    id: number;
    month: number;
    year: number;
    reconciliation_date: string;
    notes: string | null;
    creator: { id: number; name: string };
    details: ReconDetail[];
}

interface Props extends PageProps {
    reconData: {
        status: 'pending' | 'completed';
        items?: ReconItem[];
        reconciliation?: CompletedRecon;
    };
    filters: { month: number; year: number };
}

const MONTHS: ComboboxOption[] = [
    { value: '1', label: 'Januari' }, { value: '2', label: 'Februari' },
    { value: '3', label: 'Maret' }, { value: '4', label: 'April' },
    { value: '5', label: 'Mei' }, { value: '6', label: 'Juni' },
    { value: '7', label: 'Juli' }, { value: '8', label: 'Agustus' },
    { value: '9', label: 'September' }, { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' }, { value: '12', label: 'Desember' },
];

export default function Reconciliation({ reconData, filters }: Props) {
    const { flash } = usePage<PageProps>().props;

    const yearOptions: ComboboxOption[] = Array.from({ length: 5 }, (_, i) => {
        const y = new Date().getFullYear() - i;
        return { value: y.toString(), label: y.toString() };
    });

    const handleFilter = (key: string, value: string) => {
        router.get('/reports/reconciliation', {
            ...filters,
            [key]: value || undefined,
        }, { preserveState: true, preserveScroll: true });
    };

    return (
        <AuthenticatedLayout title="Rekonsiliasi">
            <Head title="Rekonsiliasi Bulanan" />

            <Breadcrumbs items={[
                { label: 'Laporan', href: '/reports' },
                { label: 'Rekonsiliasi' },
            ]} />

            <PageHeader
                title="Rekonsiliasi Bulanan"
                description="Cocokkan saldo sistem dengan stok fisik aktual"
            />

            {/* Tab Navigation */}
            <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
                <Link href="/reports" className="px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-white/60 transition-colors">
                    Saldistat ATK
                </Link>
                <Link href="/reports/stock-ledger" className="px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-white/60 transition-colors">
                    Kartu Mutasi
                </Link>
                <span className="px-4 py-2 text-sm font-medium text-white bg-[#003366] rounded-md shadow-sm">
                    Rekonsiliasi
                </span>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-wrap items-end gap-3">
                    <div className="w-36">
                        <Label htmlFor="month">Bulan</Label>
                        <Combobox id="month" options={MONTHS} value={filters.month.toString()} onChange={(v) => handleFilter('month', v)} placeholder="Bulan" />
                    </div>
                    <div className="w-28">
                        <Label htmlFor="year">Tahun</Label>
                        <Combobox id="year" options={yearOptions} value={filters.year.toString()} onChange={(v) => handleFilter('year', v)} placeholder="Tahun" />
                    </div>
                </div>
            </div>

            {flash?.success && <Alert type="success" className="mb-4">{flash.success}</Alert>}

            {reconData.status === 'completed' ? (
                <CompletedView reconciliation={reconData.reconciliation!} />
            ) : (
                <ReconciliationForm items={reconData.items!} filters={filters} />
            )}
        </AuthenticatedLayout>
    );
}

// ── Completed View ──
function CompletedView({ reconciliation }: { reconciliation: CompletedRecon }) {
    const totalDiff = reconciliation.details.reduce((s, d) => s + Math.abs(d.difference), 0);
    const matchCount = reconciliation.details.filter(d => d.difference === 0).length;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-green-50 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                    <p className="font-semibold text-green-800">Rekonsiliasi Sudah Dilakukan</p>
                    <p className="text-sm text-green-600">
                        Oleh {reconciliation.creator.name} pada {formatDateLong(reconciliation.reconciliation_date)}
                        {' · '}{matchCount}/{reconciliation.details.length} item cocok
                        {totalDiff > 0 && ` · ${totalDiff} selisih total`}
                    </p>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-4 py-3 text-left font-semibold text-gray-600 w-12">#</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Barang</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-600">Sistem</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-600">Fisik</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-600">Selisih</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Catatan</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {reconciliation.details.map((d, idx) => (
                            <tr key={d.id} className={d.difference !== 0 ? 'bg-amber-50/50' : ''}>
                                <td className="px-4 py-2.5 text-gray-400 text-xs">{idx + 1}</td>
                                <td className="px-4 py-2.5">
                                    <span className="font-medium text-gray-900">{d.item.name}</span>
                                    {d.item.item_code && <span className="text-gray-400 text-xs ml-2">{d.item.item_code}</span>}
                                </td>
                                <td className="px-4 py-2.5 text-right text-gray-700">{formatNumber(d.system_qty)}</td>
                                <td className="px-4 py-2.5 text-right text-gray-700">{formatNumber(d.physical_qty)}</td>
                                <td className={`px-4 py-2.5 text-right font-bold ${d.difference === 0 ? 'text-green-600' : d.difference > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                    {d.difference === 0 ? '✓' : (d.difference > 0 ? '+' : '') + formatNumber(d.difference)}
                                </td>
                                <td className="px-4 py-2.5 text-gray-500 text-xs">{d.notes || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ── Form View ──
function ReconciliationForm({ items, filters }: { items: ReconItem[]; filters: { month: number; year: number } }) {
    const { data, setData, post, processing } = useForm({
        month: filters.month,
        year: filters.year,
        notes: '',
        details: items.map(i => ({
            item_id: i.item_id,
            system_qty: i.system_qty,
            physical_qty: i.physical_qty,
            notes: '',
        })),
    });

    const updateDetail = (idx: number, physicalQty: number) => {
        const updated = [...data.details];
        updated[idx] = { ...updated[idx], physical_qty: physicalQty };
        setData('details', updated);
    };

    const updateDetailNotes = (idx: number, notes: string) => {
        const updated = [...data.details];
        updated[idx] = { ...updated[idx], notes };
        setData('details', updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/reports/reconciliation');
    };

    const diffCount = data.details.filter((d, i) => d.physical_qty !== items[i].system_qty).length;

    return (
        <form onSubmit={handleSubmit}>
            {diffCount > 0 && (
                <div className="flex items-center gap-2 px-4 py-3 mb-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span><strong>{diffCount} item</strong> memiliki selisih stok. Periksa sebelum menyimpan.</span>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-4">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-4 py-3 text-left font-semibold text-gray-600 w-12">#</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-600">Barang</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-600 w-20">Satuan</th>
                                <th className="px-4 py-3 text-right font-semibold text-gray-600 w-24">Sistem</th>
                                <th className="px-4 py-3 text-center font-semibold text-gray-600 w-32">Fisik</th>
                                <th className="px-4 py-3 text-right font-semibold text-gray-600 w-24">Selisih</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-600 w-40">Catatan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {items.map((item, idx) => {
                                const diff = data.details[idx].physical_qty - item.system_qty;
                                return (
                                    <tr key={item.item_id} className={diff !== 0 ? 'bg-amber-50/50' : ''}>
                                        <td className="px-4 py-2 text-gray-400 text-xs">{idx + 1}</td>
                                        <td className="px-4 py-2">
                                            <span className="font-medium text-gray-900">{item.name}</span>
                                            {item.item_code && <span className="text-gray-400 text-xs ml-2">{item.item_code}</span>}
                                        </td>
                                        <td className="px-4 py-2 text-gray-500 text-xs">{item.unit}</td>
                                        <td className="px-4 py-2 text-right text-gray-700 font-mono">{formatNumber(item.system_qty)}</td>
                                        <td className="px-4 py-2 text-center">
                                            <input
                                                type="number"
                                                min={0}
                                                value={data.details[idx].physical_qty}
                                                onChange={(e) => updateDetail(idx, parseInt(e.target.value) || 0)}
                                                className="w-24 text-right text-sm border border-gray-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </td>
                                        <td className={`px-4 py-2 text-right font-bold ${diff === 0 ? 'text-green-600' : diff > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                            {diff === 0 ? '✓' : (diff > 0 ? '+' : '') + formatNumber(diff)}
                                        </td>
                                        <td className="px-4 py-2">
                                            {diff !== 0 && (
                                                <input
                                                    type="text"
                                                    placeholder="Alasan..."
                                                    value={data.details[idx].notes}
                                                    onChange={(e) => updateDetailNotes(idx, e.target.value)}
                                                    className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Notes + Submit */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-wrap items-end gap-4">
                <div className="flex-1 min-w-[200px]">
                    <Label htmlFor="notes">Catatan Umum</Label>
                    <input
                        id="notes"
                        type="text"
                        value={data.notes}
                        onChange={(e) => setData('notes', e.target.value)}
                        placeholder="Opsional — catatan rekonsiliasi bulan ini"
                        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#003366] rounded-xl hover:bg-[#002855] transition-all disabled:opacity-50"
                >
                    <ClipboardCheck className="w-4 h-4" />
                    {processing ? 'Menyimpan...' : 'Simpan Rekonsiliasi'}
                </button>
            </div>
        </form>
    );
}
