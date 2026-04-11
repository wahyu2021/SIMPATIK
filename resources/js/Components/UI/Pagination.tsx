import { Link } from '@inertiajs/react';
import { PaginationLink } from '../../Types';

/**
 * Props untuk komponen Pagination.
 * @property links - Array PaginationLink dari response Laravel paginate()
 * @property from - Nomor record awal di halaman ini
 * @property to - Nomor record akhir di halaman ini
 * @property total - Total seluruh record
 */
interface PaginationProps {
    links: PaginationLink[];
    from?: number;
    to?: number;
    total?: number;
}

/**
 * Komponen Pagination — navigasi halaman untuk data yang di-paginate.
 * Otomatis tersembunyi jika hanya 1 halaman.
 *
 * @example
 * <Pagination
 *     links={categories.links}
 *     from={categories.from}
 *     to={categories.to}
 *     total={categories.total}
 * />
 */
export default function Pagination({ links, from, to, total }: PaginationProps) {
    if (links.length <= 3) return null; // Hanya prev + 1 page + next = tidak perlu pagination

    return (
        <div className="flex items-center justify-between mt-4">
            {/* Info */}
            <p className="text-sm text-gray-600">
                Menampilkan <span className="font-medium">{from || 0}</span>
                {' - '}
                <span className="font-medium">{to || 0}</span>
                {' dari '}
                <span className="font-medium">{total || 0}</span> data
            </p>

            {/* Page Links */}
            <nav className="flex items-center gap-1">
                {links.map((link, index) => {
                    if (!link.url) {
                        return (
                            <span
                                key={index}
                                className="px-3 py-1.5 text-sm text-gray-400 rounded"
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        );
                    }

                    return (
                        <Link
                            key={index}
                            href={link.url}
                            className={`px-3 py-1.5 text-sm rounded transition-colors ${
                                link.active
                                    ? 'bg-[#0052A3] text-white font-medium'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                })}
            </nav>
        </div>
    );
}
