import { ArrowLeft } from 'lucide-react';

/**
 * Props untuk komponen PageHeader.
 * @property title - Judul halaman (h1)
 * @property description - Sub-judul/deskripsi halaman (opsional)
 * @property action - Elemen di sisi kanan, biasanya tombol "Tambah" (opsional)
 * @property backUrl - URL untuk tombol kembali (opsional, tampilkan panah ←)
 */
interface PageHeaderProps {
    title: string;
    description?: string;
    action?: React.ReactNode;
    backUrl?: string;
}

/**
 * Komponen PageHeader — header konsisten di setiap halaman.
 * Menyediakan judul, deskripsi, tombol aksi, dan tombol kembali.
 *
 * @example
 * // Halaman daftar
 * <PageHeader title="Kategori" action={<Button>+ Tambah</Button>} />
 *
 * // Halaman form (dengan back button)
 * <PageHeader title="Edit Kategori" backUrl="/categories" />
 */
export default function PageHeader({ title, description, action, backUrl }: PageHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                {backUrl && (
                    <a
                        href={backUrl}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </a>
                )}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                    {description && (
                        <p className="text-sm text-gray-500 mt-0.5">{description}</p>
                    )}
                </div>
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}
