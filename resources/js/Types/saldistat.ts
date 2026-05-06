/**
 * Types untuk halaman Saldistat ATK.
 */

export interface SaldistatItem {
    no: number;
    item_id: number;
    name: string;
    unit: string;
    unit_price: number;
    opening_qty: number;
    opening_value: number;
    inbound_qty: number;
    inbound_value: number;
    outbound_qty: number;
    outbound_value: number;
    closing_qty: number;
    closing_value: number;
}

export interface SaldistatCategory {
    id: number;
    name: string;
    items: SaldistatItem[];
    subtotal_opening: number;
    subtotal_inbound: number;
    subtotal_outbound: number;
    subtotal_closing: number;
}

export interface SaldistatSummary {
    opening_value: number;
    inbound_value: number;
    outbound_value: number;
    closing_value: number;
}

export interface SaldistatPeriod {
    month: number;
    year: number;
    label: string;
    prev_label: string;
    end_label: string;
}

export interface SaldistatData {
    categories: SaldistatCategory[];
    summary: SaldistatSummary;
    period: SaldistatPeriod;
}

export interface Signatory {
    company_name: string;
    company_branch: string;
    company_address: string;
}

export interface SaldistatFilters {
    month: number;
    year: number;
    category_id: number | null;
}
