/**
 * Komponen: Outbound/Show
 *
 * [Fungsionalitas]
 * Komponen ini bertanggung jawab menampilkan detail transaksi barang keluar secara spesifik.
 * Menyediakan tombol-tombol aksi dinamis (Approve, Issue, Handover, Pickup) yang render-nya
 * bergantung pada peran (role) pengguna dan status dokumen saat ini (State Management).
 */
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, AlertTriangle, Pencil, Info, Clock, Package, RefreshCw, CheckCircle2, FileText, Printer } from 'lucide-react';
import { PageProps, OutboundTransaction } from '../../Types';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { Breadcrumbs, StatusBadge, Alert, InfoField } from '../../Components/UI';
import { formatDateLong } from '../../Lib/formatters';
import { getOverdueDays, OVERDUE_THRESHOLD_DAYS } from '../../Lib/outbound';
import OutboundProgressTracker from '../../Components/Features/Outbound/OutboundProgressTracker';
import OutboundTimeline from '../../Components/Features/Outbound/OutboundTimeline';
import OutboundDetailTable from '../../Components/Features/Outbound/OutboundDetailTable';
import OutboundActions from '../../Components/Features/Outbound/OutboundActions';
import OutboundSignatures from '../../Components/Features/Outbound/OutboundSignatures';

interface Props extends PageProps {
    outbound: OutboundTransaction;
}

const STATUS_LABEL: Record<string, string> = {
    Pending: 'Menunggu',
    Approved: 'Disetujui Penyelia',
    'Handed Over': 'Diserahkan',
};

/** Halaman detail pengajuan barang dengan aksi approval sesuai role. */
/**
 * Komponen: Show
 *
 * [State & Rendering]
 * Merupakan komponen presentasional atau kontainer dalam arsitektur React.
 * Lifecycle dikendalikan oleh Inertia (jika Page) atau parent props (jika Component).
 */
