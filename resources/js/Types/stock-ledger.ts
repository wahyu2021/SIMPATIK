/**
 * Types untuk halaman Kartu Mutasi Stok.
 */

export interface LedgerEntry {
    id: number;
    date: string;
    type: 'in' | 'out' | 'adjustment';
    reference: string;
    qty_in: number;
    qty_out: number;
    balance: number;
}

export interface ItemOption {
    id: number;
    name: string;
    item_code: string | null;
    unit_of_measure: string;
}

export interface LedgerFilters {
    item_id: number | null;
    month: number | null;
    year: number | null;
    movement_type: string | null;
}
