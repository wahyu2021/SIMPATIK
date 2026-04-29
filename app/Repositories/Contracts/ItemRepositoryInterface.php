<?php

namespace App\Repositories\Contracts;

use App\Models\Item;
use Illuminate\Pagination\LengthAwarePaginator;

interface ItemRepositoryInterface
{
    /**
     * Ambil item dengan pagination + filter (search, category, stock status)
     */
    public function paginate(int $perPage = 15, array $filters = []): LengthAwarePaginator;

    /**
     * Cari item berdasarkan ID (include relasi category)
     */
    public function findById(int $id): ?Item;

    /**
     * Buat item baru
     */
    public function create(array $data): Item;

    /**
     * Update item
     */
    public function update(Item $item, array $data): bool;

    /**
     * Hapus item (soft delete)
     */
    public function delete(Item $item): bool;

    /**
     * Generate kode barang otomatis (ITM-XXXX)
     */
    public function generateItemCode(): string;
}
