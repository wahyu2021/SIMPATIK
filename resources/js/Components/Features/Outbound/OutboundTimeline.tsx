import { Clock, CheckCircle, XCircle, PackageCheck, PackageOpen, FileText, Send } from 'lucide-react';
import { OutboundTransaction } from '../../../Types';
import { formatDateTime } from '../../../Lib/formatters';

interface TimelineEvent {
    icon: React.ReactNode;
    iconBg: string;
    title: string;
    actor?: string;
    timestamp?: string;
    detail?: string;
    variant?: 'danger' | 'default';
}

/**
 * Timeline kronologis aktivitas pengajuan barang.
 *
 * Membangun daftar event dari timestamp yang ada di data outbound:
 * created_at → approved_at → issued_at → handed_over_at → picked_up_at.
 * Jika status belum final, menampilkan indikator "menunggu" dengan animasi pulse.
 */
export default function OutboundTimeline({ outbound }: { outbound: OutboundTransaction }) {
    const events = buildTimelineEvents(outbound);

    return (
        <div className="relative">
            {events.map((event, idx) => {
                const isLast = idx === events.length - 1;
                const isWaiting = !event.timestamp;

                return (
                    <div key={idx} className="flex gap-4">
                        <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${event.iconBg} ${isWaiting ? 'ring-4 ring-amber-100 animate-pulse' : 'shadow-sm'}`}>
                                {event.icon}
                            </div>
                            {!isLast && (
                                <div className="w-0.5 flex-1 min-h-[24px] bg-gray-200" />
                            )}
                        </div>

                        <div className={isLast ? 'pb-0' : 'pb-6'}>
                            <p className={`text-sm font-semibold ${isWaiting ? 'text-amber-600' : 'text-gray-900'}`}>
                                {event.title}
                            </p>
                            {event.actor && (
                                <p className="text-xs text-gray-500 mt-0.5">
                                    oleh <span className="font-medium text-gray-700">{event.actor}</span>
                                </p>
                            )}
                            {event.timestamp && (
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {formatDateTime(event.timestamp)}
                                </p>
                            )}
                            {event.detail && (
                                <p className={`text-xs mt-1 px-2.5 py-1.5 rounded-md inline-block ${
                                    event.variant === 'danger' ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-500'
                                }`}>
                                    {event.detail}
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

/** Bangun daftar event kronologis dari data transaksi. */
function buildTimelineEvents(outbound: OutboundTransaction): TimelineEvent[] {
    const events: TimelineEvent[] = [];

    events.push({
        icon: <FileText className="w-4 h-4 text-white" />,
        iconBg: 'bg-blue-500',
        title: 'Pengajuan Dibuat',
        actor: outbound.requester?.name ?? '-',
        timestamp: outbound.created_at,
        detail: outbound.is_special_request ? 'Pesanan khusus' : undefined,
    });

    if (outbound.approved_at && outbound.approver) {
        const isRejected = outbound.status === 'Rejected';
        events.push({
            icon: isRejected
                ? <XCircle className="w-4 h-4 text-white" />
                : <CheckCircle className="w-4 h-4 text-white" />,
            iconBg: isRejected ? 'bg-red-500' : 'bg-green-500',
            title: isRejected ? 'Pengajuan Ditolak' : 'Disetujui Penyelia',
            actor: outbound.approver.name,
            timestamp: outbound.approved_at,
            detail: isRejected ? outbound.rejection_reason ?? undefined : undefined,
            variant: isRejected ? 'danger' : 'default',
        });
    }

    if (outbound.issued_at && outbound.issued_by_user) {
        events.push({
            icon: <PackageCheck className="w-4 h-4 text-white" />,
            iconBg: 'bg-cyan-500',
            title: 'Barang Dikeluarkan',
            actor: outbound.issued_by_user.name,
            timestamp: outbound.issued_at,
            detail: 'Stok berkurang, barang siap diserahkan',
        });
    }

    if (outbound.handed_over_at && outbound.handed_over_by_user) {
        events.push({
            icon: <Send className="w-4 h-4 text-white" />,
            iconBg: 'bg-violet-500',
            title: 'Barang Diserahkan',
            actor: outbound.handed_over_by_user.name,
            timestamp: outbound.handed_over_at,
            detail: 'Menunggu konfirmasi penerimaan dari pemohon',
        });
    }

    if (outbound.picked_up_at && outbound.picked_up_by_user) {
        events.push({
            icon: <PackageOpen className="w-4 h-4 text-white" />,
            iconBg: 'bg-emerald-500',
            title: 'Barang Diterima',
            actor: outbound.picked_up_by_user.name,
            timestamp: outbound.picked_up_at,
            detail: 'Transaksi selesai',
        });
    }

    appendWaitingIndicator(events, outbound.status);

    return events;
}

/** Tambahkan indikator "menunggu" di akhir timeline jika status belum final. */
function appendWaitingIndicator(events: TimelineEvent[], status: string): void {
    const waitingMap: Record<string, { title: string; iconColor: string; ringColor: string }> = {
        'Pending':     { title: 'Menunggu Persetujuan Penyelia',         iconColor: 'text-amber-500',  ringColor: 'bg-amber-100'  },
        'Approved':    { title: 'Menunggu Pengeluaran Barang',           iconColor: 'text-amber-500',  ringColor: 'bg-amber-100'  },
        'Issued':      { title: 'Menunggu Penyerahan Barang',            iconColor: 'text-cyan-500',   ringColor: 'bg-cyan-100'   },
        'Handed Over': { title: 'Menunggu Konfirmasi Penerimaan Pemohon', iconColor: 'text-violet-500', ringColor: 'bg-violet-100' },
    };

    const config = waitingMap[status];
    if (!config) return;

    events.push({
        icon: <Clock className={`w-4 h-4 ${config.iconColor}`} />,
        iconBg: config.ringColor,
        title: config.title,
    });
}
