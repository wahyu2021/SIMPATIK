import { X } from 'lucide-react';

/**
 * Props untuk komponen Modal.
 * @property open - Tampilkan/sembunyikan modal
 * @property onClose - Callback saat modal ditutup (klik backdrop atau tombol X)
 * @property title - Judul di header modal
 * @property children - Isi/body modal
 * @property footer - Area tombol di bawah modal (opsional)
 * @property size - Lebar modal: 'sm' | 'md' | 'lg' (default: 'md')
 */
interface ModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
}

/**
 * Komponen Modal — dialog popup umum dengan backdrop blur.
 * Untuk konfirmasi hapus, gunakan ConfirmDialog sebagai gantinya.
 *
 * @example
 * <Modal open={showModal} onClose={() => setShowModal(false)} title="Detail Barang">
 *     <p>Isi modal</p>
 * </Modal>
 */
/**
 * Komponen: Modal
 *
 * [State & Rendering]
 * Merupakan komponen presentasional atau kontainer dalam arsitektur React.
 * Lifecycle dikendalikan oleh Inertia (jika Page) atau parent props (jika Component).
 */
export default function Modal({ open, onClose, title, children, footer, size = 'md' }: ModalProps) {
    if (!open) return null;

    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-2xl',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Panel */}
            <div className={`relative w-full ${sizes[size]} mx-4 bg-white rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200`}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-4">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
