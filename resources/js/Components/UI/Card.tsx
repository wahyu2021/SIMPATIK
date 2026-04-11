/**
 * Props untuk komponen Card.
 * @property title - Judul card (opsional)
 * @property description - Sub-judul card (opsional)
 * @property children - Isi/body card
 * @property footer - Konten footer, misal tombol aksi (opsional)
 * @property noPadding - Hilangkan padding body, berguna saat isi card adalah tabel
 */
interface CardProps {
    title?: string;
    description?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
    noPadding?: boolean;
}

/**
 * Komponen Card — container putih dengan border, header, dan footer opsional.
 *
 * @example
 * // Card biasa
 * <Card title="Informasi Barang"><p>Konten</p></Card>
 *
 * // Card untuk tabel (tanpa padding)
 * <Card title="Daftar Barang" noPadding><DataTable ... /></Card>
 */
export default function Card({ title, description, children, footer, className = '', noPadding = false }: CardProps) {
    return (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}>
            {/* Header */}
            {(title || description) && (
                <div className="px-6 py-4 border-b border-gray-100">
                    {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
                    {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
                </div>
            )}

            {/* Body */}
            <div className={noPadding ? '' : 'p-6'}>
                {children}
            </div>

            {/* Footer */}
            {footer && (
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                    {footer}
                </div>
            )}
        </div>
    );
}
