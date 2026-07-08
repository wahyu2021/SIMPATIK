import { ReactNode } from 'react';
import { type LucideIcon } from 'lucide-react';

interface InfoFieldProps {
    label: string;
    children: ReactNode;
    className?: string;
    mono?: boolean;
    labelClassName?: string;
    icon?: LucideIcon;
}

/** Field info reusable (dt/dd) untuk halaman detail transaksi. */
/**
 * Komponen: InfoField
 *
 * [State & Rendering]
 * Merupakan komponen presentasional atau kontainer dalam arsitektur React.
 * Lifecycle dikendalikan oleh Inertia (jika Page) atau parent props (jika Component).
 */
export default function InfoField({ label, children, className = '', mono, labelClassName, icon: Icon }: InfoFieldProps) {
    return (
        <div className={className}>
            <dt className={`text-sm font-medium flex items-center gap-1.5 ${labelClassName ?? 'text-gray-500'}`}>
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {label}
            </dt>
            <dd className={`mt-1 text-sm text-gray-900 ${mono ? 'font-mono font-semibold' : ''}`}>
                {children}
            </dd>
        </div>
    );
}
