import { useState } from 'react';
import { router } from '@inertiajs/react';
import { CheckCircle, XCircle, PackageCheck, PackageOpen } from 'lucide-react';
import { OutboundTransaction } from '../../../Types';
import { Button, ConfirmDialog, Textarea } from '../../UI';

interface OutboundActionsProps {
    outbound: OutboundTransaction;
    canApprove: boolean;
    canIssue: boolean;
    canPickup: boolean;
}

/** Panel tindakan pengajuan — approve/reject (Penyelia), issue (Admin Gudang), pickup (Pemohon). */
export default function OutboundActions({ outbound, canApprove, canIssue, canPickup }: OutboundActionsProps) {
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [processing, setProcessing] = useState(false);
    const [showIssueConfirm, setShowIssueConfirm] = useState(false);
    const [showPickupConfirm, setShowPickupConfirm] = useState(false);

    const handleApprove = () => {
        setProcessing(true);
        router.post(`/outbound/${outbound.id}/approve`, {}, {
            onFinish: () => setProcessing(false),
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

    const handlePickup = () => {
        setProcessing(true);
        router.post(`/outbound/${outbound.id}/pickup`, {}, {
            onFinish: () => {
                setProcessing(false);
                setShowPickupConfirm(false);
            },
        });
    };

    if (!canApprove && !canIssue && !canPickup) return null;

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Tindakan</h2>

                {canApprove && !showRejectForm && (
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={handleApprove}
                            disabled={processing}
                            className="flex items-center gap-2 !bg-green-600 hover:!bg-green-700"
                        >
                            <CheckCircle className="w-4 h-4" />
                            {processing ? 'Memproses...' : 'Setujui Pengajuan'}
                        </Button>
                        <button
                            onClick={() => setShowRejectForm(true)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        >
                            <XCircle className="w-4 h-4" />
                            Tolak
                        </button>
                    </div>
                )}

                {canApprove && showRejectForm && (
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

                {canIssue && (
                    <Button
                        onClick={() => setShowIssueConfirm(true)}
                        disabled={processing}
                        className="flex items-center gap-2"
                    >
                        <PackageCheck className="w-4 h-4" />
                        Setujui Pengeluaran Barang
                    </Button>
                )}

                {canPickup && (
                    <div className="space-y-3">
                        <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                            <p className="text-sm text-cyan-800">
                                <strong>Barang sudah siap!</strong> Silakan ambil barang Anda di gudang, lalu konfirmasi pengambilan di bawah.
                            </p>
                        </div>
                        <Button
                            onClick={() => setShowPickupConfirm(true)}
                            disabled={processing}
                            className="flex items-center gap-2 !bg-emerald-600 hover:!bg-emerald-700"
                        >
                            <PackageOpen className="w-4 h-4" />
                            Konfirmasi Pengambilan Barang
                        </Button>
                    </div>
                )}
            </div>

            <ConfirmDialog
                open={showIssueConfirm}
                onClose={() => setShowIssueConfirm(false)}
                onConfirm={handleIssue}
                title="Setujui Pengeluaran Barang?"
                message={`Pengeluaran barang untuk pengajuan "${outbound.document_number}" akan disetujui. Stok akan berkurang sesuai jumlah yang disetujui dan barang akan menunggu diambil oleh pemohon.`}
                processing={processing}
            />

            <ConfirmDialog
                open={showPickupConfirm}
                onClose={() => setShowPickupConfirm(false)}
                onConfirm={handlePickup}
                title="Konfirmasi Pengambilan Barang?"
                message={`Anda mengkonfirmasi bahwa barang untuk pengajuan "${outbound.document_number}" sudah diambil. Transaksi akan dianggap selesai.`}
                processing={processing}
            />
        </>
    );
}
