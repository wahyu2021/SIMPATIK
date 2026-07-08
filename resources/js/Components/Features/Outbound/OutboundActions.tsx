import { useState } from 'react';
import { router } from '@inertiajs/react';
import { CheckCircle, XCircle, PackageCheck, PackageOpen, Edit3, Send } from 'lucide-react';
import { OutboundTransaction, OutboundTransactionDetail } from '../../../Types';
import { Button, ConfirmDialog, Textarea } from '../../UI';

interface OutboundActionsProps {
    outbound: OutboundTransaction;
    canApprove: boolean;
    canIssue: boolean;
    canReject: boolean;
    canHandover: boolean;
    canPickup: boolean;
}

/** Panel tindakan pengajuan — approve/reject (Penyelia), issue/handover (Admin Gudang), pickup (Pemohon). */
/**
 * Komponen: OutboundActions
 *
 * [State & Rendering]
 * Merupakan komponen presentasional atau kontainer dalam arsitektur React.
 * Lifecycle dikendalikan oleh Inertia (jika Page) atau parent props (jika Component).
 */
export default function OutboundActions({ outbound, canApprove, canIssue, canReject, canHandover, canPickup }: OutboundActionsProps) {
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [showApproveForm, setShowApproveForm] = useState(false);
    const [showIssueForm, setShowIssueForm] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [processing, setProcessing] = useState(false);
    const [showIssueConfirm, setShowIssueConfirm] = useState(false);
    const [showHandoverConfirm, setShowHandoverConfirm] = useState(false);
    const [showPickupConfirm, setShowPickupConfirm] = useState(false);

    const details = outbound.details ?? [];

    const [quantities, setQuantities] = useState<Record<number, number>>(() => {
        const initial: Record<number, number> = {};
        details.forEach(d => { initial[d.id] = outbound.status === 'Approved' ? d.quantity_approved : d.quantity_requested; });
        return initial;
    });

    const updateQty = (detailId: number, value: number, max: number) => {
        setQuantities(prev => ({ ...prev, [detailId]: Math.max(0, Math.min(value, max)) }));
    };

    const handleApproveQuick = () => {
        setProcessing(true);
        router.post(`/outbound/${outbound.id}/approve`, {}, {
            onFinish: () => setProcessing(false),
        });
    };

    const handleApproveWithQty = () => {
        setProcessing(true);
        router.post(`/outbound/${outbound.id}/approve`, { quantities }, {
            onFinish: () => {
                setProcessing(false);
                setShowApproveForm(false);
            },
        });
    };

    const handleIssueWithQty = () => {
        setProcessing(true);
        router.post(`/outbound/${outbound.id}/issue`, { quantities }, {
            onFinish: () => {
                setProcessing(false);
                setShowIssueForm(false);
            },
        });
    };

    const handleReject = () => {
        if (rejectionReason.length < 10) return;
        setProcessing(true);
        router.post(`/outbound/${outbound.id}/reject`, {
            rejection_reason: rejectionReason,
        }, {
            onFinish: () => {
                setProcessing(false);
                setShowRejectForm(false);
            },
        });
    };

    const handleIssue = () => {
        setProcessing(true);
        router.post(`/outbound/${outbound.id}/issue`, {}, {
            onFinish: () => {
                setProcessing(false);
                setShowIssueConfirm(false);
            },
        });
    };

    const handleHandover = () => {
        setProcessing(true);
        router.post(`/outbound/${outbound.id}/handover`, {}, {
            onFinish: () => {
                setProcessing(false);
                setShowHandoverConfirm(false);
            },
        });
    };

    const handlePickup = () => {
        setProcessing(true);
        router.post(`/outbound/${outbound.id}/pickup`, {}, {
            onFinish: () => {
                setProcessing(false);
                setShowPickupConfirm(false);
            },
        });
    };

    if (!canApprove && !canIssue && !canReject && !canHandover && !canPickup) return null;

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Tindakan</h2>

                {/* --- Aksi Approve (Penyelia) --- */}
                {canApprove && !showRejectForm && !showApproveForm && (
                    <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={handleApproveQuick}
                                disabled={processing}
                                className="flex items-center gap-2 !bg-green-600 hover:!bg-green-700"
                            >
                                <CheckCircle className="w-4 h-4" />
                                {processing ? 'Memproses...' : 'Setujui Semua'}
                            </Button>
                            <button
                                onClick={() => setShowApproveForm(true)}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                                <Edit3 className="w-4 h-4" />
                                Sesuaikan Jumlah
                            </button>
                        </div>
                    </div>
                )}

                {canApprove && showApproveForm && (
                    <ApproveQuantityForm
                        details={details}
                        quantities={quantities}
                        onUpdateQty={updateQty}
                        onSubmit={handleApproveWithQty}
                        onCancel={() => setShowApproveForm(false)}
                        processing={processing}
                    />
                )}

                {/* --- Aksi Issue (Admin Gudang) --- */}
                {canIssue && !showRejectForm && !showIssueForm && (
                    <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={() => setShowIssueConfirm(true)}
                                disabled={processing}
                                className="flex items-center gap-2"
                            >
                                <PackageCheck className="w-4 h-4" />
                                Setujui Pengeluaran Barang
                            </Button>
                            <button
                                onClick={() => setShowIssueForm(true)}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                                <Edit3 className="w-4 h-4" />
                                Sesuaikan Jumlah
                            </button>
                        </div>
                    </div>
                )}

                {canIssue && showIssueForm && (
                    <ApproveQuantityForm
                        details={details}
                        quantities={quantities}
                        onUpdateQty={updateQty}
                        onSubmit={handleIssueWithQty}
                        onCancel={() => setShowIssueForm(false)}
                        processing={processing}
                    />
                )}

                {/* --- Tombol Buka Form Reject --- */}
                {canReject && !showRejectForm && !showApproveForm && !showIssueForm && (
                    <button
                        onClick={() => setShowRejectForm(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    >
                        <XCircle className="w-4 h-4" />
                        Tolak Pengajuan
                    </button>
                )}

                {/* --- Form Reject --- */}
                {canReject && showRejectForm && (
                    <div className="space-y-3">
                        <Textarea
                            id="rejection_reason"
                            label="Alasan Penolakan"
                            placeholder="Jelaskan alasan penolakan (minimal 10 karakter)..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            rows={3}
                            required
                        />
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={handleReject}
                                disabled={processing || rejectionReason.length < 10}
                                className="flex items-center gap-2 !bg-red-600 hover:!bg-red-700"
                            >
                                <XCircle className="w-4 h-4" />
                                {processing ? 'Memproses...' : 'Konfirmasi Tolak'}
                            </Button>
                            <button
                                onClick={() => { setShowRejectForm(false); setRejectionReason(''); }}
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                )}

                {canHandover && (
                    <div className="space-y-3">
                        <div className="p-4 bg-violet-50 rounded-lg border border-violet-200">
                            <p className="text-sm text-violet-800">
                                <strong>Barang siap diserahkan.</strong> Konfirmasi bahwa Anda telah menyerahkan barang ke pemohon.
                            </p>
                        </div>
                        <Button
                            onClick={() => setShowHandoverConfirm(true)}
                            disabled={processing}
                            className="flex items-center gap-2 !bg-violet-600 hover:!bg-violet-700"
                        >
                            <Send className="w-4 h-4" />
                            Serahkan Barang
                        </Button>
                    </div>
                )}

                {canPickup && (
                    <div className="space-y-3">
                        <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                            <p className="text-sm text-cyan-800">
                                <strong>Barang sudah diserahkan!</strong> Konfirmasi bahwa Anda telah menerima barang dari Admin Gudang.
                            </p>
                        </div>
                        <Button
                            onClick={() => setShowPickupConfirm(true)}
                            disabled={processing}
                            className="flex items-center gap-2 !bg-emerald-600 hover:!bg-emerald-700"
                        >
                            <PackageOpen className="w-4 h-4" />
                            Konfirmasi Penerimaan Barang
                        </Button>
                    </div>
                )}
            </div>

            <ConfirmDialog
                open={showIssueConfirm}
                onClose={() => setShowIssueConfirm(false)}
                onConfirm={handleIssue}
                title="Setujui Pengeluaran Barang?"
                message={`Pengeluaran barang untuk pengajuan "${outbound.document_number}" akan disetujui. Stok akan berkurang sesuai jumlah yang disetujui.`}
                processing={processing}
            />

            <ConfirmDialog
                open={showHandoverConfirm}
                onClose={() => setShowHandoverConfirm(false)}
                onConfirm={handleHandover}
                title="Serahkan Barang ke Pemohon?"
                message={`Anda mengkonfirmasi bahwa barang untuk pengajuan "${outbound.document_number}" telah diserahkan ke pemohon. Pemohon harus mengkonfirmasi penerimaan untuk menyelesaikan transaksi.`}
                processing={processing}
            />

            <ConfirmDialog
                open={showPickupConfirm}
                onClose={() => setShowPickupConfirm(false)}
                onConfirm={handlePickup}
                title="Konfirmasi Penerimaan Barang?"
                message={`Anda mengkonfirmasi bahwa barang untuk pengajuan "${outbound.document_number}" sudah diterima. Transaksi akan dianggap selesai.`}
                processing={processing}
            />
        </>
    );
}

/** Form untuk penyelia menyesuaikan jumlah yang disetujui per item. */
function ApproveQuantityForm({ details, quantities, onUpdateQty, onSubmit, onCancel, processing }: {
    details: OutboundTransactionDetail[];
    quantities: Record<number, number>;
    onUpdateQty: (detailId: number, value: number, max: number) => void;
    onSubmit: () => void;
    onCancel: () => void;
    processing: boolean;
}) {
    const allZero = details.every(d => (quantities[d.id] ?? 0) === 0);

    return (
        <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                    Sesuaikan jumlah yang disetujui per item. Jumlah tidak boleh melebihi jumlah yang diminta.
                </p>
            </div>

            <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
                {details.map((detail) => (
                    <div key={detail.id} className="flex items-center gap-4 px-4 py-3 bg-white">
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {detail.item?.name ?? '-'}
                            </p>
                            <p className="text-xs text-gray-400">
                                Diminta: {detail.quantity_requested} {detail.item?.unit_of_measure}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-xs text-gray-500 whitespace-nowrap">Disetujui:</label>
                            <input
                                type="number"
                                min={0}
                                max={detail.quantity_requested}
                                value={quantities[detail.id] ?? 0}
                                onChange={(e) => onUpdateQty(detail.id, Number(e.target.value), detail.quantity_requested)}
                                className="w-20 px-2.5 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 text-right"
                            />
                            <span className="text-xs text-gray-400 w-8">{detail.item?.unit_of_measure}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-3">
                <Button
                    onClick={onSubmit}
                    disabled={processing || allZero}
                    className="flex items-center gap-2 !bg-green-600 hover:!bg-green-700"
                >
                    <CheckCircle className="w-4 h-4" />
                    {processing ? 'Memproses...' : 'Setujui dengan Jumlah Ini'}
                </Button>
                <button
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                >
                    Batal
                </button>
            </div>

            {allZero && (
                <p className="text-xs text-amber-600">
                    Semua jumlah 0 — gunakan tombol "Tolak" jika ingin menolak pengajuan.
                </p>
            )}
        </div>
    );
}
