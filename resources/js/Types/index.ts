// =============================================
// SIMPATIK — TypeScript Type Definitions
// Mirrors Laravel Eloquent Models
// =============================================

// --- Base ---
export interface Timestamps {
    created_at: string;
    updated_at: string;
}

// --- Auth ---
export interface User extends Timestamps {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    signature_path?: string;
    is_active: boolean;
    department_id?: number;
    department?: Department;
    roles?: Role[];
}

export interface Role {
    id: number;
    name: string;
    permissions?: Permission[];
}

export interface Permission {
    id: number;
    name: string;
}

// --- Master Data ---
export interface Department extends Timestamps {
    id: number;
    name: string;
    deleted_at?: string;
    users?: User[];
    users_count?: number;
}

export interface Category extends Timestamps {
    id: number;
    name: string;
    deleted_at?: string;
    items?: Item[];
    items_count?: number;
}

export interface Item extends Timestamps {
    id: number;
    category_id: number;
    item_code: string;
    name: string;
    unit_of_measure: string;
    unit_price: number;
    current_stock: number;
    minimum_stock_level: number;
    deleted_at?: string;
    category?: Category;
}

// --- Transactions ---
export type OutboundStatus = 'Pending' | 'Approved' | 'Issued' | 'Rejected';

export interface InboundTransaction extends Timestamps {
    id: number;
    user_id: number;
    reference_number: string;
    transaction_date: string;
    notes?: string;
    user?: User;
    details?: InboundTransactionDetail[];
}

export interface InboundTransactionDetail {
    id: number;
    inbound_transaction_id: number;
    item_id: number;
    quantity: number;
    unit_price: number;
    item?: Item;
}

export interface OutboundTransaction extends Timestamps {
    id: number;
    requester_id: number;
    approver_id?: number;
    issued_by?: number;
    department_id: number;
    document_number: string;
    transaction_date: string;
    status: OutboundStatus;
    approved_at?: string;
    issued_at?: string;
    is_special_request: boolean;
    rejection_reason?: string;
    notes?: string;
    requester?: User;
    approver?: User;
    issued_by_user?: User;
    department?: Department;
    details?: OutboundTransactionDetail[];
}

export interface OutboundTransactionDetail {
    id: number;
    outbound_transaction_id: number;
    item_id: number;
    quantity_requested: number;
    quantity_approved: number;
    notes?: string;
    item?: Item;
}

// --- Reporting ---
export type MovementType = 'IN' | 'OUT' | 'ADJUSTMENT';

export interface StockLedger extends Timestamps {
    id: number;
    item_id: number;
    transaction_date: string;
    movement_type: MovementType;
    document_reference: string;
    qty_in: number;
    qty_out: number;
    ending_balance: number;
    item?: Item;
}

// --- Forecasting ---
export interface DemandForecast extends Timestamps {
    id: number;
    item_id: number;
    target_period: string;
    forecasted_demand: number;
    suggested_order_qty: number;
    model_version?: string;
    mae_score?: number;
    item?: Item;
}

// --- Settings ---
export interface Setting extends Timestamps {
    id: number;
    key: string;
    value: string;
}

// --- Inertia Page Props ---
export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
    flash?: {
        success?: string;
        error?: string;
    };
};

// --- Pagination ---
export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: PaginationLink[];
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}
