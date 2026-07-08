/**
 * Props untuk komponen Loading.
 * @property size - Ukuran spinner: 'sm' | 'md' | 'lg'
 * @property text - Teks di bawah spinner (opsional)
 * @property fullPage - Jika true, tampilkan overlay loading seluruh layar
 */
interface LoadingProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
    fullPage?: boolean;
}

/**
 * Komponen Loading — spinner animasi untuk loading state.
 *
 * @example
 * // Inline loading
 * <Loading text="Memuat data..." />
 *
 * // Full page overlay (saat submit form)
 * <Loading fullPage text="Menyimpan..." />
 */
/**
 * Komponen: Loading
 *
 * [State & Rendering]
 * Merupakan komponen presentasional atau kontainer dalam arsitektur React.
 * Lifecycle dikendalikan oleh Inertia (jika Page) atau parent props (jika Component).
 */
export default function Loading({ size = 'md', text, fullPage = false }: LoadingProps) {
    const sizes = {
        sm: 'w-5 h-5 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4',
    };

    const spinner = (
        <div className="flex flex-col items-center justify-center gap-3">
            <div
                className={`${sizes[size]} border-gray-200 border-t-[#0052A3] rounded-full animate-spin`}
            />
            {text && <p className="text-sm text-gray-500">{text}</p>}
        </div>
    );

    if (fullPage) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                {spinner}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center py-12">
            {spinner}
        </div>
    );
}
