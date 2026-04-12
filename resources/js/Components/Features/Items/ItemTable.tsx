import { Link } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { Item, Category } from '../../../Types';
import { DataTable, Badge } from '../../UI';

interface ItemTableProps {
    items: Item[];
    onDelete: (item: Item) => void;
}

/**
 * Komponen ItemTable — tabel barang dengan kolom kode, nama, kategori, stok, harga, dan aksi.
 */
export default function ItemTable({ items, onDelete }: ItemTableProps) {
    const columns = [
        {
            key: 'item_code',
            label: 'Kode',
            className: 'font-mono text-gray-500',
        },
        {
            key: 'name',
            label: 'Nama Barang',
            className: 'font-medium text-gray-900',
        },
        {
            key: 'category',
            label: 'Kategori',
            render: (item: Item) => (
                <Badge variant="info">{item.category?.name ?? '-'}</Badge>
            ),
        },
        {
            key: 'current_stock',
            label: 'Stok',
            render: (item: Item) => {
                const isLow = item.current_stock <= item.minimum_stock_level;
                return (
                    <div className="flex items-center gap-2">
                        <span className={isLow ? 'text-red-600 font-semibold' : 'text-gray-900'}>
                            {item.current_stock}
                        </span>
                        <span className="text-gray-400 text-xs">/ {item.minimum_stock_level} {item.unit_of_measure}</span>
                        {isLow && <Badge variant="danger" size="sm">Rendah</Badge>}
                    </div>
                );
            },
        },
        {
            key: 'unit_price',
            label: 'Harga Satuan',
            render: (item: Item) => (
                <span className="text-gray-700">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.unit_price)}
                </span>
            ),
        },
        {
            key: 'actions',
            label: 'Aksi',
            headerClassName: 'text-right',
            className: 'text-right',
            render: (item: Item) => (
                <div className="flex items-center justify-end gap-2">
                    <Link
                        href={`/items/${item.id}/edit`}
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
            data={items}
            emptyMessage="Belum ada barang. Tambahkan barang pertama Anda."
            striped
        />
    );
}
