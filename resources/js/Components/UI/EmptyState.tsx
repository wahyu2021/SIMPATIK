interface EmptyStateProps {
    title?: string;
    message?: string;
    icon?: string;
    action?: React.ReactNode;
}

export default function EmptyState({
    title = 'Belum Ada Data',
    message = 'Data belum tersedia saat ini.',
    icon = '📋',
    action,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <span className="text-5xl mb-4">{icon}</span>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-500 text-center max-w-sm mb-4">{message}</p>
            {action && <div>{action}</div>}
        </div>
    );
}
