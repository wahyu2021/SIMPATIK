<?php

namespace App\Repositories\Contracts;

use App\Models\User;
use Illuminate\Support\Collection;

/**
 * Interface untuk repository Dashboard.
 * Menyediakan method-method aggregasi data statistik dari berbagai model.
 */
interface DashboardRepositoryInterface
{
    /**
     * Hitung total barang aktif
     */
    public function countItems(): int;

    /**
     * Hitung total kategori aktif
     */
    public function countCategories(): int;

    /**
     * Hitung total unit kerja aktif
     */
    public function countDepartments(): int;

    /**
     * Hitung total user aktif
     */
    public function countActiveUsers(): int;

    /**
     * Hitung barang dengan stok rendah (di bawah minimum)
     */
    public function countLowStockItems(): int;

    /**
     * Hitung pengajuan berstatus Pending untuk disetujui (khusus unit kerja user)
     */
    public function countPendingApproval(User $user): int;

    /**
     * Hitung pengajuan berstatus Approved yang menunggu diserahkan Gudang
     */
    public function countPendingIssue(): int;

    /**
     * Hitung pengajuan berstatus Pending atau Approved milik user
     */
    public function countMyActiveRequests(User $user): int;

    /**
     * Hitung pengajuan berstatus Completed milik user
     */
    public function countMyCompletedRequests(User $user): int;

    /**
     * Hitung pengajuan yang disetujui hari ini (dapat difilter per user/unit)
     */
    public function countApprovedToday(?User $user = null): int;

    /**
     * Hitung pengajuan yang diserahkan/diselesaikan hari ini
     */
    public function countIssuedToday(): int;

    /**
     * Hitung transaksi barang masuk bulan ini
     */
    public function countInboundThisMonth(): int;

    /**
     * Ambil pengajuan terbaru (Eloquent Collection)
     */
    public function getRecentRequests(?User $user = null, int $limit = 5): Collection;

    /**
     * Ambil barang stok rendah teratas (Eloquent Collection)
     */
    public function getLowStockItems(int $limit = 5): Collection;

    /**
     * Ambil tren transaksi bulanan (6 bulan terakhir)
     * @return array{month: string, inbound: int, outbound: int}[]
     */
    public function getMonthlyTransactionTrend(?User $user = null, int $months = 6): array;

    /**
     * Distribusi status pengajuan outbound
     * @return array{status: string, count: int}[]
     */
    public function getOutboundStatusDistribution(?User $user = null): array;
}
