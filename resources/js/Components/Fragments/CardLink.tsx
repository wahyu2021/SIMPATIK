import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

/**
 * Props untuk komponen CardLink.
 * @property href - URL tujuan
 * @property children - Teks link
 */
interface CardLinkProps {
    href: string;
    children: React.ReactNode;
}

/**
 * Komponen CardLink — link navigasi di bagian bawah Card.
 * Menampilkan teks + icon panah kanan dengan warna BSB Blue.
 *
 * @example
 * <Card title="Pengajuan Terbaru" noPadding>
 *     ...
 *     <CardLink href="/outbound">Lihat semua pengajuan</CardLink>
 * </Card>
 */
export default function CardLink({ href, children }: CardLinkProps) {
    return (
        <div className="px-6 py-3">
            <Link
                href={href}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0052A3] hover:text-[#003366] transition-colors"
            >
                {children}
                <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
    );
}
