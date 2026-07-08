import { Link } from '@inertiajs/react';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Definisi satu item breadcrumb.
 * @property label - Teks yang ditampilkan
 * @property href - URL tujuan (jika kosong = item aktif / halaman saat ini)
 */
export interface BreadcrumbItem {
    label: string;
    href?: string;
}

/**
 * Props untuk komponen Breadcrumbs.
 * @property items - Array breadcrumb dari parent → child
 */
interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

/**
 * Komponen Breadcrumbs — navigasi hierarki halaman.
 * Item terakhir otomatis ditampilkan sebagai teks aktif (tanpa link).
 *
 * @example
 * <Breadcrumbs items={[
 *     { label: 'Barang', href: '/items' },
 *     { label: 'Tambah Barang' },
 * ]} />
 */
/**
 * Komponen: Breadcrumbs
 *
 * [State & Rendering]
 * Merupakan komponen presentasional atau kontainer dalam arsitektur React.
 * Lifecycle dikendalikan oleh Inertia (jika Page) atau parent props (jika Component).
 */
export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-1.5 text-sm">
                {/* Home */}
                <li>
                    <Link
                        href="/dashboard"
                        className="text-gray-400 hover:text-[#0052A3] transition-colors"
                    >
                        <Home className="w-4 h-4" />
                    </Link>
                </li>

                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <li key={index} className="flex items-center gap-1.5">
                            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                            {isLast || !item.href ? (
                                <span className="font-medium text-gray-700">
                                    {item.label}
                                </span>
                            ) : (
                                <Link
                                    href={item.href}
                                    className="text-gray-400 hover:text-[#0052A3] transition-colors"
                                >
                                    {item.label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
