import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus, Users, UploadCloud } from 'lucide-react';
import { PageProps, PaginatedData, User, Department } from '../../Types';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { PageHeader, Button, Alert, Pagination, ConfirmDialog, Breadcrumbs, EmptyState } from '../../Components/UI';
import UserFilters from '../../Components/Features/User/UserFilters';
import UserTable from '../../Components/Features/User/UserTable';
import ImportUserModal from '../../Components/Features/Users/ImportUserModal';

interface Props extends PageProps {
    users: PaginatedData<User>;
    departments: Department[];
    roles: Record<string, string>;
    filters: Record<string, string>;
}

export default function UserIndex({ users, departments, roles, filters }: Props) {
    const { flash } = usePage<PageProps>().props;
    const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
    const [toggleTarget, setToggleTarget] = useState<User | null>(null);
    const [processing, setProcessing] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    const handleDelete = () => {
        if (!deleteTarget) return;
        setProcessing(true);
        router.delete(`/users/${deleteTarget.id}`, {
            onFinish: () => {
                setProcessing(false);
                setDeleteTarget(null);
            },
        });
    };

    const handleToggleStatus = () => {
        if (!toggleTarget) return;
        setProcessing(true);
        router.post(`/users/${toggleTarget.id}/toggle-status`, {}, {
            onFinish: () => {
                setProcessing(false);
                setToggleTarget(null);
            },
        });
    };

    const hasData = users.data.length > 0;
    const hasFilters = !!(filters?.search || filters?.department_id || filters?.role || filters?.is_active);

    return (
        <AuthenticatedLayout title="Pengguna">
            <Head title="Manajemen Pengguna" />

            <Breadcrumbs items={[{ label: 'Pengguna' }]} />

            <PageHeader
                title="Manajemen Pengguna"
                description="Kelola akun pengguna, role, dan status akses"
                action={
                    <div className="flex gap-2">
                        <Button variant="outline" className="flex items-center gap-2" onClick={() => setIsImportModalOpen(true)}>
                            <UploadCloud className="w-4 h-4" />
                            Import Data
                        </Button>
                        <Link href="/users/create">
                            <Button className="flex items-center gap-2">
                                <Plus className="w-4 h-4" />
                                Tambah Pengguna
                            </Button>
                        </Link>
                    </div>
                }
            />

            {flash?.success && (
                <Alert type="success" className="mb-4">{flash.success}</Alert>
            )}
            {flash?.error && (
                <Alert type="error" className="mb-4">{flash.error}</Alert>
            )}

            <div className="mb-4">
                <UserFilters filters={filters} departments={departments} roles={roles} />
            </div>

            {!hasData && !hasFilters ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <EmptyState
                        title="Belum Ada Pengguna"
                        message="Tambahkan pengguna baru untuk memberikan akses ke sistem SIMPATIK."
                        icon={Users}
                        action={
                            <Link href="/users/create">
                                <Button className="flex items-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    Tambah Pengguna
                                </Button>
                            </Link>
                        }
                    />
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <UserTable
                            users={users.data}
                            onDelete={setDeleteTarget}
                            onToggleStatus={setToggleTarget}
                        />
                    </div>

                    <Pagination
                        links={users.links}
                        from={users.from}
                        to={users.to}
                        total={users.total}
                    />
                </>
            )}

            {/* Confirm Delete */}
            <ConfirmDialog
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                title="Hapus Pengguna?"
                message={`Pengguna "${deleteTarget?.name}" akan dihapus dari sistem. Data tidak dapat dikembalikan.`}
                processing={processing}
            />

            {/* Confirm Toggle Status */}
            <ConfirmDialog
                open={!!toggleTarget}
                onClose={() => setToggleTarget(null)}
                onConfirm={handleToggleStatus}
                title={toggleTarget?.is_active ? 'Nonaktifkan Pengguna?' : 'Aktifkan Pengguna?'}
                message={
                    toggleTarget?.is_active
                        ? `Pengguna "${toggleTarget?.name}" tidak akan bisa login ke sistem.`
                        : `Pengguna "${toggleTarget?.name}" akan diizinkan login kembali ke sistem.`
                }
                processing={processing}
            />

            <ImportUserModal 
                open={isImportModalOpen} 
                onClose={() => setIsImportModalOpen(false)} 
            />
        </AuthenticatedLayout>
    );
}
