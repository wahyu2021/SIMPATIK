import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { PageProps, OutboundTransaction } from '../../Types';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { Breadcrumbs, StatusBadge, Alert, InfoField } from '../../Components/UI';
import { formatDateLong } from '../../Lib/formatters';
import OutboundDetailTable from '../../Components/Features/Outbound/OutboundDetailTable';
import OutboundActions from '../../Components/Features/Outbound/OutboundActions';

interface Props extends PageProps {
    outbound: OutboundTransaction;
}

/** Halaman detail pengajuan barang dengan aksi approval sesuai role. */
export default function OutboundShow({ outbound }: Props) {
    const { flash, auth } = usePage<PageProps>().props;
    const details = outbound.details ?? [];

    const userRoles = auth.user.roles?.map(r => r.name) ?? [];
    const isAdmin = userRoles.includes('warehouse_admin');
    const isPenyelia = userRoles.includes('division_head');

    // Hanya penyelia dari unit kerja yang sama yang boleh approve/reject
    const isSameDepartment = auth.user.department_id === outbound.department_id;
    const canApprove = isPenyelia && isSameDepartment && outbound.status === 'Pending';
    const canIssue = isAdmin && outbound.status === 'Approved';

    return (
        <AuthenticatedLayout title="Detail Pengajuan">
            <Head title={`Pengajuan — ${outbound.document_number}`} />

            <Breadcrumbs items={[
                { label: 'Pengajuan Barang', href: '/outbound' },
                { label: outbound.document_number },
            ]} />

            {flash?.success && (
                <Alert type="success" className="mb-4">{flash.success}</Alert>
            )}
            {flash?.error && (
                <Alert type="error" className="mb-4">{flash.error}</Alert>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                    <Link
                        href="/outbound"
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Detail Pengajuan</h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            {outbound.is_special_request ? '⭐ Pesanan Khusus' : 'Pengajuan reguler'}
                        </p>
                    </div>
                </div>
                <StatusBadge status={outbound.status} />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Pengajuan</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InfoField label="No. Dokumen" mono>{outbound.document_number}</InfoField>
                    <InfoField label="Tanggal Pengajuan">{formatDateLong(outbound.transaction_date)}</InfoField>
                    <InfoField label="Unit Kerja">{outbound.department?.name ?? '-'}</InfoField>
                    <InfoField label="Pemohon">{outbound.requester?.name ?? '-'}</InfoField>
                    {outbound.approver && (
                        <InfoField label={outbound.status === 'Rejected' ? 'Ditolak Oleh' : 'Disetujui Oleh'}>
                            {outbound.approver.name}
                            {outbound.approved_at && (
                                <span className="text-gray-400 ml-1">({formatDateLong(outbound.approved_at)})</span>
                            )}
                        </InfoField>
                    )}
                    {outbound.issued_by_user && (
                        <InfoField label="Diserahkan Oleh">
                            {outbound.issued_by_user.name}
                            {outbound.issued_at && (
                                <span className="text-gray-400 ml-1">({formatDateLong(outbound.issued_at)})</span>
                            )}
                        </InfoField>
                    )}
                </div>

                {outbound.notes && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <InfoField label="Catatan">{outbound.notes}</InfoField>
                    </div>
                )}

                {outbound.rejection_reason && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <InfoField label="Alasan Penolakan" labelClassName="text-red-500">
                            <span className="text-red-700 bg-red-50 p-3 rounded-lg block">{outbound.rejection_reason}</span>
                        </InfoField>
                    </div>
                )}
            </div>

            <div className="mb-6">
                <OutboundDetailTable details={details} />
            </div>

            <OutboundActions outbound={outbound} canApprove={canApprove} canIssue={canIssue} />
        </AuthenticatedLayout>
    );
}
