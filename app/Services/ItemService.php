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
    public function createItem(\App\DTOs\Item\ItemDTO $dto): Item
    {
        $itemCode = $dto->item_code;
        // Generate kode barang otomatis jika belum diisi
        if (empty($itemCode)) {
            $itemCode = $this->itemRepository->generateItemCode();
        }

        return $this->itemRepository->create([
            'name' => $dto->name,
            'item_code' => $itemCode,
            'category_id' => $dto->category_id,
            'unit_of_measure' => $dto->unit_of_measure,
            'unit_price' => $dto->unit_price,
            'minimum_stock' => $dto->minimum_stock,
            'notes' => $dto->notes,
        ]);
    }

    /**
     * Update item yang sudah ada.
     */
    public function updateItem(Item $item, \App\DTOs\Item\ItemDTO $dto): bool
    {
        return $this->itemRepository->update($item, [
            'name' => $dto->name,
            'category_id' => $dto->category_id,
            'unit_of_measure' => $dto->unit_of_measure,
            'unit_price' => $dto->unit_price,
            'minimum_stock' => $dto->minimum_stock,
            'notes' => $dto->notes,
        ]);
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
