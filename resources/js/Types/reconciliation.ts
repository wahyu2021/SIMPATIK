/**
 * Types untuk halaman Rekonsiliasi Bulanan.
 */

export interface ReconItem {
    item_id: number;
    name: string;
    item_code: string | null;
    unit: string;
    system_qty: number;
    physical_qty: number;
    difference: number;
    notes: string;
}

export interface ReconDetail {
    id: number;
    item_id: number;
    system_qty: number;
    physical_qty: number;
    difference: number;
    notes: string | null;
    item: {
        id: number;
        name: string;
        item_code: string | null;
        unit_of_measure: string;
    };
}

export interface CompletedRecon {
    id: number;
    month: number;
    year: number;
    reconciliation_date: string;
    notes: string | null;
    creator: { id: number; name: string };
    details: ReconDetail[];
}

export interface ReconFilters {
    month: number;
    year: number;
}
