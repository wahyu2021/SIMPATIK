interface AlertProps {
    type?: 'success' | 'error' | 'warning' | 'info';
    children: React.ReactNode;
    onClose?: () => void;
    className?: string;
}

export default function Alert({ type = 'info', children, onClose, className = '' }: AlertProps) {
    const styles = {
        success: 'bg-emerald-50 border-emerald-300 text-emerald-800',
        error: 'bg-red-50 border-red-300 text-red-800',
        warning: 'bg-amber-50 border-amber-300 text-amber-800',
        info: 'bg-blue-50 border-blue-300 text-blue-800',
    };

    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ',
    };

    return (
        <div className={`flex items-center gap-3 px-4 py-3 border rounded-lg ${styles[type]} ${className}`}>
            <span className="text-lg font-bold shrink-0">{icons[type]}</span>
            <span className="text-sm flex-1">{children}</span>
            {onClose && (
                <button
                    onClick={onClose}
                    className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
                    aria-label="Close"
                >
                    ✕
                </button>
            )}
        </div>
    );
}
