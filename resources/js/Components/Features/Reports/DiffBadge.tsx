import { formatNumber } from '../../../Lib/formatters';

interface Props {
    difference: number;
}

/** Tampilkan selisih stok — ✓ (cocok), +N (lebih), -N (kurang). Dipakai di Reconciliation. */
export default function DiffBadge({ difference }: Props) {
    if (difference === 0) return <span className="text-green-600">✓</span>;

    const sign = difference > 0 ? '+' : '';
    const color = difference > 0 ? 'text-blue-600' : 'text-red-600';

    return <span className={`font-bold ${color}`}>{sign}{formatNumber(difference)}</span>;
}
