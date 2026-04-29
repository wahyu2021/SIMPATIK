import { OutboundTransactionDetail } from '../../../Types';
import { Badge } from '../../UI';
import { formatNumber } from '../../../Lib/formatters';

interface OutboundDetailTableProps {
    details: OutboundTransactionDetail[];
}

/** Tabel detail barang pengajuan — kode, nama, jumlah diminta vs disetujui, catatan. */
export default function OutboundDetailTable({ details }: OutboundDetailTableProps) {
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
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Catatan</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {details.map((detail, index) => (
                            <tr key={detail.id} className="hover:bg-blue-50/50 transition-colors">
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
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {detail.notes || '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
