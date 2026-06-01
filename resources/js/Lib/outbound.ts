/**
 * Shared helper functions untuk modul Outbound (Pengajuan Barang).
 *
 * Dipakai oleh OutboundTable, OutboundDetailTable, dan Show page
 * agar logika bisnis tidak terduplikasi di banyak file.
 */

import { OutboundTransaction, OutboundTransactionDetail, OutboundStatus } from '../Types';

/** Batas hari sebelum pengajuan dianggap overdue (terlambat ditindaklanjuti). */
export const OVERDUE_THRESHOLD_DAYS = 3;

/**
 * Hitung berapa hari pengajuan sudah "stuck" di status saat ini.
 *
 * - Status `Pending`: dihitung dari `created_at`.
 * - Status `Approved`: dihitung dari `approved_at`.
 * - Status `Issued`: dihitung dari `issued_at`.
 * - Status `Handed Over`: dihitung dari `handed_over_at`.
 * - Status lain: return `null` (tidak relevan).
 */
export function getOverdueDays(outbound: OutboundTransaction): number | null {
    const dateMap: Partial<Record<OutboundStatus, string | undefined>> = {
        'Pending': outbound.created_at,
        'Approved': outbound.approved_at,
        'Issued': outbound.issued_at,
        'Handed Over': outbound.handed_over_at,
    };

    const refDateStr = dateMap[outbound.status];
    if (!refDateStr) return null;

    const diffMs = Date.now() - new Date(refDateStr).getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/** Cek apakah pengajuan melebihi batas overdue. */
export function isOverdue(outbound: OutboundTransaction): boolean {
    const days = getOverdueDays(outbound);
    return days !== null && days > OVERDUE_THRESHOLD_DAYS;
}

/**
 * Cek apakah jumlah yang diminta/disetujui melebihi stok saat ini.
 * Prioritas: `quantity_approved` jika sudah diisi, fallback ke `quantity_requested`.
 */
export function isStockInsufficient(detail: OutboundTransactionDetail): boolean {
    if (!detail.item) return false;
    const qty = detail.quantity_approved > 0 ? detail.quantity_approved : detail.quantity_requested;
    return qty > detail.item.current_stock;
}

/** Apakah kolom stok perlu ditampilkan? Hanya relevan sebelum stok dikurangi. */
export function shouldShowStockColumn(status?: OutboundStatus): boolean {
    return status === 'Pending' || status === 'Approved';
}
