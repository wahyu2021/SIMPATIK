import { InputHTMLAttributes } from 'react';
import { Search } from 'lucide-react';

/**
 * Props untuk komponen SearchInput.
 * @property onSearch - Callback dipanggil setiap kali user mengetik di field pencarian
 * Extends semua props standar <input> kecuali type (sudah di-set ke 'search')
 */
interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    onSearch?: (value: string) => void;
}

/**
 * Komponen SearchInput — input pencarian dengan icon kaca pembesar bawaan.
 *
 * @example
 * <SearchInput
 *     placeholder="Cari barang..."
 *     onSearch={(val) => router.get('/items', { search: val }, { preserveState: true })}
 * />
 */
export default function SearchInput({ onSearch, className = '', ...props }: SearchInputProps) {
    return (
        <div className="relative">
            {/* Icon */}
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
                type="search"
                className={`
                    w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600
                    placeholder:text-gray-400 text-sm transition-colors
                    ${className}
                `}
                onChange={(e) => onSearch?.(e.target.value)}
                {...props}
            />
        </div>
    );
}
