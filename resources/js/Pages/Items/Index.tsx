import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { PageProps, PaginatedData, Item, Category } from '../../Types';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { PageHeader, Button, Alert, Pagination, ConfirmDialog, Breadcrumbs } from '../../Components/UI';
import ItemFilters from '../../Components/Features/Items/ItemFilters';
import ItemTable from '../../Components/Features/Items/ItemTable';

interface Props extends PageProps {
    items: PaginatedData<Item>;
    categories: Category[];
    filters: Record<string, string>;
}

export default function ItemsIndex({ items, categories, filters }: Props) {
    const { flash } = usePage<PageProps>().props;
    const [deleteTarget, setDeleteTarget] = useState<Item | null>(null);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = () => {
        if (!deleteTarget) return;
        setDeleting(true);
        router.delete(`/items/${deleteTarget.id}`, {
            onFinish: () => {
                setDeleting(false);
                setDeleteTarget(null);
            },
        });
    };

    return (
        <AuthenticatedLayout title="Barang">
            <Head title="Daftar Barang" />

            <Breadcrumbs items={[{ label: 'Barang' }]} />

            {/* Header */}
            <PageHeader
                title="Daftar Barang"
                description="Kelola barang inventaris gudang Bank Sumsel Babel"
                action={
                    <Link href="/items/create">
                        <Button className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Tambah Barang
                        </Button>
                    </Link>
                }
            />

            {/* Flash Message */}
            {flash?.success && (
                <Alert type="success" className="mb-4">{flash.success}</Alert>
            )}

            {/* Filter Bar */}
            <div className="mb-4">
                <ItemFilters filters={filters} categories={categories} />
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <ItemTable items={items.data} onDelete={setDeleteTarget} />
            </div>

            {/* Pagination */}
            <Pagination
                links={items.links}
                from={items.from}
                to={items.to}
                total={items.total}
            />

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                title="Hapus Barang?"
                message={`Barang "${deleteTarget?.name}" akan dihapus. Data tidak dapat dikembalikan.`}
                processing={deleting}
            />
        </AuthenticatedLayout>
    );
}
