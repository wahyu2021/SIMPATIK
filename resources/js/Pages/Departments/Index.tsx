import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus, Building2 } from 'lucide-react';
import { PageProps, PaginatedData, Department } from '../../Types';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { PageHeader, Button, Alert, Pagination, ConfirmDialog, Breadcrumbs, SearchInput, EmptyState } from '../../Components/UI';
import DepartmentTable from '../../Components/Features/Departments/DepartmentTable';

interface Props extends PageProps {
    departments: PaginatedData<Department>;
    filters: Record<string, string>;
}

/**
 * Komponen: Index
 *
 * [State & Rendering]
 * Merupakan komponen presentasional atau kontainer dalam arsitektur React.
 * Lifecycle dikendalikan oleh Inertia (jika Page) atau parent props (jika Component).
 */
export default function DepartmentsIndex({ departments, filters }: Props) {
    const { auth, flash } = usePage<PageProps>().props;
    const canManageDepartments = auth.user.roles?.some((role: any) => role.name === 'general_affairs') ?? false;
    const [deleteTarget, setDeleteTarget] = useState<Department | null>(null);
    const [deleting, setDeleting] = useState(false);

    /** Hapus unit kerja setelah konfirmasi */
    const handleDelete = () => {
        if (!deleteTarget) return;
        setDeleting(true);
        router.delete(`/departments/${deleteTarget.id}`, {
            onFinish: () => {
                setDeleting(false);
                setDeleteTarget(null);
            },
        });
    };

    /** Pencarian unit kerja dengan debounce via Inertia visit */
    const handleSearch = (value: string) => {
        router.get('/departments', { search: value }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const hasDepartments = departments.data.length > 0;
    const hasFilters = !!filters?.search;

    return (
        <AuthenticatedLayout title="Unit Kerja">
            <Head title="Unit Kerja" />

            <Breadcrumbs items={[{ label: 'Unit Kerja' }]} />

            {/* Header */}
            <PageHeader
                title="Unit Kerja"
                description="Kelola daftar unit kerja di Bank Sumsel Babel"
                action={
                    canManageDepartments ? (
                        <Link href="/departments/create">
                            <Button className="flex items-center gap-2">
                                <Plus className="w-4 h-4" />
                                Tambah Unit Kerja
                            </Button>
                        </Link>
                    ) : undefined
                }
            />

            {/* Flash Message */}
            {flash?.success && (
                <Alert type="success" className="mb-4">{flash.success}</Alert>
            )}
            {flash?.error && (
                <Alert type="error" className="mb-4">{flash.error}</Alert>
            )}

            {/* Search Bar */}
            <div className="mb-4">
                <SearchInput
                    placeholder="Cari unit kerja..."
                    defaultValue={filters?.search || ''}
                    onSearch={handleSearch}
                />
            </div>

            {/* Content: Table or Empty State */}
            {!hasDepartments && !hasFilters ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <EmptyState
                        title="Belum Ada Unit Kerja"
                        message="Tambahkan unit kerja baru untuk memulai pengelolaan data."
                        icon={Building2}
                        action={
                            canManageDepartments ? (
                                <Link href="/departments/create">
                                    <Button className="flex items-center gap-2">
                                        <Plus className="w-4 h-4" />
                                        Tambah Unit Kerja
                                    </Button>
                                </Link>
                            ) : undefined
                        }
                    />
                </div>
            ) : (
                <>
                    {/* Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <DepartmentTable
                            departments={departments.data}
                            startNumber={departments.from ?? 1}
                            onDelete={setDeleteTarget}
                            canManage={canManageDepartments}
                        />
                    </div>

                    {/* Pagination */}
                    <Pagination
                        links={departments.links}
                        from={departments.from}
                        to={departments.to}
                        total={departments.total}
                    />
                </>
            )}

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                title="Hapus Unit Kerja?"
                message={`Unit kerja "${deleteTarget?.name}" akan dihapus. Data tidak dapat dikembalikan.`}
                processing={deleting}
            />
        </AuthenticatedLayout>
    );
}
