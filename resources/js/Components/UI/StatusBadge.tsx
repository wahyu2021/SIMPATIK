import { Clock, CheckCircle, PackageSearch, XCircle, PackageOpen, CircleCheckBig, Send, LucideIcon } from 'lucide-react';
import Badge from './Badge';
import { OutboundStatus } from '../../Types';

/**
 * Props untuk komponen StatusBadge.
 * @property status - Status pengajuan: 'Pending' | 'Approved' | 'Issued' | 'Handed Over' | 'Rejected' | 'Completed'
 */
interface StatusBadgeProps {
    status: OutboundStatus;
}

/** Mapping status → label Indonesia, warna, dan icon */
const statusConfig: Record<OutboundStatus, {
    label: string;
    variant: 'pending' | 'success' | 'ready' | 'issued' | 'danger' | 'completed';
    icon: LucideIcon;
}> = {
    Pending:        { label: 'Menunggu',            variant: 'pending',   icon: Clock },
    Approved:       { label: 'Disetujui Penyelia', variant: 'success',   icon: CheckCircle },
    Issued:         { label: 'Disetujui Gudang',   variant: 'ready',     icon: PackageOpen },
    'Handed Over':  { label: 'Diserahkan',         variant: 'issued',    icon: Send },
    Rejected:       { label: 'Ditolak',            variant: 'danger',    icon: XCircle },
    Completed:      { label: 'Selesai',            variant: 'completed', icon: CircleCheckBig },
};

/**
 * Komponen StatusBadge — badge khusus untuk status pengajuan barang (Outbound Transaction).
 * Otomatis menampilkan label Indonesia, warna, dan icon sesuai status.
 *
 * @example
 * <StatusBadge status="Pending" />     // ⏳ Menunggu (oranye)
 * <StatusBadge status="Approved" />    // ✓ Disetujui (hijau)
 * <StatusBadge status="Issued" />      // 📦 Siap Diambil (cyan)
 * <StatusBadge status="Completed" />   // ✅ Selesai (emerald)
 * <StatusBadge status="Rejected" />    // ✕ Ditolak (merah)
 */
/**
 * Komponen: StatusBadge
 *
 * [State & Rendering]
 * Merupakan komponen presentasional atau kontainer dalam arsitektur React.
 * Lifecycle dikendalikan oleh Inertia (jika Page) atau parent props (jika Component).
 */
export default function StatusBadge({ status }: StatusBadgeProps) {
    const config = statusConfig[status];
    const Icon = config.icon;

    return (
        <Badge variant={config.variant} size="md">
            <Icon className="w-4 h-4 mr-1.5" />
            {config.label}
        </Badge>
    );
}
