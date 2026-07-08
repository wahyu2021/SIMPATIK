<?php

namespace App\Repositories\Eloquent;

use App\Models\Category;
use App\Repositories\Contracts\CategoryRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;

class CategoryRepository implements CategoryRepositoryInterface
{
    public function paginate(int $perPage = 15, array $filters = []): LengthAwarePaginator
    {
        $query = Category::withCount('items');

        // Search: nama kategori
        if (!empty($filters['search'])) {
            $query->where('name', 'like', "%{$filters['search']}%");
        }

        // Sorting (default: terbaru)
        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortDir = $filters['sort_dir'] ?? 'desc';
        $allowedSorts = ['name', 'created_at'];

        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortDir === 'asc' ? 'asc' : 'desc');
        }

        $page = request()->get('page', 1);
        $version = Cache::get('categories_version', '0');
        $cacheKey = "categories_paginate_v{$version}_" . md5(json_encode(func_get_args()) . $page);

        return Cache::remember($cacheKey, 3600, function () use ($query, $perPage) {
            return $query->paginate($perPage)->onEachSide(1)->withQueryString();
        });
    }

    public function findById(int $id): ?Category
    {
        $version = Cache::get('categories_version', '0');
        return Cache::remember("categories_find_v{$version}_{$id}", 3600, function () use ($id) {
            return Category::withCount('items')->find($id);
        });
    }

    public function create(array $data): Category
    {
        return Category::create($data);
    }

    public function update(Category $category, array $data): bool
    {
        return $category->update($data);
    }

    public function delete(Category $category): bool
    {
        return $category->delete();
    }
}
