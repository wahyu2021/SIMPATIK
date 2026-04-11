import Badge from './Badge';
import { OutboundStatus } from '../../Types';

interface StatusBadgeProps {
    status: OutboundStatus;
}

const statusConfig: Record<OutboundStatus, {
    label: string;
    variant: 'pending' | 'success' | 'issued' | 'danger';
    icon: string;
}> = {
    Pending: { label: 'Menunggu', variant: 'pending', icon: '⏳' },
    Approved: { label: 'Disetujui', variant: 'success', icon: '✓' },
    Issued: { label: 'Diserahkan', variant: 'issued', icon: '📦' },
    Rejected: { label: 'Ditolak', variant: 'danger', icon: '✕' },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
    const config = statusConfig[status];

    return (
        <Badge variant={config.variant} size="md">
            <span className="mr-1">{config.icon}</span>
            {config.label}
        </Badge>
    );
}
