import { Link } from '@inertiajs/react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { InboundTransaction } from '../../../Types';
import { DataTable, Badge } from '../../UI';
import { formatCurrency, formatDate } from '../../../Lib/formatters';

interface InboundTableProps {
    inbounds: InboundTransaction[];
    onDelete: (inbound: InboundTransaction) => void;
}

/** Tabel transaksi barang masuk — referensi, tanggal, pencatat, jumlah, total, aksi. */
export default function InboundTable({ inbounds, onDelete }: InboundTableProps) {
    const calcTotalValue = (inbound: InboundTransaction): number => {
        return (inbound.details ?? []).reduce(
            (sum, d) => sum + d.quantity * d.unit_price, 0
        );
    };

    const columns = [
        {
            key: 'reference_number',
            label: 'No. Referensi',
            className: 'font-mono font-medium text-gray-900',
        },
        {
            key: 'transaction_date',
            label: 'Tanggal',
            render: (item: InboundTransaction) => (
                <span className="text-gray-700">{formatDate(item.transaction_date)}</span>
            ),
        },
        {
            key: 'user',
            label: 'Pencatat',
            render: (item: InboundTransaction) => (
                <span className="text-gray-700">{item.user?.name ?? '-'}</span>
            ),
        },
        {
            key: 'details_count',
            label: 'Jumlah Item',
            render: (item: InboundTransaction) => (
                <Badge variant="info">{item.details?.length ?? 0} item</Badge>
            ),
        },
        {
            key: 'total_value',
            label: 'Total Nilai',
            render: (item: InboundTransaction) => (
                <span className="text-gray-900 font-medium">
                    {formatCurrency(calcTotalValue(item))}
                </span>
            ),
        },
        {
            key: 'actions',
            label: 'Aksi',
            headerClassName: 'text-right',
            className: 'text-right',
            render: (item: InboundTransaction) => (
                <div className="flex items-center justify-end gap-2">
                    <Link
                        href={`/inbound/${item.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <Eye className="w-3.5 h-3.5" />
                        Detail
                    </Link>
                    <Link
                        href={`/inbound/${item.id}/edit`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0052A3] bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
                    </Link>
                    <button
                        onClick={() => onDelete(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        Hapus
                    </button>
                </div>
            ),
        },
    ];

    return (
        <DataTable
            columns={columns}
            data={inbounds}
            emptyMessage="Belum ada transaksi barang masuk."
            striped
        />
    );
}
