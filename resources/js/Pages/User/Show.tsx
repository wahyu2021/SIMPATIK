import { Head, Link, usePage, router } from '@inertiajs/react';
import { ArrowLeft, Pencil, Power, Mail, Building2, Shield, Calendar, FileSignature } from 'lucide-react';
import { PageProps, User } from '../../Types';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { Breadcrumbs, Alert, Button, InfoField } from '../../Components/UI';
import { formatDateLong } from '../../Lib/formatters';

const ROLE_LABELS: Record<string, string> = {
    warehouse_admin: 'Admin Gudang',
    division_head: 'Penyelia / Kepala Unit Kerja',
    general_affairs: 'Staff Bagian Umum',
    staff: 'Staf Unit Kerja',
};

interface Props extends PageProps {
    user: User;
}

/**
 * Komponen: Show
 *
 * [State & Rendering]
 * Merupakan komponen presentasional atau kontainer dalam arsitektur React.
 * Lifecycle dikendalikan oleh Inertia (jika Page) atau parent props (jika Component).
 */
export default function UserShow({ user }: Props) {
    const { flash } = usePage<PageProps>().props;
    const roleName = user.roles?.[0]?.name || '';

    const handleToggleStatus = () => {
        if (!confirm(user.is_active ? 'Nonaktifkan pengguna ini?' : 'Aktifkan pengguna ini?')) return;
        router.post(`/users/${user.id}/toggle-status`);
    };

    return (
        <AuthenticatedLayout title="Detail Pengguna">
            <Head title={`Pengguna — ${user.name}`} />

            <Breadcrumbs items={[
                { label: 'Pengguna', href: '/users' },
                { label: user.name },
            ]} />

            {flash?.success && (
                <Alert type="success" className="mb-4">{flash.success}</Alert>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                    <Link
                        href="/users"
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-lg font-bold shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                            <p className="text-sm text-gray-500">{ROLE_LABELS[roleName] || roleName}</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full ${
                        user.is_active
                            ? 'bg-green-50 text-green-700 ring-1 ring-green-200'
                            : 'bg-red-50 text-red-700 ring-1 ring-red-200'
                    }`}>
                        <span className={`w-2 h-2 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                        {user.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                </div>
            </div>

            {/* Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Pengguna</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InfoField label="Email" icon={Mail} mono>{user.email}</InfoField>
                    <InfoField label="Unit Kerja" icon={Building2}>{user.department?.name ?? '-'}</InfoField>
                    <InfoField label="Role" icon={Shield}>{ROLE_LABELS[roleName] || roleName}</InfoField>

                    <InfoField label="Dibuat" icon={Calendar}>{formatDateLong(user.created_at)}</InfoField>
                    <InfoField label="Terakhir Update" icon={Calendar}>{formatDateLong(user.updated_at)}</InfoField>
                </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Tindakan</h2>
                <div className="flex flex-wrap items-center gap-3">
                    <Link href={`/users/${user.id}/edit`}>
                        <Button className="flex items-center gap-2">
                            <Pencil className="w-4 h-4" />
                            Edit Pengguna
                        </Button>
                    </Link>
                    <button
                        onClick={handleToggleStatus}
                        className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            user.is_active
                                ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 ring-1 ring-amber-200'
                                : 'bg-green-50 text-green-700 hover:bg-green-100 ring-1 ring-green-200'
                        }`}
                    >
                        <Power className="w-4 h-4" />
                        {user.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                    </button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
