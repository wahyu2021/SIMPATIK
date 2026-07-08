import { ClipboardList, LucideIcon } from 'lucide-react';

/**
 * Props untuk komponen EmptyState.
 * @property title - Judul pesan kosong (default: 'Belum Ada Data')
 * @property message - Deskripsi tambahan
 * @property icon - Komponen icon (default: ClipboardList)
 * @property action - Tombol aksi, misal "Tambah Data Baru"
 */
interface EmptyStateProps {
    title?: string;
    message?: string;
    icon?: LucideIcon;
    action?: React.ReactNode;
}

/**
 * Komponen EmptyState — tampilan saat tabel/halaman belum memiliki data.
 *
 * @example
 * import { FolderOpen } from 'lucide-react';
 * <EmptyState
 *     title="Belum Ada Kategori"
 *     message="Tambahkan kategori baru untuk memulai."
 *     icon={FolderOpen}
 *     action={<Link href="/categories/create"><Button>+ Tambah</Button></Link>}
 * />
 */
/**
 * Komponen: EmptyState
 *
 * [State & Rendering]
 * Merupakan komponen presentasional atau kontainer dalam arsitektur React.
 * Lifecycle dikendalikan oleh Inertia (jika Page) atau parent props (jika Component).
 */
export default function EmptyState({
    title = 'Belum Ada Data',
    message = 'Data belum tersedia saat ini.',
    icon: Icon = ClipboardList,
    action,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="bg-gray-100 p-4 rounded-full mb-4 text-gray-400">
                <Icon className="w-12 h-12" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-500 text-center max-w-sm mb-4">{message}</p>
            {action && <div>{action}</div>}
        </div>
    );
}