export default function OutboundShow({ outbound }: Props) {
    const { flash, auth } = usePage<PageProps>().props;
    const details = outbound.details ?? [];

    const userRoles = auth.user.roles?.map(r => r.name) ?? [];
    const isAdmin = userRoles.includes('warehouse_admin');
    const isPenyelia = userRoles.includes('division_head');
    const isRequester = auth.user.id === outbound.requester_id;
    const isSameDepartment = auth.user.department_id === outbound.department_id;

    const canApprove = isPenyelia && isSameDepartment && outbound.status === 'Pending';
    const canIssue = isAdmin && outbound.status === 'Approved';
    const canReject = (isPenyelia && isSameDepartment && outbound.status === 'Pending') || (isAdmin && (outbound.status === 'Pending' || outbound.status === 'Approved'));
    const canHandover = isAdmin && outbound.status === 'Issued';
    const canPickup = isRequester && outbound.status === 'Handed Over';
    const canEdit = isRequester && outbound.status === 'Pending';

    const overdueDays = getOverdueDays(outbound);

    return (
        <AuthenticatedLayout title="Detail Pengajuan">
            <Head title={`Pengajuan — ${outbound.document_number}`} />

            <Breadcrumbs items={[
                { label: 'Pengajuan Barang', href: '/outbound' },
                { label: outbound.document_number },
            ]} />

            {flash?.success && <Alert type="success" className="mb-4">{flash.success}</Alert>}
            {flash?.error && <Alert type="error" className="mb-4">{flash.error}</Alert>}

            {overdueDays !== null && overdueDays > OVERDUE_THRESHOLD_DAYS && (
                <div className="mb-4 flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="p-2 bg-amber-100 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-amber-800">
                            Pengajuan Terlambat — {overdueDays} hari
                        </p>
                        <p className="text-xs text-amber-600 mt-0.5">
                            Pengajuan ini sudah {overdueDays} hari di status "{STATUS_LABEL[outbound.status] ?? outbound.status}" tanpa tindak lanjut.
                        </p>
                    </div>
                </div>
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
                <div className="flex items-center gap-2">
                    {/* PDF Buttons */}
                    <a
                        href={route('outbound.pdf.spb', outbound.id)}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                    >
                        <FileText className="w-3.5 h-3.5" />
                        Cetak SPB
                    </a>

                    {(outbound.status === 'Handed Over' || outbound.status === 'Completed') && (
                        <a
                            href={route('outbound.pdf.bast', outbound.id)}
                            target="_blank"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-200"
                        >
                            <Printer className="w-3.5 h-3.5" />
                            Cetak BAST
                        </a>
                    )}

                    {canEdit && (
                        <Link
                            href={`/outbound/${outbound.id}/edit`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                            <Pencil className="w-3.5 h-3.5" />
                            Edit
                        </Link>
                    )}
                    <StatusBadge status={outbound.status} />
                </div>
            </div>

            <OutboundInfoCard outbound={outbound} />
            <OutboundProgressTracker status={outbound.status} />

            <StatusContextBanner outbound={outbound} isAdmin={isAdmin} isPenyelia={isPenyelia} isRequester={isRequester} />

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Riwayat Aktivitas</h2>
                <OutboundTimeline outbound={outbound} />
            </div>

            <div className="mb-6">
                <OutboundDetailTable details={details} status={outbound.status} />
            </div>

            <OutboundSignatures outbound={outbound} />

            <OutboundActions outbound={outbound} canApprove={canApprove} canIssue={canIssue} canReject={canReject} canHandover={canHandover} canPickup={canPickup} />
        </AuthenticatedLayout>
    );
}

/** Card informasi utama pengajuan (dokumen, tanggal, pelaku per tahap). */
function OutboundInfoCard({ outbound }: { outbound: OutboundTransaction }) {
    return (
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
                    <InfoField label="Disetujui Admin Gudang">
                        {outbound.issued_by_user.name}
                        {outbound.issued_at && (
                            <span className="text-gray-400 ml-1">({formatDateLong(outbound.issued_at)})</span>
                        )}
                    </InfoField>
                )}
                {outbound.picked_up_by_user && (
                    <InfoField label="Diambil Oleh">
                        {outbound.picked_up_by_user.name}
                        {outbound.picked_up_at && (
                            <span className="text-gray-400 ml-1">({formatDateLong(outbound.picked_up_at)})</span>
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
    );
}

/** Banner kontekstual — info langkah selanjutnya berdasarkan role & status. */
function StatusContextBanner({ outbound, isAdmin, isPenyelia, isRequester }: {
    outbound: OutboundTransaction;
    isAdmin: boolean;
    isPenyelia: boolean;
    isRequester: boolean;
}) {
    let message: string | null = null;
    let bgColor = 'bg-blue-50 border-blue-200';
    let textColor = 'text-blue-800';
    let iconColor = 'text-blue-500';
    let IconComponent = Info;

    const requesterName = outbound.requester?.name ?? 'pemohon';

    if (outbound.status === 'Pending') {
        if (isRequester) {
            message = 'Pengajuan Anda sedang menunggu persetujuan penyelia.';
            IconComponent = Info;
            iconColor = 'text-blue-500';
        } else if (isPenyelia) {
            message = `Pengajuan dari ${requesterName} membutuhkan persetujuan Anda.`;
            bgColor = 'bg-amber-50 border-amber-200';
            textColor = 'text-amber-800';
            IconComponent = Clock;
            iconColor = 'text-amber-500';
        }
    } else if (outbound.status === 'Approved') {
        if (isAdmin) {
            message = `Pengajuan sudah disetujui penyelia. Menunggu Anda mengeluarkan barang.`;
            bgColor = 'bg-amber-50 border-amber-200';
            textColor = 'text-amber-800';
            IconComponent = Clock;
            iconColor = 'text-amber-500';
        } else if (isRequester) {
            message = 'Pengajuan sudah disetujui penyelia. Menunggu admin gudang mengeluarkan barang.';
            IconComponent = Info;
            iconColor = 'text-blue-500';
        }
    } else if (outbound.status === 'Issued') {
        if (isAdmin) {
            message = `Barang sudah dikeluarkan. Silakan serahkan barang ke ${requesterName}.`;
            bgColor = 'bg-violet-50 border-violet-200';
            textColor = 'text-violet-800';
            IconComponent = Package;
            iconColor = 'text-violet-500';
        } else if (isRequester) {
            message = 'Barang sudah dikeluarkan dari gudang. Menunggu admin gudang menyerahkan ke Anda.';
            IconComponent = Info;
            iconColor = 'text-blue-500';
        }
    } else if (outbound.status === 'Handed Over') {
        if (isAdmin) {
            message = `Barang sudah diserahkan. Menunggu ${requesterName} mengkonfirmasi penerimaan.`;
            bgColor = 'bg-violet-50 border-violet-200';
            textColor = 'text-violet-800';
            IconComponent = RefreshCw;
            iconColor = 'text-violet-500';
        } else if (isRequester) {
            message = 'Barang sudah diserahkan ke Anda. Silakan konfirmasi penerimaan di bawah.';
            bgColor = 'bg-emerald-50 border-emerald-200';
            textColor = 'text-emerald-800';
            IconComponent = CheckCircle2;
            iconColor = 'text-emerald-500';
        }
    }

    if (!message) return null;

    return (
        <div className={`flex items-start gap-3 p-4 rounded-xl border ${bgColor} mb-6`}>
            <IconComponent className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
            <p className={`text-sm font-medium ${textColor}`}>{message}</p>
        </div>
    );
}
