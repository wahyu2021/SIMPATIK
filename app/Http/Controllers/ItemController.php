<?php

namespace App\Http\Controllers;

use App\Http\Requests\Item\StoreItemRequest;
use App\Http\Requests\Item\UpdateItemRequest;
use App\Models\Category;
use App\Services\ItemService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ItemController extends Controller
{
    public function __construct(
        private ItemService $itemService
    ) {}

    /**
     * Tampilkan daftar barang (dengan filter & pagination).
     */
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'category_id', 'low_stock', 'sort_by', 'sort_dir']);

        return Inertia::render('Items/Index', [
            'items'      => $this->itemService->getItems($filters),
            'categories' => Category::select('id', 'name')->orderBy('name')->get(),
            'filters'    => $filters,
        ]);
    }

    /**
     * Tampilkan form tambah barang.
     */
    public function create(): Response
    {
        return Inertia::render('Items/Form', [
            'categories' => Category::select('id', 'name')->orderBy('name')->get(),
            'nextCode'   => $this->itemService->getNextItemCode(),
        ]);
    }

    /**
     * Simpan barang baru.
     */
    public function store(StoreItemRequest $request): RedirectResponse
    {
        $this->itemService->createItem(\App\DTOs\Item\ItemDTO::fromRequest($request));

        return redirect()
            ->route('items.index')
            ->with('success', 'Barang berhasil ditambahkan.');
    }

    /**
     * Tampilkan form edit barang.
     */
    public function edit(int $id): Response
    {
        return Inertia::render('Items/Form', [
            'item'       => $this->itemService->findItem($id),
            'categories' => Category::select('id', 'name')->orderBy('name')->get(),
        ]);
    }

    /**
     * Update data barang.
     */
    public function update(UpdateItemRequest $request, int $id): RedirectResponse
    {
        $item = $this->itemService->findItem($id);

        $this->itemService->updateItem($item, \App\DTOs\Item\ItemDTO::fromRequest($request));

        return redirect()
            ->route('items.index')
            ->with('success', 'Barang berhasil diperbarui.');
    }

    /**
     * Hapus barang (soft delete).
     */
    public function destroy(int $id): RedirectResponse
    {
        $item = $this->itemService->findItem($id);
        $this->itemService->deleteItem($item);

        return redirect()
            ->route('items.index')
            ->with('success', 'Barang berhasil dihapus.');
    }
}
