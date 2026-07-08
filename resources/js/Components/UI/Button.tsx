import { ButtonHTMLAttributes } from 'react';

/**
 * Props untuk komponen Button.
 * @property variant - Style tombol: 'primary' (biru BSB), 'secondary' (abu), 'danger' (merah), 'link'
 * @property size - Ukuran: 'sm' | 'md' | 'lg'
 * Extends semua props standar <button> (onClick, disabled, type, dll)
 */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'link';
    size?: 'sm' | 'md' | 'lg';
}

/**
 * Komponen Button — tombol aksi dengan 4 varian warna dan 3 ukuran.
 * Otomatis disabled state (opacity + cursor) saat props disabled=true.
 *
 * @example
 * <Button variant="primary">Simpan</Button>
 * <Button variant="danger" size="sm" onClick={handleDelete}>Hapus</Button>
 * <Button disabled={processing}>{processing ? 'Menyimpan...' : 'Simpan'}</Button>
 */
/**
 * Komponen: Button
 *
 * [State & Rendering]
 * Merupakan komponen presentasional atau kontainer dalam arsitektur React.
 * Lifecycle dikendalikan oleh Inertia (jika Page) atau parent props (jika Component).
 */
export default function Button({
    variant = 'primary',
    size = 'md',
    className = '',
    children,
    ...props
}: ButtonProps) {
    const baseStyles = 'font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2';

    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm rounded',
        md: 'px-4 py-2 text-base rounded-lg',
        lg: 'px-6 py-3 text-lg rounded-lg',
    };

    const variants = {
        primary: 'bg-blue-800 hover:bg-blue-900 text-white focus:ring-blue-600',
        secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400',
        danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
        link: 'text-blue-800 hover:text-blue-900 underline',
    };

    const classList = `${baseStyles} ${sizeStyles[size]} ${variants[variant]} ${className}`;

    return (
        <button
            className={classList}
            {...props}
        >
            {children}
        </button>
    );
}
