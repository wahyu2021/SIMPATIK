import { Link } from '@inertiajs/react';
import { Pencil, Trash2, Users } from 'lucide-react';
import { Department } from '../../../Types';
import { DataTable, Badge } from '../../UI';

interface DepartmentTableProps {
    departments: Department[];
    startNumber: number;
    onDelete: (department: Department) => void;
    canManage?: boolean;
}

/**
 * Komponen DepartmentTable — tabel unit kerja dengan kolom nomor, nama, jumlah pengguna, dan aksi.
 * Menggunakan DataTable generik sebagai base component.
 */
/**
 * Komponen: DepartmentTable
 *
 * [State & Rendering]
 * Merupakan komponen presentasional atau kontainer dalam arsitektur React.
 * Lifecycle dikendalikan oleh Inertia (jika Page) atau parent props (jika Component).
 */
export default function DepartmentTable({ departments, startNumber, onDelete, canManage = true }: DepartmentTableProps) {
    /** Helper untuk cast item dari DataTable ke Department */
    const asDepartment = (item: Record<string, unknown>) => item as unknown as Department;

    const columns: any[] = [
        {
            key: 'number',
            label: 'No',
            className: 'text-gray-500 w-12',
            render: (_item: Record<string, unknown>, index: number) => (
                <span>{startNumber + index}</span>
            ),
        },
        {
            key: 'name',
            label: 'Nama Unit Kerja',
            className: 'font-medium text-gray-900',
        },
        {
            key: 'users_count',
            label: 'Jumlah Pengguna',
            render: (item: Record<string, unknown>) => {
                const department = asDepartment(item);
                return (
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <Badge variant={department.users_count ? 'info' : 'default'}>
                            {department.users_count ?? 0} orang
                        </Badge>
                    </div>
                );
            },
        },
    ];

    if (canManage) {
        columns.push({
            key: 'actions',
            label: 'Aksi',
            headerClassName: 'text-right',
            className: 'text-right',
            render: (item: Record<string, unknown>) => {
                const department = asDepartment(item);
                return (
                    <div className="flex items-center justify-end gap-2">
                        <Link
                            href={`/departments/${department.id}/edit`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0052A3] bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                            <Pencil className="w-3.5 h-3.5" />
                            Edit
                        </Link>
                        <button
                            onClick={() => onDelete(department)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            Hapus
                        </button>
                    </div>
                );
            },
        });
    }

    return (
        <DataTable
            columns={columns}
            data={departments as unknown as Record<string, unknown>[]}
            emptyMessage="Belum ada unit kerja. Tambahkan unit kerja pertama Anda."
            striped
        />
    );
}
