import { AlertTriangle } from 'lucide-react';
import { OutboundTransactionDetail, OutboundStatus } from '../../../Types';
import { Badge } from '../../UI';
import { formatNumber } from '../../../Lib/formatters';
import { isStockInsufficient, shouldShowStockColumn } from '../../../Lib/outbound';

interface OutboundDetailTableProps {
    details: OutboundTransactionDetail[];
    /** Menentukan apakah kolom stok ditampilkan (hanya Pending & Approved). */
    status?: OutboundStatus;
}

/** Tabel detail barang pengajuan dengan kolom stok kontekstual dan warning kekurangan stok. */
/**
 * Komponen: OutboundDetailTable
 *
 * [State & Rendering]
 * Merupakan komponen presentasional atau kontainer dalam arsitektur React.
 * Lifecycle dikendalikan oleh Inertia (jika Page) atau parent props (jika Component).
 */
export default function OutboundDetailTable({ details, status }: OutboundDetailTableProps) {
    const showStock = shouldShowStockColumn(status);
    const hasInsufficientStock = showStock && details.some(isStockInsufficient);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                    Detail Barang
                    <Badge variant="info" className="ml-2">{details.length} item</Badge>
                </h2>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-12">No</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kode</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama Barang</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Diminta</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Disetujui</th>
                            {showStock && (
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Stok Saat Ini</th>
                            )}
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Catatan</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {details.map((detail, index) => {
                            const insufficient = showStock && isStockInsufficient(detail);

                            return (
                                <tr key={detail.id} className={`hover:bg-blue-50/50 transition-colors ${insufficient ? 'bg-amber-50/50' : ''}`}>
                                    <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
                                    <td className="px-6 py-4 text-sm font-mono text-gray-500">
                                        {detail.item?.item_code ?? '-'}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        {detail.item?.name ?? '-'}
                                        <span className="text-gray-400 ml-1">({detail.item?.unit_of_measure})</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">
                                        {formatNumber(detail.quantity_requested)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-right font-medium">
                                        <span className={detail.quantity_approved > 0 ? 'text-green-600' : 'text-gray-400'}>
                                            {detail.quantity_approved > 0 ? formatNumber(detail.quantity_approved) : '-'}
                                        </span>
                                    </td>
                                    {showStock && (
                                        <td className="px-6 py-4 text-sm text-right font-medium">
                                            <span className={`inline-flex items-center gap-1 ${insufficient ? 'text-amber-600' : 'text-gray-600'}`}>
                                                {insufficient && <AlertTriangle className="w-3.5 h-3.5" />}
                                                {detail.item ? formatNumber(detail.item.current_stock) : '-'}
                                            </span>
                                        </td>
                                    )}
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {detail.notes || '-'}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {hasInsufficientStock && (
                <div className="px-6 py-3 bg-amber-50 border-t border-amber-200">
                    <div className="flex items-center gap-2 text-sm text-amber-700">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                        <span>Beberapa item melebihi stok tersedia. Pengeluaran barang bisa gagal jika stok tidak ditambah.</span>
                    </div>
                </div>
            )}
        </div>
    );
}
