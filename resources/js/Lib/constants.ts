/**
 * Konstanta yang sering dipakai di berbagai halaman laporan.
 * Sentralisasi di sini agar DRY — tidak perlu copy-paste di setiap page.
 */

import { ComboboxOption } from '../Components/UI/Combobox';

/** Daftar bulan (1–12) untuk dropdown filter. */
export const MONTH_OPTIONS: ComboboxOption[] = [
    { value: '1', label: 'Januari' },
    { value: '2', label: 'Februari' },
    { value: '3', label: 'Maret' },
    { value: '4', label: 'April' },
    { value: '5', label: 'Mei' },
    { value: '6', label: 'Juni' },
    { value: '7', label: 'Juli' },
    { value: '8', label: 'Agustus' },
    { value: '9', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' },
];

/** Bulan + opsi "Semua Bulan" di awal (untuk filter opsional). */
export const MONTH_OPTIONS_ALL: ComboboxOption[] = [
    { value: '', label: 'Semua Bulan' },
    ...MONTH_OPTIONS,
];

/** Generate daftar 5 tahun terakhir untuk dropdown. */
export function getYearOptions(includeAll = false): ComboboxOption[] {
    const years = Array.from({ length: 5 }, (_, i) => {
        const y = new Date().getFullYear() - i;
        return { value: y.toString(), label: y.toString() };
    });
    return includeAll ? [{ value: '', label: 'Semua Tahun' }, ...years] : years;
}
