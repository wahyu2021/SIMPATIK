<?php

namespace App\Services;

use App\Models\Category;
use App\Repositories\Contracts\CategoryRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class CategoryService
{
    public function __construct(
        private CategoryRepositoryInterface $categoryRepository
    ) {}

    /**
     * Ambil daftar kategori dengan pagination dan filter.
     */
    public function getCategories(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->categoryRepository->paginate($perPage, $filters);
    }

    /**
     * Cari kategori berdasarkan ID.
     *
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException
     */
    public function findCategory(int $id): Category
    {
        $category = $this->categoryRepository->findById($id);

        if (!$category) {
            abort(404, 'Kategori tidak ditemukan.');
        }

        return $category;
    }

    /**
     * Buat kategori baru.
     */
    public function createCategory(\App\DTOs\Category\CategoryDTO $dto): Category
    {
        return $this->categoryRepository->create([
            'name' => $dto->name,
        ]);
    }

    /**
     * Update data kategori.
     */
    public function updateCategory(Category $category, \App\DTOs\Category\CategoryDTO $dto): bool
    {
        return $this->categoryRepository->update($category, [
            'name' => $dto->name,
        ]);
    }

    /**
     * Hapus kategori (soft delete).
     * Cek apakah masih ada barang yang terdaftar di kategori ini.
     */
    public function deleteCategory(Category $category): bool
    {
        if ($category->items_count > 0 || $category->items()->count() > 0) {
            abort(422, 'Kategori tidak dapat dihapus karena masih memiliki barang terdaftar.');
        }

        return $this->categoryRepository->delete($category);
    }
}
