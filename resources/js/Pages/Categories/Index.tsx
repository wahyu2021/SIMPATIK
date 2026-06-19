import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus, Tags } from 'lucide-react';
import { PageProps, PaginatedData, Category } from '../../Types';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { PageHeader, Button, Alert, Pagination, ConfirmDialog, Breadcrumbs, SearchInput, EmptyState } from '../../Components/UI';
import CategoryTable from '../../Components/Features/Categories/CategoryTable';

interface Props extends PageProps {
    categories: PaginatedData<Category>;
    filters: Record<string, string>;
}

export default function CategoriesIndex({ categories, filters }: Props) {
    const { auth, flash } = usePage<PageProps>().props;
    const canManageCategories = auth.user.roles?.some((role: any) => role.name === 'general_affairs') ?? false;
    const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = () => {
        if (!deleteTarget) return;
        setDeleting(true);
        router.delete(`/categories/${deleteTarget.id}`, {
            onFinish: () => {
                setDeleting(false);
                setDeleteTarget(null);
            },
        });
    };

    const handleSearch = (value: string) => {
        router.get('/categories', { search: value }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const hasData = categories.data.length > 0;
    const hasFilters = !!filters?.search;

    return (
        <AuthenticatedLayout title="Kategori Barang">
            <Head title="Kategori Barang" />

            <Breadcrumbs items={[{ label: 'Kategori Barang' }]} />

            <PageHeader
                title="Kategori Barang"
                description="Kelola klasifikasi kategori barang ATK"
                action={
                    canManageCategories ? (
                        <Link href="/categories/create">
                            <Button className="flex items-center gap-2">
                                <Plus className="w-4 h-4" />
                                Tambah Kategori
                            </Button>
                        </Link>
                    ) : undefined
                }
            />

            {flash?.success && (
                <Alert type="success" className="mb-4">{flash.success}</Alert>
            )}
            {flash?.error && (
                <Alert type="error" className="mb-4">{flash.error}</Alert>
            )}

            <div className="mb-4">
                <SearchInput
                    placeholder="Cari kategori..."
                    defaultValue={filters?.search || ''}
                    onSearch={handleSearch}
                />
            </div>

            {!hasData && !hasFilters ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <EmptyState
                        title="Belum Ada Kategori"
                        message="Tambahkan kategori baru untuk mengklasifikasikan barang ATK."
                        icon={Tags}
                        action={
                            canManageCategories ? (
                                <Link href="/categories/create">
                                    <Button className="flex items-center gap-2">
                                        <Plus className="w-4 h-4" />
                                        Tambah Kategori
                                    </Button>
                                </Link>
                            ) : undefined
                        }
                    />
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <CategoryTable
                            categories={categories.data}
                            startNumber={categories.from ?? 1}
                            onDelete={setDeleteTarget}
                            canManage={canManageCategories}
                        />
                    </div>

                    <Pagination
                        links={categories.links}
                        from={categories.from}
                        to={categories.to}
                        total={categories.total}
                    />
                </>
            )}

            <ConfirmDialog
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                title="Hapus Kategori?"
                message={`Kategori "${deleteTarget?.name}" akan dihapus. Data tidak dapat dikembalikan.`}
                processing={deleting}
            />
        </AuthenticatedLayout>
    );
}
