/**
 * Types untuk halaman Rekapitulasi Mutasi Barang.
 */

export interface MutationItem {
    no: number;
    item_id: number;
    name: string;
    unit: string;
    opening_qty: number;
    inbound_qty: number;
    outbound_qty: number;
    closing_qty: number;
}

export interface MutationCategory {
    id: number;
    name: string;
    items: MutationItem[];
    subtotal_opening: number;
    subtotal_inbound: number;
    subtotal_outbound: number;
    subtotal_closing: number;
}

export interface MutationSummary {
    opening_qty: number;
    inbound_qty: number;
    outbound_qty: number;
    closing_qty: number;
}

export interface MutationPeriod {
    month: number;
    year: number;
    label: string;
    prev_label: string;
    end_label: string;
}

export interface MutationReportData {
    categories: MutationCategory[];
    summary: MutationSummary;
    period: MutationPeriod;
}

export interface Signatory {
    company_name: string;
    company_branch: string;
    company_address: string;
}

export interface MutationFilters {
    month: number;
    year: number;
    category_id: number | null;
}
