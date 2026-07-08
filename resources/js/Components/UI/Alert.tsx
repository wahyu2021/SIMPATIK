import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

/**
 * Props untuk komponen Alert.
 * @property type - Jenis alert: 'success' | 'error' | 'warning' | 'info'
 * @property children - Isi pesan alert
 * @property onClose - Callback saat tombol close diklik (opsional, menampilkan tombol X)
 * @property className - Custom CSS class tambahan
 */
interface AlertProps {
    type?: 'success' | 'error' | 'warning' | 'info';
    children: React.ReactNode;
    onClose?: () => void;
    className?: string;
}

/**
 * Komponen Alert — menampilkan pesan notifikasi/flash message.
 *
 * @example
 * // Flash message dari Laravel controller
 * {flash?.success && <Alert type="success">{flash.success}</Alert>}
 *
 * // Dengan tombol close
 * <Alert type="warning" onClose={() => setShow(false)}>Stok hampir habis!</Alert>
 */
/**
 * Komponen: Alert
 *
 * [State & Rendering]
 * Merupakan komponen presentasional atau kontainer dalam arsitektur React.
 * Lifecycle dikendalikan oleh Inertia (jika Page) atau parent props (jika Component).
 */
export default function Alert({ type = 'info', children, onClose, className = '' }: AlertProps) {
    const styles = {
        success: 'bg-emerald-50 border-emerald-300 text-emerald-800',
        error: 'bg-red-50 border-red-300 text-red-800',
        warning: 'bg-amber-50 border-amber-300 text-amber-800',
        info: 'bg-blue-50 border-blue-300 text-blue-800',
    };

    const icons = {
        success: CheckCircle,
        error: XCircle,
        warning: AlertTriangle,
        info: Info,
    };

    const Icon = icons[type];

    return (
        <div className={`flex items-center gap-3 px-4 py-3 border rounded-lg ${styles[type]} ${className}`}>
            <Icon className="w-5 h-5 shrink-0" />
            <span className="text-sm flex-1">{children}</span>
            {onClose && (
                <button
                    onClick={onClose}
                    className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
                    aria-label="Close"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}
