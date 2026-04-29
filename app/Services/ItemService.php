<?php

namespace App\Services;

use App\Models\Item;
use App\Repositories\Contracts\ItemRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class ItemService
{
    public function __construct(
        private ItemRepositoryInterface $itemRepository
    ) {}

    /**
     * Ambil daftar item dengan pagination dan filter.
     */
    public function getItems(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->itemRepository->paginate($perPage, $filters);
    }

    /**
     * Cari item berdasarkan ID.
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function findItem(int $id): Item
    {
        $item = $this->itemRepository->findById($id);

        if (!$item) {
            abort(404, 'Barang tidak ditemukan.');
        }

        return $item;
    }

    /**
     * Buat item baru dengan kode barang otomatis.
     */
    public function createItem(array $data): Item
    {
        // Generate kode barang otomatis jika belum diisi
        if (empty($data['item_code'])) {
            $data['item_code'] = $this->itemRepository->generateItemCode();
        }

        return $this->itemRepository->create($data);
    }

    /**
     * Update item yang sudah ada.
     */
    public function updateItem(Item $item, array $data): bool
    {
        return $this->itemRepository->update($item, $data);
    }

    /**
     * Hapus item (soft delete).
     */
    public function deleteItem(Item $item): bool
    {
        return $this->itemRepository->delete($item);
    }

    /**
     * Generate kode barang berikutnya (untuk preview di form).
     */
    public function getNextItemCode(): string
    {
        return $this->itemRepository->generateItemCode();
    }
}
