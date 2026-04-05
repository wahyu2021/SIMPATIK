import { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    error?: string;
    children: React.ReactNode;
}

export default function Select({ error, className = '', children, ...props }: SelectProps) {
    const classList = `
        w-full px-3 py-2 border rounded-lg
        focus:outline-none focus:ring-2 focus:ring-blue-500
        disabled:bg-gray-100 disabled:cursor-not-allowed
        ${error ? 'border-red-500' : 'border-gray-300'}
        ${className}
    `;

    return (
        <div>
            <select
                {...props}
                className={classList}
            >
                {children}
            </select>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
