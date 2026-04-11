import Button from './Button';

interface ConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'primary';
    processing?: boolean;
}

export default function ConfirmDialog({
    open,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Ya, Lanjutkan',
    cancelText = 'Batal',
    variant = 'danger',
    processing = false,
}: ConfirmDialogProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-sm mx-4 bg-white rounded-xl shadow-2xl p-6">
                {/* Icon */}
                <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                    variant === 'danger' ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                    <span className="text-2xl">{variant === 'danger' ? '⚠' : '❓'}</span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">{title}</h3>
                <p className="text-sm text-gray-600 text-center mb-6">{message}</p>

                <div className="flex gap-3">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        disabled={processing}
                        className="flex-1"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={variant === 'danger' ? 'danger' : 'primary'}
                        onClick={onConfirm}
                        disabled={processing}
                        className="flex-1"
                    >
                        {processing ? 'Memproses...' : confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
}
