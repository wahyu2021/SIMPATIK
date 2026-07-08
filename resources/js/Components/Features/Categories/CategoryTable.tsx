import { Link } from '@inertiajs/react';
import { Pencil, Trash2, Package } from 'lucide-react';
import { Category } from '../../../Types';
import { DataTable, Badge } from '../../UI';

interface CategoryTableProps {
    categories: Category[];
    startNumber: number;
    onDelete: (category: Category) => void;
    canManage?: boolean;
}

/** Tabel kategori barang — nomor, nama, jumlah barang, aksi. */
/**
 * Komponen: CategoryTable
 *
 * [State & Rendering]
 * Merupakan komponen presentasional atau kontainer dalam arsitektur React.
 * Lifecycle dikendalikan oleh Inertia (jika Page) atau parent props (jika Component).
 */
export default function CategoryTable({ categories, startNumber, onDelete, canManage = true }: CategoryTableProps) {
    const columns = [
        {
            key: 'number',
            label: 'No',
            className: 'text-gray-500 w-12',
            render: (_item: Category, index: number) => (
                <span>{startNumber + index}</span>
            ),
        },
        {
            key: 'name',
            label: 'Nama Kategori',
            className: 'font-medium text-gray-900',
        },
        {
            key: 'items_count',
            label: 'Jumlah Barang',
            render: (item: Category) => (
                <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-400" />
                    <Badge variant={item.items_count ? 'info' : 'default'}>
                        {item.items_count ?? 0} barang
                    </Badge>
                </div>
            ),
        },
    ];

    if (canManage) {
        columns.push({
            key: 'actions',
            label: 'Aksi',
            headerClassName: 'text-right',
            className: 'text-right',
            render: (item: Category) => (
                <div className="flex items-center justify-end gap-2">
                    <Link
                        href={`/categories/${item.id}/edit`}
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
        });
    }

    return (
        <DataTable
            columns={columns}
            data={categories}
            emptyMessage="Belum ada kategori. Tambahkan kategori pertama Anda."
            striped
        />
    );
}
