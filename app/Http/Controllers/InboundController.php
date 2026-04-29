<?php

namespace App\Http\Controllers;

use App\Http\Requests\Inbound\StoreInboundRequest;
use App\Http\Requests\Inbound\UpdateInboundRequest;
use App\Models\Item;
use App\Services\InboundService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InboundController extends Controller
{
    public function __construct(
        private InboundService $inboundService
    ) {}

    /**
     * Tampilkan daftar transaksi barang masuk (dengan filter & pagination).
     */
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'date_from', 'date_to', 'sort_by', 'sort_dir']);

        return Inertia::render('Inbound/Index', [
            'inbounds' => $this->inboundService->getInbounds($filters),
            'filters'  => $filters,
        ]);
    }

    /**
     * Tampilkan form tambah barang masuk.
     */
    public function create(): Response
    {
        return Inertia::render('Inbound/Form', [
            'items'         => Item::select('id', 'name', 'item_code', 'unit_of_measure', 'unit_price', 'current_stock')->orderBy('name')->get(),
            'nextReference' => $this->inboundService->getNextReferenceNumber(),
        ]);
    }

    /**
     * Simpan transaksi barang masuk baru.
     */
    public function store(StoreInboundRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['user_id'] = auth()->id();

        $this->inboundService->createInbound($data);

        return redirect()
            ->route('inbound.index')
            ->with('success', 'Transaksi barang masuk berhasil disimpan.');
    }

    /**
     * Tampilkan detail transaksi barang masuk.
     */
    public function show(int $id): Response
    {
        return Inertia::render('Inbound/Show', [
            'inbound' => $this->inboundService->findInbound($id),
        ]);
    }

    /**
     * Tampilkan form edit barang masuk.
     */
    public function edit(int $id): Response
    {
        return Inertia::render('Inbound/Form', [
            'inbound' => $this->inboundService->findInbound($id),
            'items'   => Item::select('id', 'name', 'item_code', 'unit_of_measure', 'unit_price', 'current_stock')->orderBy('name')->get(),
        ]);
    }

    /**
     * Update transaksi barang masuk.
     */
    public function update(UpdateInboundRequest $request, int $id): RedirectResponse
    {
        $inbound = $this->inboundService->findInbound($id);

        $this->inboundService->updateInbound($inbound, $request->validated());

        return redirect()
            ->route('inbound.index')
            ->with('success', 'Transaksi barang masuk berhasil diperbarui.');
    }

    /**
     * Hapus transaksi barang masuk (rollback stok).
     */
    public function destroy(int $id): RedirectResponse
    {
        $inbound = $this->inboundService->findInbound($id);
        $this->inboundService->deleteInbound($inbound);

        return redirect()
            ->route('inbound.index')
            ->with('success', 'Transaksi barang masuk berhasil dihapus.');
    }
}
