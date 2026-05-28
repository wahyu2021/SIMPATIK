/**
 * Utility formatting — sentralisasi format mata uang, tanggal, dan angka.
 */

/** Format angka ke Rupiah: 1500000 → "Rp 1.500.000" */
export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
}

/** Format tanggal pendek (untuk tabel): "2026-04-29" → "29 Apr 2026" */
export function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

/** Format tanggal panjang (untuk detail): "2026-04-29" → "Selasa, 29 April 2026" */
export function formatDateLong(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}

/** Format angka dengan separator ribuan: 15000 → "15.000" */
export function formatNumber(value: number): string {
    return value.toLocaleString('id-ID');
}

/** Normalisasi tanggal ke YYYY-MM-DD untuk input[type=date]. */
export function normalizeDate(dateStr?: string): string {
    if (!dateStr) return new Date().toISOString().split('T')[0];
    return dateStr.split('T')[0];
}

/** Format tanggal + waktu lengkap: "2026-04-29T14:30:00" → "Selasa, 29 Apr 2026 14.30" */
export function formatDateTime(dateStr: string): string {
    const date = new Date(dateStr);
    const datePart = date.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
    const timePart = date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
    });
    return `${datePart} ${timePart}`;
}
