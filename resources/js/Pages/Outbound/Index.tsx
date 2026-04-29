import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus, PackageSearch } from 'lucide-react';
import { PageProps, PaginatedData, OutboundTransaction, Department } from '../../Types';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { PageHeader, Button, Alert, Pagination, ConfirmDialog, Breadcrumbs, EmptyState } from '../../Components/UI';
import OutboundFilters from '../../Components/Features/Outbound/OutboundFilters';
import OutboundTable from '../../Components/Features/Outbound/OutboundTable';

interface Props extends PageProps {
    outbounds: PaginatedData<OutboundTransaction>;
    filters: Record<string, string>;
    departments: Department[];
}

export default function OutboundIndex({ outbounds, filters, departments }: Props) {
    const { flash, auth } = usePage<PageProps>().props;
    const [deleteTarget, setDeleteTarget] = useState<OutboundTransaction | null>(null);
    const [deleting, setDeleting] = useState(false);

    const canCreate = auth.user.roles?.some(r =>
        ['warehouse_admin', 'staff'].includes(r.name)
    );

    const handleDelete = () => {
        if (!deleteTarget) return;
        setDeleting(true);
        router.delete(`/outbound/${deleteTarget.id}`, {
            onFinish: () => {
                setDeleting(false);
                setDeleteTarget(null);
            },
        });
    };

    const hasData = outbounds.data.length > 0;
    const hasFilters = !!(filters?.search || filters?.status || filters?.department_id || filters?.date_from);

    return (
        <AuthenticatedLayout title="Pengajuan Barang">
            <Head title="Pengajuan Barang" />

            <Breadcrumbs items={[{ label: 'Pengajuan Barang' }]} />

            <PageHeader
                title="Pengajuan Barang"
                description="Pengajuan kebutuhan ATK oleh unit kerja"
                action={canCreate ? (
                    <Link href="/outbound/create">
                        <Button className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Buat Pengajuan
                        </Button>
                    </Link>
                ) : undefined}
            />

            {flash?.success && (
                <Alert type="success" className="mb-4">{flash.success}</Alert>
            )}
            {flash?.error && (
                <Alert type="error" className="mb-4">{flash.error}</Alert>
            )}

            <div className="mb-4">
                <OutboundFilters filters={filters} departments={departments} />
            </div>

            {!hasData && !hasFilters ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <EmptyState
                        title="Belum Ada Pengajuan"
                        message="Buat pengajuan barang ATK untuk unit kerja Anda."
                        icon={PackageSearch}
                        action={canCreate ? (
                            <Link href="/outbound/create">
                                <Button className="flex items-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    Buat Pengajuan
                                </Button>
                            </Link>
                        ) : undefined}
                    />
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <OutboundTable outbounds={outbounds.data} onDelete={setDeleteTarget} />
                    </div>

                    <Pagination
                        links={outbounds.links}
                        from={outbounds.from}
                        to={outbounds.to}
                        total={outbounds.total}
                    />
                </>
            )}

            <ConfirmDialog
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                title="Batalkan Pengajuan?"
                message={`Pengajuan "${deleteTarget?.document_number}" akan dibatalkan dan dihapus. Tindakan ini tidak dapat dibatalkan.`}
                processing={deleting}
            />
        </AuthenticatedLayout>
    );
}
