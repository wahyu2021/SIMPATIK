import { ReactNode } from 'react';

interface InfoFieldProps {
    label: string;
    children: ReactNode;
    className?: string;
    mono?: boolean;
    labelClassName?: string;
}

/** Field info reusable (dt/dd) untuk halaman detail transaksi. */
export default function InfoField({ label, children, className = '', mono, labelClassName }: InfoFieldProps) {
    return (
        <div className={className}>
            <dt className={`text-sm font-medium ${labelClassName ?? 'text-gray-500'}`}>{label}</dt>
            <dd className={`mt-1 text-sm text-gray-900 ${mono ? 'font-mono font-semibold' : ''}`}>
                {children}
            </dd>
        </div>
    );
}
