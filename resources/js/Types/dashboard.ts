/**
 * Types untuk halaman Dashboard dan chart components.
 */

/** Data tren bulanan (bar chart). */
export interface MonthlyTrend {
    month: string;
    inbound: number;
    outbound: number;
}

/** Data distribusi status pengajuan (pie chart). */
export interface StatusDistribution {
    status: string;
    count: number;
}
