import { Link } from '@inertiajs/react';
import { Eye, Pencil, Trash2, Power } from 'lucide-react';
import { User } from '../../../Types';
import { Badge } from '../../UI';

const ROLE_LABELS: Record<string, string> = {
    warehouse_admin: 'Admin Gudang',
    division_head: 'Penyelia',
    general_affairs: 'Bagian Umum',
    staff: 'Staff',
};

interface UserTableProps {
    users: User[];
    onDelete: (user: User) => void;
    onToggleStatus: (user: User) => void;
}

/** Tabel pengguna — nama, email, unit kerja, role, status, aksi. */
/**
 * Komponen: UserTable
 *
 * [State & Rendering]
 * Merupakan komponen presentasional atau kontainer dalam arsitektur React.
 * Lifecycle dikendalikan oleh Inertia (jika Page) atau parent props (jika Component).
 */
export default function UserTable({ users, onDelete, onToggleStatus }: UserTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Unit Kerja</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                                Tidak ada pengguna ditemukan.
                            </td>
                        </tr>
                    ) : (
                        users.map((user) => {
                            const roleName = user.roles?.[0]?.name || '';
                            return (
                                <tr key={user.id} className="hover:bg-blue-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        {user.department?.name ?? '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={roleName === 'warehouse_admin' ? 'warning' : roleName === 'division_head' ? 'info' : 'default'}>
                                            {ROLE_LABELS[roleName] || roleName}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${
                                            user.is_active
                                                ? 'bg-green-50 text-green-700 ring-1 ring-green-200'
                                                : 'bg-red-50 text-red-700 ring-1 ring-red-200'
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                                            {user.is_active ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <Link
                                                href={`/users/${user.id}`}
                                                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                Detail
                                            </Link>
                                            <Link
                                                href={`/users/${user.id}/edit`}
                                                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#0052A3] bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => onToggleStatus(user)}
                                                className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                                                    user.is_active
                                                        ? 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                                                        : 'text-green-600 bg-green-50 hover:bg-green-100'
                                                }`}
                                                title={user.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                            >
                                                <Power className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => onDelete(user)}
                                                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
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
