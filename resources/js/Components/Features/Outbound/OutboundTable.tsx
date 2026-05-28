import { Link } from '@inertiajs/react';
import { Eye, Trash2, Clock } from 'lucide-react';
import { OutboundTransaction } from '../../../Types';
import { StatusBadge } from '../../UI';
import { formatDate } from '../../../Lib/formatters';
import { getOverdueDays, isOverdue } from '../../../Lib/outbound';

interface OutboundTableProps {
    outbounds: OutboundTransaction[];
    onDelete: (outbound: OutboundTransaction) => void;
}

/** Tabel daftar pengajuan barang — layout 5 kolom agar tidak wrap. */
export default function OutboundTable({ outbounds, onDelete }: OutboundTableProps) {
    return (
        <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
            <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">No. Dokumen</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pemohon</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {outbounds.length === 0 ? (
                    <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">
                            Tidak ada pengajuan ditemukan.
                        </td>
                    </tr>
                ) : (
                    outbounds.map((outbound) => {
                        const totalItems = outbound.details?.length ?? 0;
                        const overdue = isOverdue(outbound);
                        const days = getOverdueDays(outbound);

                        return (
                            <tr key={outbound.id} className={`hover:bg-blue-50/50 transition-colors ${overdue ? 'bg-amber-50/30' : ''}`}>
                                <td className="px-6 py-4">
                                    <span className="text-sm font-mono font-medium text-gray-900 whitespace-nowrap">
                                        {outbound.document_number}
                                    </span>
                                    <span className="block text-xs text-gray-400 mt-0.5">
                                        {totalItems} item
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm font-medium text-gray-800">
                                        {outbound.requester?.name ?? '-'}
                                    </span>
                                    <span className="block text-xs text-gray-400 mt-0.5">
                                        {outbound.department?.name ?? '-'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                    {formatDate(outbound.transaction_date)}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <StatusBadge status={outbound.status} />
                                        {overdue && <OverdueBadge days={days!} />}
                                    </div>
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
        </div>
    );
}

/** Badge kecil penunjuk jumlah hari overdue. */
function OverdueBadge({ days }: { days: number }) {
    return (
        <span
            className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 bg-amber-100 rounded-full border border-amber-200"
            title={`${days} hari tanpa tindak lanjut`}
        >
            <Clock className="w-3 h-3" />
            {days}h
        </span>
    );
}
