<?php

namespace App\Http\Controllers;

use App\Services\CategoryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function __construct(
        private CategoryService $categoryService
    ) {}

    /**
     * Tampilkan daftar kategori (dengan filter & pagination).
     */
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'sort_by', 'sort_dir']);

        return Inertia::render('Categories/Index', [
            'categories' => $this->categoryService->getCategories($filters),
            'filters'    => $filters,
        ]);
    }

    /**
     * Tampilkan form tambah kategori.
     */
    public function create(): Response
    {
        return Inertia::render('Categories/Form');
    }

    /**
     * Simpan kategori baru.
     */
    public function store(\App\Http\Requests\Category\StoreCategoryRequest $request): RedirectResponse
    {
        $this->categoryService->createCategory($request->validated());

        return redirect()
            ->route('categories.index')
            ->with('success', 'Kategori berhasil ditambahkan.');
    }

    /**
     * Tampilkan form edit kategori.
     */
    public function edit(int $id): Response
    {
        return Inertia::render('Categories/Form', [
            'category' => $this->categoryService->findCategory($id),
        ]);
    }

    /**
     * Update data kategori.
     */
    public function update(\App\Http\Requests\Category\UpdateCategoryRequest $request, int $id): RedirectResponse
    {
        $category = $this->categoryService->findCategory($id);

        $this->categoryService->updateCategory($category, $request->validated());

        return redirect()
            ->route('categories.index')
            ->with('success', 'Kategori berhasil diperbarui.');
    }

    /**
     * Hapus kategori (soft delete).
     */
    public function destroy(int $id): RedirectResponse
    {
        $category = $this->categoryService->findCategory($id);
        $this->categoryService->deleteCategory($category);

        return redirect()
            ->route('categories.index')
            ->with('success', 'Kategori berhasil dihapus.');
    }
}
