import { InputHTMLAttributes } from 'react';

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    onSearch?: (value: string) => void;
}

export default function SearchInput({ onSearch, className = '', ...props }: SearchInputProps) {
    return (
        <div className="relative">
            {/* Icon */}
            <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
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
