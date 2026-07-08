import { useForm } from '@inertiajs/react';
import { AlertTriangle, ClipboardCheck } from 'lucide-react';
import { ReconItem, ReconFilters } from '../../../Types/reconciliation';
import { Label } from '../../UI';
import { formatNumber } from '../../../Lib/formatters';
import DiffBadge from './DiffBadge';

interface Props {
    items: ReconItem[];
    filters: ReconFilters;
}

/** Form input stok fisik untuk rekonsiliasi yang belum dilakukan. */
/**
 * Komponen: ReconciliationForm
 *
 * [State & Rendering]
 * Merupakan komponen presentasional atau kontainer dalam arsitektur React.
 * Lifecycle dikendalikan oleh Inertia (jika Page) atau parent props (jika Component).
 */
export default function ReconciliationForm({ items, filters }: Props) {
    const { data, setData, post, processing, errors } = useForm({
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

    const updateDetail = (idx: number, field: 'physical_qty' | 'notes', value: number | string) => {
        const updated = [...data.details];
        updated[idx] = { ...updated[idx], [field]: value };
        setData('details', updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Frontend validation: Check if there's any difference without notes
        const hasMissingNotes = data.details.some((d, i) => {
            return d.physical_qty !== items[i].system_qty && !d.notes.trim();
        });

        if (hasMissingNotes) {
            alert('Ada barang yang berselisih stok namun belum diberi keterangan/alasan. Mohon lengkapi terlebih dahulu.');
            return;
        }

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
                                            <input type="number" min={0} value={data.details[idx].physical_qty}
                                                onChange={(e) => updateDetail(idx, 'physical_qty', parseInt(e.target.value) || 0)}
                                                className="w-24 text-right text-sm border border-gray-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                        </td>
                                        <td className="px-4 py-2 text-right"><DiffBadge difference={diff} /></td>
                                        <td className="px-4 py-2">
                                            {diff !== 0 && (
                                                <div className="flex flex-col gap-1">
                                                    <input type="text" placeholder="Wajib isi alasan selisih..." value={data.details[idx].notes}
                                                        onChange={(e) => updateDetail(idx, 'notes', e.target.value)}
                                                        className={`w-full text-xs border rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                            errors[`details.${idx}.notes`] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                                        }`} />
                                                    {errors[`details.${idx}.notes`] && <span className="text-[10px] text-red-500 font-medium">{errors[`details.${idx}.notes`]}</span>}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-wrap items-end gap-4">
                <div className="flex-1 min-w-[200px]">
                    <Label htmlFor="notes">Catatan Umum</Label>
                    <input id="notes" type="text" value={data.notes} onChange={(e) => setData('notes', e.target.value)}
                        placeholder="Opsional — catatan rekonsiliasi bulan ini"
                        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <button type="submit" disabled={processing}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#003366] rounded-xl hover:bg-[#002855] transition-all disabled:opacity-50">
                    <ClipboardCheck className="w-4 h-4" />
                    {processing ? 'Menyimpan...' : 'Simpan Rekonsiliasi'}
                </button>
            </div>
        </form>
    );
}
