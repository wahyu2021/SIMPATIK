interface Column<T> {
    key: string;
    label: string;
    render?: (item: T, index: number) => React.ReactNode;
    className?: string;
    headerClassName?: string;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    keyField?: string;
    emptyMessage?: string;
    striped?: boolean;
}

export default function DataTable<T extends Record<string, unknown>>({
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
                                key={String(item[keyField] ?? index)}
                                className={`
                                    hover:bg-blue-50/50 transition-colors
                                    ${striped && index % 2 === 1 ? 'bg-gray-50/50' : ''}
                                `}
                            >
                                {columns.map((col) => (
                                    <td key={col.key} className={`px-6 py-4 text-sm ${col.className || ''}`}>
                                        {col.render
                                            ? col.render(item, index)
                                            : String(item[col.key] ?? '-')
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
