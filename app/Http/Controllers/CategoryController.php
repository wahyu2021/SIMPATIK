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
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
        ], [
            'name.required' => 'Nama kategori wajib diisi.',
            'name.max'      => 'Nama kategori maksimal 255 karakter.',
            'name.unique'   => 'Nama kategori sudah digunakan.',
        ]);

        $this->categoryService->createCategory($validated);

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
    public function update(Request $request, int $id): RedirectResponse
    {
        $category = $this->categoryService->findCategory($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
        ], [
            'name.required' => 'Nama kategori wajib diisi.',
            'name.max'      => 'Nama kategori maksimal 255 karakter.',
            'name.unique'   => 'Nama kategori sudah digunakan.',
        ]);

        $this->categoryService->updateCategory($category, $validated);

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
