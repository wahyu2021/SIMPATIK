import { CheckCircle } from 'lucide-react';
import { CompletedRecon } from '../../../Types/reconciliation';
import { formatNumber, formatDateLong } from '../../../Lib/formatters';
import DiffBadge from './DiffBadge';

interface Props {
    reconciliation: CompletedRecon;
}

/** Read-only view rekonsiliasi yang sudah selesai. */
/**
 * Komponen: CompletedReconciliation
 *
 * [State & Rendering]
 * Merupakan komponen presentasional atau kontainer dalam arsitektur React.
 * Lifecycle dikendalikan oleh Inertia (jika Page) atau parent props (jika Component).
 */
export default function CompletedReconciliation({ reconciliation }: Props) {
    const matchCount = reconciliation.details.filter(d => d.difference === 0).length;
    const totalDiff = reconciliation.details.reduce((s, d) => s + Math.abs(d.difference), 0);

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
                                <td className="px-4 py-2.5 text-right"><DiffBadge difference={d.difference} /></td>
                                <td className="px-4 py-2.5 text-gray-500 text-xs">{d.notes || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
