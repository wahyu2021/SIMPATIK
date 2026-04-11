import { Clock, CheckCircle, PackageSearch, XCircle, LucideIcon } from 'lucide-react';
import Badge from './Badge';
import { OutboundStatus } from '../../Types';

/**
 * Props untuk komponen StatusBadge.
 * @property status - Status pengajuan: 'Pending' | 'Approved' | 'Issued' | 'Rejected'
 */
interface StatusBadgeProps {
    status: OutboundStatus;
}

/** Mapping status → label Indonesia, warna, dan icon */
const statusConfig: Record<OutboundStatus, {
    label: string;
    variant: 'pending' | 'success' | 'issued' | 'danger';
    icon: LucideIcon;
}> = {
    Pending: { label: 'Menunggu', variant: 'pending', icon: Clock },
    Approved: { label: 'Disetujui', variant: 'success', icon: CheckCircle },
    Issued: { label: 'Diserahkan', variant: 'issued', icon: PackageSearch },
    Rejected: { label: 'Ditolak', variant: 'danger', icon: XCircle },
};

/**
 * Komponen StatusBadge — badge khusus untuk status pengajuan barang (Outbound Transaction).
 * Otomatis menampilkan label Indonesia, warna, dan icon sesuai status.
 *
 * @example
 * <StatusBadge status="Pending" />    // ⏳ Menunggu (oranye)
 * <StatusBadge status="Approved" />   // ✓ Disetujui (hijau)
 * <StatusBadge status="Issued" />     // 📦 Diserahkan (indigo)
 * <StatusBadge status="Rejected" />   // ✕ Ditolak (merah)
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
