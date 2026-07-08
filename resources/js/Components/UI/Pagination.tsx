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

    // --- LOGIKA PEMOTONGAN PINTAR (SMART TRUNCATION) ---
    const activeIndex = links.findIndex((l) => l.active);
    const lastIndex = links.length - 1;

    const filteredLinks = links.filter((link, index) => {
        if (index === 0 || index === lastIndex) return true; // Selalu simpan Prev & Next
        if (!link.url && isNaN(Number(link.label))) return false; // Buang ellipsis bawaan Laravel
        
        if (index === 1 || index === lastIndex - 1) return true; // Halaman Pertama & Terakhir
        if (Math.abs(index - activeIndex) <= 1) return true; // Halaman Aktif + 1 tetangga kiri/kanan

        return false;
    });

    const finalLinks: PaginationLink[] = [];
    filteredLinks.forEach((link, i) => {
        finalLinks.push(link);
        if (i < filteredLinks.length - 1) {
            const nextLink = filteredLinks[i + 1];
            // Ambil angka dari label (jaga-jaga jika ada spasi)
            const currentNum = parseInt(link.label);
            const nextNum = parseInt(nextLink.label);
            
            // Jika ada lompatan angka lebih dari 1, sisipkan ellipsis (...)
            if (!isNaN(currentNum) && !isNaN(nextNum) && nextNum - currentNum > 1) {
                finalLinks.push({ url: null, label: '...', active: false });
            }
        }
    });
    // ----------------------------------------------------

    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
            {/* Info */}
            <div className="text-sm text-gray-600 text-center md:text-left w-full md:w-auto">
                Menampilkan <span className="font-semibold text-gray-900">{from || 0}</span>
                {' - '}
                <span className="font-semibold text-gray-900">{to || 0}</span>
                {' dari '}
                <span className="font-semibold text-gray-900">{total || 0}</span> data
            </div>

            {/* Page Links */}
            <nav className="flex items-center justify-center gap-1.5 w-full md:w-auto">
                {finalLinks.map((link, index) => {
                    // Deteksi tombol Prev dan Next
                    const isFirst = index === 0;
                    const isLast = index === finalLinks.length - 1;
                    const isActive = link.active;
                    
                    // Logika Responsif:
                    // Tampilkan tombol Prev, Next, dan Halaman Aktif di semua layar.
                    // Sembunyikan angka lainnya di layar kecil, namun tampilkan di desktop (md).
                    const visibilityClass = (isFirst || isLast || isActive) 
                        ? 'inline-flex' 
                        : 'hidden md:inline-flex';

                    // Ikon Panah SVG
                    const LeftArrow = (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    );
                    const RightArrow = (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    );

                    // Jika tidak ada URL (misal: Prev di halaman pertama, atau simbol '...')
                    if (!link.url) {
                        return (
                            <span
                                key={index}
                                className={`px-3 py-2 text-sm text-gray-400 bg-gray-50 border border-gray-100 rounded-md cursor-not-allowed items-center justify-center gap-1.5 min-w-[2.5rem] text-center ${visibilityClass}`}
                            >
                                {isFirst && LeftArrow}
                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                {isLast && RightArrow}
                            </span>
                        );
                    }

                    // Tampilan (Styling) Tombol Aktif vs Tidak Aktif
                    const activeClasses = isActive
                        ? 'bg-[#0052A3] border-[#0052A3] text-white font-semibold shadow-sm'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200';

                    return (
                        <Link
                            key={index}
                            href={link.url}
                            className={`px-3 py-2 text-sm border rounded-md items-center justify-center gap-1.5 min-w-[2.5rem] text-center ${activeClasses} ${visibilityClass}`}
                        >
                            {isFirst && LeftArrow}
                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                            {isLast && RightArrow}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
