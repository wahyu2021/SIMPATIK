/**
 * Props untuk komponen Label.
 * @property htmlFor - ID elemen form yang di-label
 * @property required - Tampilkan tanda bintang merah (*)
 * @property children - Teks label
 */
interface LabelProps {
    htmlFor?: string;
    required?: boolean;
    children: React.ReactNode;
}

/**
 * Komponen Label — label form field dengan tanda required opsional.
 *
 * @example
 * <Label htmlFor="name" required>Nama Barang</Label>
 */
export default function Label({ htmlFor, required = false, children }: LabelProps) {
    return (
        <label 
            htmlFor={htmlFor}
            className="block text-sm font-medium text-gray-700 mb-2"
        >
            {children}
            {required && <span className="text-red-500">*</span>}
        </label>
    );
}
