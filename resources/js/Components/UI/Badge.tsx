/**
 * Props untuk komponen Badge.
 * @property variant - Varian warna: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'pending' | 'issued'
 * @property size - Ukuran badge: 'sm' (kecil) | 'md' (sedang)
 * @property children - Teks yang ditampilkan
 */
interface BadgeProps {
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'pending' | 'issued';
    size?: 'sm' | 'md';
    children: React.ReactNode;
    className?: string;
}

/**
 * Komponen Badge — label kecil berwarna untuk status atau info ringkas.
 *
 * @example
 * <Badge variant="success">Aktif</Badge>
 * <Badge variant="danger">Nonaktif</Badge>
 * <Badge variant="info" size="md">15 barang</Badge>
 */
export default function Badge({ variant = 'default', size = 'sm', children, className = '' }: BadgeProps) {
    const variants = {
        default: 'bg-gray-100 text-gray-700',
        success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
        warning: 'bg-amber-50 text-amber-700 border border-amber-200',
        danger: 'bg-red-50 text-red-700 border border-red-200',
        info: 'bg-blue-50 text-blue-700 border border-blue-200',
        pending: 'bg-orange-50 text-orange-600 border border-orange-200',
        issued: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
    };

    return (
        <span className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`}>
            {children}
        </span>
    );
}
