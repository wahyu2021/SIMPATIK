import { SelectHTMLAttributes } from 'react';

/**
 * Props untuk komponen Select.
 * @property error - Pesan error validasi (ditampilkan merah di bawah field)
 * @property children - Elemen <option> yang menjadi pilihan dropdown
 * Extends semua props standar <select> (value, onChange, disabled, dll)
 */
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    error?: string;
    children: React.ReactNode;
}

/**
 * Komponen Select — dropdown select dengan error handling.
 *
 * @example
 * <Select value={data.category_id} onChange={(e) => setData('category_id', e.target.value)} error={errors.category_id}>
 *     <option value="">-- Pilih Kategori --</option>
 *     {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
 * </Select>
 */
export default function Select({ error, className = '', children, ...props }: SelectProps) {
    const classList = `
        w-full px-3 py-2 border rounded-lg
        focus:outline-none focus:ring-2 focus:ring-blue-500
        disabled:bg-gray-100 disabled:cursor-not-allowed
        ${error ? 'border-red-500' : 'border-gray-300'}
        ${className}
    `;

    return (
        <div>
            <select
                {...props}
                className={classList}
            >
                {children}
            </select>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
