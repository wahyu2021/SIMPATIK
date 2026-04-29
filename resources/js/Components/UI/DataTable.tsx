/**
 * Definisi kolom untuk DataTable.
 * @property key - Nama field dari object data (digunakan untuk akses otomatis jika render tidak disediakan)
 * @property label - Teks yang ditampilkan di header tabel
 * @property render - Custom render function (opsional). Jika tidak ada, otomatis tampilkan item[key]
 * @property className - CSS class untuk cell body
 * @property headerClassName - CSS class untuk cell header (misal 'text-right' untuk kolom Aksi)
 */
interface Column<T> {
    key: string;
    label: string;
    render?: (item: T, index: number) => React.ReactNode;
    className?: string;
    headerClassName?: string;
}

/**
 * Props untuk komponen DataTable.
 * @property columns - Array definisi kolom
 * @property data - Array data yang ditampilkan
 * @property keyField - Nama field untuk React key (default: 'id')
 * @property emptyMessage - Pesan saat data kosong
 * @property striped - Warna baris selang-seling
 */
interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    keyField?: string;
    emptyMessage?: string;
    striped?: boolean;
}

/**
 * Komponen DataTable — tabel data generik dengan kolom yang bisa dikustomisasi.
 * Cocok dipakai untuk semua halaman list/index.
 *
 * @example
 * const columns = [
 *     { key: 'name', label: 'Nama', className: 'font-medium' },
 *     { key: 'items_count', label: 'Jumlah', render: (item) => <Badge>{item.items_count}</Badge> },
 *     { key: 'actions', label: 'Aksi', headerClassName: 'text-right', render: (item) => <Button>Edit</Button> },
 * ];
 * <DataTable columns={columns} data={categories.data} striped />
 */
export default function DataTable<T extends object>({
    columns,
    data,
    keyField = 'id',
    emptyMessage = 'Belum ada data.',
    striped = false,
}: DataTableProps<T>) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                {/* Header */}
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className={`px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider ${col.headerClassName || ''}`}
                            >
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>

                {/* Body */}
                <tbody className="divide-y divide-gray-100">
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="px-6 py-16 text-center text-gray-500 text-sm">
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((item, index) => (
                            <tr
                                key={String((item as Record<string, unknown>)[keyField] ?? index)}
                                className={`
                                    hover:bg-blue-50/50 transition-colors
                                    ${striped && index % 2 === 1 ? 'bg-gray-50/50' : ''}
                                `}
                            >
                                {columns.map((col) => (
                                    <td key={col.key} className={`px-6 py-4 text-sm ${col.className || ''}`}>
                                        {col.render
                                            ? col.render(item, index)
                                            : String((item as Record<string, unknown>)[col.key] ?? '-')
                                        }
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
