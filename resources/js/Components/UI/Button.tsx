import { ButtonHTMLAttributes } from 'react';

/**
 * Props untuk komponen Button.
 * @property variant - Style tombol: 'primary' (biru BSB), 'secondary' (abu), 'danger' (merah), 'link'
 * @property size - Ukuran: 'sm' | 'md' | 'lg'
 * Extends semua props standar <button> (onClick, disabled, type, dll)
 */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'link' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
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
    isLoading = false,
    disabled = false,
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
        outline: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-200',
    };

    const classList = `${baseStyles} ${sizeStyles[size]} ${variants[variant]} ${className}`;

    return (
        <button
            className={classList}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {children}
        </button>
    );
}
