import { Link } from '@inertiajs/react';

type TabKey = 'saldistat' | 'ledger' | 'reconciliation';

const TABS: { key: TabKey; label: string; href: string }[] = [
    { key: 'saldistat', label: 'Saldistat ATK', href: '/reports' },
    { key: 'ledger', label: 'Kartu Mutasi', href: '/reports/stock-ledger' },
    { key: 'reconciliation', label: 'Rekonsiliasi', href: '/reports/reconciliation' },
];

interface Props {
    active: TabKey;
}

/** Tab navigasi modul laporan — dipakai di semua 3 halaman report. */
export default function ReportTabs({ active }: Props) {
    const activeClass = 'px-4 py-2 text-sm font-medium text-white bg-[#003366] rounded-md shadow-sm';
    const inactiveClass = 'px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-white/60 transition-colors';

    return (
        <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
            {TABS.map((tab) =>
                tab.key === active ? (
                    <span key={tab.key} className={activeClass}>{tab.label}</span>
                ) : (
                    <Link key={tab.key} href={tab.href} className={inactiveClass}>{tab.label}</Link>
                )
            )}
        </div>
    );
}

export type { TabKey };
