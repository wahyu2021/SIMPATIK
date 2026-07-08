/**
 * Props untuk komponen ListItem.
 * @property title - Teks utama (baris pertama, font medium)
 * @property subtitle - Teks sekunder (baris kedua, font kecil abu)
 * @property trailing - Elemen di sisi kanan (Badge, StatusBadge, tombol, dll)
 * @property onClick - Callback klik (opsional, membuat baris clickable)
 */
interface ListItemProps {
    title: string;
    subtitle?: string;
    trailing?: React.ReactNode;
    onClick?: () => void;
    className?: string;
}

/**
 * Komponen ListItem — baris item list yang reusable.
 * Pattern: info kiri (title + subtitle) + trailing content kanan.
 * Bisa dipakai di Dashboard, Recent Activity, daftar notifikasi, dll.
 *
 * @example
 * <ListItem
 *     title="DOC-2026-001"
 *     subtitle="John Doe — Divisi IT"
 *     trailing={<StatusBadge status="Pending" />}
 * />
 */
/**
 * Komponen: ListItem
 *
 * [State & Rendering]
 * Merupakan komponen presentasional atau kontainer dalam arsitektur React.
 * Lifecycle dikendalikan oleh Inertia (jika Page) atau parent props (jika Component).
 */
export default function ListItem({ title, subtitle, trailing, onClick, className = '' }: ListItemProps) {
    const Component = onClick ? 'button' : 'div';

    return (
        <Component
            onClick={onClick}
            className={`
                flex items-center justify-between px-6 py-3.5
                hover:bg-gray-50/50 transition-colors w-full text-left
                ${onClick ? 'cursor-pointer' : ''}
                ${className}
            `}
        >
            <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
                {subtitle && (
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{subtitle}</p>
                )}
            </div>
            {trailing && (
                <div className="flex items-center gap-3 shrink-0 ml-4">
                    {trailing}
                </div>
            )}
        </Component>
    );
}
