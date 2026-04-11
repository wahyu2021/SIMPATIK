<?php

namespace App\Repositories\Contracts;

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
     * Hitung pengajuan berstatus Pending
     */
    public function countPendingRequests(): int;

    /**
     * Hitung pengajuan yang di-approve hari ini
     */
    public function countApprovedToday(): int;

    /**
     * Hitung transaksi barang masuk bulan ini
     */
    public function countInboundThisMonth(): int;

    /**
     * Ambil pengajuan terbaru (Eloquent Collection)
     */
    public function getRecentRequests(int $limit = 5): Collection;

    /**
     * Ambil barang stok rendah teratas (Eloquent Collection)
     */
    public function getLowStockItems(int $limit = 5): Collection;
}
