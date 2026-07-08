<?php

namespace App\Repositories\Eloquent;

use App\Models\Item;
use App\Repositories\Contracts\ItemRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;

class ItemRepository implements ItemRepositoryInterface
{
    public function paginate(int $perPage = 15, array $filters = []): LengthAwarePaginator
    {
        $query = Item::with('category');

        // Search: nama atau kode barang
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', "%{$filters['search']}%")
                  ->orWhere('item_code', 'like', "%{$filters['search']}%");
            });
        }

        // Filter berdasarkan kategori
        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        // Filter stok rendah
        if (!empty($filters['low_stock'])) {
            $query->whereColumn('current_stock', '<=', 'minimum_stock_level');
        }

        // Sorting (default: terbaru)
        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortDir = $filters['sort_dir'] ?? 'desc';
        $allowedSorts = ['name', 'item_code', 'current_stock', 'unit_price', 'created_at'];

        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortDir === 'asc' ? 'asc' : 'desc');
        }

        $page = request()->get('page', 1);
        $version = Cache::get('items_version', '0');
        $cacheKey = "items_paginate_v{$version}_" . md5(json_encode(func_get_args()) . $page);

        return Cache::remember($cacheKey, 3600, function () use ($query, $perPage) {
            return $query->paginate($perPage)->onEachSide(1)->withQueryString();
        });
    }

    public function findById(int $id): ?Item
    {
        $version = Cache::get('items_version', '0');
        return Cache::remember("items_find_v{$version}_{$id}", 3600, function () use ($id) {
            return Item::with('category')->find($id);
        });
    }

    public function create(array $data): Item
    {
        return Item::create($data);
    }

    public function update(Item $item, array $data): bool
    {
        return $item->update($data);
    }

    public function delete(Item $item): bool
    {
        return $item->delete();
    }

    public function generateItemCode(): string
    {
        $lastItem = Item::withTrashed()
            ->where('item_code', 'like', 'ITM-%')
            ->orderByRaw("CAST(SUBSTRING(item_code, 5) AS UNSIGNED) DESC")
            ->first();

        if ($lastItem && preg_match('/ITM-(\d+)/', $lastItem->item_code, $matches)) {
            $nextNumber = (int) $matches[1] + 1;
        } else {
            $nextNumber = 1;
        }

        return 'ITM-' . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
    }
}
