import { Link } from '@inertiajs/react';
import { Eye, Trash2 } from 'lucide-react';
import { OutboundTransaction } from '../../../Types';
import { StatusBadge } from '../../UI';
import { formatDate } from '../../../Lib/formatters';

interface OutboundTableProps {
    outbounds: OutboundTransaction[];
    onDelete: (outbound: OutboundTransaction) => void;
}

/** Tabel pengajuan barang — dokumen, pemohon, unit kerja, tanggal, status, aksi. */
export default function OutboundTable({ outbounds, onDelete }: OutboundTableProps) {
    return (
        <table className="w-full">
            <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">No. Dokumen</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pemohon</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Unit Kerja</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {outbounds.length === 0 ? (
                    <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">
                            Tidak ada pengajuan ditemukan.
                        </td>
                    </tr>
                ) : (
                    outbounds.map((outbound) => {
                        const totalItems = outbound.details?.length ?? 0;
                        return (
                            <tr key={outbound.id} className="hover:bg-blue-50/50 transition-colors">
                                <td className="px-6 py-4 text-sm font-mono font-medium text-gray-900">
                                    {outbound.document_number}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700">
                                    {outbound.requester?.name ?? '-'}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700">
                                    {outbound.department?.name ?? '-'}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {formatDate(outbound.transaction_date)}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700">
                                    {totalItems} barang
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={outbound.status} />
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            href={`/outbound/${outbound.id}`}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0052A3] bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                        >
                                            <Eye className="w-3.5 h-3.5" />
                                            Detail
                                        </Link>
                                        {outbound.status === 'Pending' && (
                                            <button
                                                onClick={() => onDelete(outbound)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                                Batal
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })
                )}
            </tbody>
        </table>
    );
}
