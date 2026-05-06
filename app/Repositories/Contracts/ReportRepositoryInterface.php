<?php

namespace App\Repositories\Contracts;

use Illuminate\Support\Collection;

/**
 * Interface untuk repository Laporan.
 * Menyediakan method agregasi data untuk Saldistat ATK.
 */
interface ReportRepositoryInterface
{
    /**
     * Ambil semua item (opsional filter kategori), ordered by kategori lalu nama.
     */
    public function getItemsForReport(?int $categoryId = null): Collection;

    /**
     * Ambil ending_balance terakhir per item sebelum tanggal tertentu.
     * @return Collection keyed by item_id
     */
    public function getOpeningBalances(string $beforeDate): Collection;

    /**
     * Ambil total penerimaan (qty & value) per item dalam rentang tanggal.
     * @return Collection keyed by item_id
     */
    public function getInboundTotals(string $startDate, string $endDate): Collection;

    /**
     * Ambil total pengeluaran (qty) per item dalam rentang tanggal (status Issued).
     * @return Collection keyed by item_id
     */
    public function getOutboundTotals(string $startDate, string $endDate): Collection;

    /**
     * Ambil breakdown pengeluaran per unit kerja untuk satu item dalam rentang tanggal.
     */
    public function getOutboundByDepartment(int $itemId, string $startDate, string $endDate): array;
}
