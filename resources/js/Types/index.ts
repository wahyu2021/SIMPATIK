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
    phone_number?: string;
    signature_path?: string;
    signature_url?: string;
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
export type OutboundStatus = 'Pending' | 'Approved' | 'Issued' | 'Handed Over' | 'Rejected' | 'Completed';

export interface InboundTransaction extends Timestamps {
    id: number;
    user_id: number;
    reference_number: string;
    transaction_date: string;
    notes?: string;
    receipt_image_path?: string;
    receipt_image_url?: string;
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
    handed_over_by?: number;
    picked_up_by?: number;
    department_id: number;
    document_number: string;
    transaction_date: string;
    status: OutboundStatus;
    approved_at?: string;
    issued_at?: string;
    handed_over_at?: string;
    picked_up_at?: string;
    is_special_request: boolean;
    rejection_reason?: string;
    notes?: string;
    requester?: User;
    approver?: User;
    issued_by_user?: User;
    handed_over_by_user?: User;
    picked_up_by_user?: User;
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

// --- Notifications ---
export interface NotificationData {
    id: string;
    type: string;
    data: {
        title: string;
        message: string;
        action_url?: string;
        type?: string;
        [key: string]: any;
    };
    read_at: string | null;
    created_at: string;
}

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

// --- Dashboard DTOs ---
export interface DashboardStats {
    // General Affairs
    total_items?: number;
    total_categories?: number;
    total_departments?: number;
    total_users?: number;
    low_stock_count?: number;
    inbound_this_month?: number;
    
    // Warehouse Admin
    pending_issue?: number;
    issued_today?: number;

    // Division Head
    pending_approval?: number;
    approved_today?: number;

    // Staff
    my_active_requests?: number;
    my_completed_requests?: number;
}

export interface RecentRequest {
    id: number;
    document_number: string;
    requester: string;
    department: string;
    status: OutboundStatus;
    date: string;
}

export interface LowStockItemData {
    id: number;
    name: string;
    item_code: string;
    category: string;
    current_stock: number;
    minimum_stock: number;
    unit: string;
}

// --- Inertia Page Props ---
export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
        notifications?: {
            unread_count: number;
            latest: NotificationData[];
        };
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
