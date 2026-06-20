import { OutboundTransaction, User } from '../../../Types';
import { formatDateLong, formatDateTime } from '../../../Lib/formatters';
import { CheckCircle } from 'lucide-react';

interface OutboundSignaturesProps {
    outbound: OutboundTransaction;
}

interface SignatureSlot {
    label: string;
    user?: User;
    date?: string;
}

/**
 * Panel tanda tangan digital — menampilkan TTD pihak-pihak yang terlibat
 * dalam alur pengajuan (Pemohon, Penyelia, Admin Gudang, Penerima).
 * Slot kosong ditampilkan sebagai placeholder "Menunggu".
 */
export default function OutboundSignatures({ outbound }: OutboundSignaturesProps) {
    const slots: SignatureSlot[] = [
        {
            label: 'Pemohon',
            user: outbound.requester,
            date: outbound.created_at,
        },
        {
            label: outbound.status === 'Rejected' ? 'Ditolak Oleh' : 'Penyelia',
            user: outbound.approver,
            date: outbound.approved_at,
        },
        {
            label: 'Admin Gudang',
            user: outbound.issued_by_user,
            date: outbound.issued_at,
        },
        {
            label: 'Diserahkan Oleh',
            user: outbound.handed_over_by_user,
            date: outbound.handed_over_at,
        },
        {
            label: 'Penerima',
            user: outbound.picked_up_by_user,
            date: outbound.picked_up_at,
        },
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Tanda Tangan</h2>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {slots.map((slot, i) => (
                    <SignatureCard key={i} {...slot} />
                ))}
            </div>
        </div>
    );
}

/** Card satu slot tanda tangan. */
function SignatureCard({ label, user, date }: SignatureSlot) {
    const hasSigned = !!user;

    return (
        <div className={`flex flex-col items-center p-4 rounded-lg border ${
            hasSigned
                ? 'border-green-200 bg-green-50/30'
                : 'border-dashed border-gray-200 bg-gray-50/50'
        }`}>
            <div className="w-full h-16 flex items-center justify-center mb-2">
                {hasSigned ? (
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-green-700 bg-green-100 px-3 py-1 rounded-full flex items-center gap-1 font-medium mb-1">
                            <CheckCircle className="w-3 h-3" /> Tervalidasi Elektronik
                        </span>
                        {date && (
                            <span className="text-[10px] text-gray-500 font-mono">
                                {formatDateTime(date)}
                            </span>
                        )}
                    </div>
                ) : (
                    <span className="text-xs text-gray-400 italic">Menunggu</span>
                )}
            </div>

            <div className="w-full border-t border-gray-200 pt-2 text-center">
                <p className="text-xs font-semibold text-gray-700">{label}</p>
                {hasSigned ? (
                    <>
                        <p className="text-xs text-gray-500 mt-0.5">{user.name}</p>
                        {date && (
                            <p className="text-[10px] text-gray-400 mt-0.5">{formatDateLong(date)}</p>
                        )}
                    </>
                ) : (
                    <p className="text-xs text-gray-400 mt-0.5">—</p>
                )}
            </div>
        </div>
    );
}
