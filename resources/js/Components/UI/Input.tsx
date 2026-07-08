import { InputHTMLAttributes } from 'react';

/**
 * Props untuk komponen Input.
 * @property error - Pesan error validasi (ditampilkan merah di bawah field)
 * @property label - Label di atas input (opsional, otomatis tampil tanda * jika required)
 * Extends semua props standar <input> (type, placeholder, value, onChange, dll)
 */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    label?: string;
}

/**
 * Komponen Input — input teks dengan label dan error handling bawaan.
 *
 * @example
 * <Input
 *     label="Nama Barang"
 *     value={data.name}
 *     onChange={(e) => setData('name', e.target.value)}
 *     error={errors.name}
 *     required
 * />
 */
/**
 * Komponen: Input
 *
 * [State & Rendering]
 * Merupakan komponen presentasional atau kontainer dalam arsitektur React.
 * Lifecycle dikendalikan oleh Inertia (jika Page) atau parent props (jika Component).
 */
export default function Input({ error, label, className = '', ...props }: InputProps) {
    const classList = `
        w-full px-3 py-2 border rounded-lg
        focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600
        disabled:bg-gray-100 disabled:cursor-not-allowed
        transition-colors
        ${error ? 'border-red-500' : 'border-gray-300'}
        ${className}
    `;

    return (
        <div>
            {label && (
                <label 
                    htmlFor={props.id}
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    {label}
                    {props.required && <span className="text-red-500">*</span>}
                </label>
            )}
            <input
                {...props}
                className={classList}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
