<?php

namespace App\Repositories\Contracts;

use App\Models\Category;
use Illuminate\Pagination\LengthAwarePaginator;

interface CategoryRepositoryInterface
{
    /**
     * Ambil kategori dengan pagination + filter (search)
     */
    public function paginate(int $perPage = 15, array $filters = []): LengthAwarePaginator;

    /**
     * Cari kategori berdasarkan ID
     */
    public function findById(int $id): ?Category;

    /**
     * Buat kategori baru
     */
    public function create(array $data): Category;

    /**
     * Update kategori
     */
    public function update(Category $category, array $data): bool;

    /**
     * Hapus kategori (soft delete)
     */
    public function delete(Category $category): bool;
}
