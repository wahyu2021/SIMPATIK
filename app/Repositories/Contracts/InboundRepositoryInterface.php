<?php

namespace App\Repositories\Contracts;

use App\Models\InboundTransaction;
use Illuminate\Pagination\LengthAwarePaginator;

interface InboundRepositoryInterface
{
    /**
     * Ambil daftar transaksi barang masuk dengan pagination + filter
     */
    public function paginate(int $perPage = 15, array $filters = []): LengthAwarePaginator;

    /**
     * Cari transaksi barang masuk berdasarkan ID (include relasi details.item & user)
     */
    public function findById(int $id): ?InboundTransaction;

    /**
     * Buat transaksi barang masuk baru
     */
    public function create(array $data): InboundTransaction;

    /**
     * Update transaksi barang masuk
     */
    public function update(InboundTransaction $inbound, array $data): bool;

    /**
     * Hapus transaksi barang masuk
     */
    public function delete(InboundTransaction $inbound): bool;

    /**
     * Generate nomor referensi otomatis (INB-YYYYMM-XXXX)
     */
    public function generateReferenceNumber(): string;
}
