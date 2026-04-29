import { Construction } from 'lucide-react';

interface Props {
    title: string;
    description?: string;
}

/**
 * Komponen ComingSoon — placeholder untuk halaman yang belum selesai dikembangkan.
 */
export default function ComingSoon({ title, description }: Props) {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mb-6">
                <Construction className="w-10 h-10 text-amber-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
            <p className="text-gray-500 max-w-md">
                {description || 'Halaman ini sedang dalam tahap pengembangan dan akan segera tersedia.'}
            </p>
            <span className="mt-4 inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold tracking-wide uppercase">
                Coming Soon
            </span>
        </div>
    );
}
