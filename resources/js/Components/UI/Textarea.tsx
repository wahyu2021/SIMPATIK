import { TextareaHTMLAttributes } from 'react';

/**
 * Props untuk komponen Textarea.
 * @property error - Pesan error validasi (ditampilkan merah di bawah field)
 * @property label - Label di atas textarea (opsional, otomatis tampil tanda * jika required)
 * Extends semua props standar <textarea> (rows, placeholder, dll)
 */
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: string;
    label?: string;
}

/**
 * Komponen Textarea — input multi-baris dengan label dan error bawaan.
 * Pattern sama seperti komponen Input.
 *
 * @example
 * <Textarea
 *     label="Catatan"
 *     rows={3}
 *     value={data.notes}
 *     onChange={(e) => setData('notes', e.target.value)}
 *     error={errors.notes}
 *     placeholder="Tulis catatan pengajuan..."
 * />
 */
/**
 * Komponen: Textarea
 *
 * [State & Rendering]
 * Merupakan komponen presentasional atau kontainer dalam arsitektur React.
 * Lifecycle dikendalikan oleh Inertia (jika Page) atau parent props (jika Component).
 */
export default function Textarea({ error, label, className = '', ...props }: TextareaProps) {
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
            <textarea
                {...props}
                className={`
                    w-full px-3 py-2 border rounded-lg resize-y
                    focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600
                    disabled:bg-gray-100 disabled:cursor-not-allowed
                    transition-colors
                    ${error ? 'border-red-500' : 'border-gray-300'}
                    ${className}
                `}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
