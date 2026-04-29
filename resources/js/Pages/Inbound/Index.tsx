import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus, PackagePlus } from 'lucide-react';
import { PageProps, PaginatedData, InboundTransaction } from '../../Types';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { PageHeader, Button, Alert, Pagination, ConfirmDialog, Breadcrumbs, EmptyState } from '../../Components/UI';
import InboundFilters from '../../Components/Features/Inbound/InboundFilters';
import InboundTable from '../../Components/Features/Inbound/InboundTable';

interface Props extends PageProps {
    inbounds: PaginatedData<InboundTransaction>;
    filters: Record<string, string>;
}

export default function InboundIndex({ inbounds, filters }: Props) {
    const { flash } = usePage<PageProps>().props;
    const [deleteTarget, setDeleteTarget] = useState<InboundTransaction | null>(null);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = () => {
        if (!deleteTarget) return;
        setDeleting(true);
        router.delete(`/inbound/${deleteTarget.id}`, {
            onFinish: () => {
                setDeleting(false);
                setDeleteTarget(null);
            },
        });
    };

    const hasData = inbounds.data.length > 0;
    const hasFilters = !!(filters?.search || filters?.date_from || filters?.date_to);

    return (
        <AuthenticatedLayout title="Barang Masuk">
            <Head title="Barang Masuk" />

            <Breadcrumbs items={[{ label: 'Barang Masuk' }]} />

            <PageHeader
                title="Barang Masuk"
                description="Pencatatan penerimaan barang dari vendor ke gudang"
                action={
                    <Link href="/inbound/create">
                        <Button className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Catat Barang Masuk
                        </Button>
                    </Link>
                }
            />

            {flash?.success && (
                <Alert type="success" className="mb-4">{flash.success}</Alert>
            )}
            {flash?.error && (
                <Alert type="error" className="mb-4">{flash.error}</Alert>
            )}

            <div className="mb-4">
                <InboundFilters filters={filters} />
            </div>

            {!hasData && !hasFilters ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <EmptyState
                        title="Belum Ada Barang Masuk"
                        message="Catat penerimaan barang dari vendor untuk memulai pencatatan stok."
                        icon={PackagePlus}
                        action={
                            <Link href="/inbound/create">
                                <Button className="flex items-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    Catat Barang Masuk
                                </Button>
                            </Link>
                        }
                    />
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <InboundTable inbounds={inbounds.data} onDelete={setDeleteTarget} />
                    </div>

                    <Pagination
                        links={inbounds.links}
                        from={inbounds.from}
                        to={inbounds.to}
                        total={inbounds.total}
                    />
                </>
            )}

            <ConfirmDialog
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                title="Hapus Transaksi Barang Masuk?"
                message={`Transaksi "${deleteTarget?.reference_number}" akan dihapus dan stok barang terkait akan dikembalikan. Data tidak dapat dikembalikan.`}
                processing={deleting}
            />
        </AuthenticatedLayout>
    );
}
