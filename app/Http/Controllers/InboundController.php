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

/**
 * Controller: InboundController
 *
 * [Arsitektur Layered]
 * Controller ini murni bertugas menangani Request HTTP (Input) dan Response (Output).
 * Seluruh logika bisnis atau manipulasi database dilarang berada di sini, melainkan 
 * harus didelegasikan (di-passing) ke lapisan Service melalui Data Transfer Object (DTO).
 */
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
     *
     * [Arsitektur & Keamanan]
     * - Request divalidasi ketat menggunakan StoreInboundRequest.
     * - Data dibungkus menjadi InboundDTO sebelum dilempar ke layer Service untuk menjaga 
     *   keterpisahan logika (Separation of Concerns).
     * - Auth ID otomatis disisipkan sebagai pencatat transaksi (user_id).
     *
     * @param StoreInboundRequest $request Validasi form barang masuk
     * @return RedirectResponse
     */
    public function store(StoreInboundRequest $request): RedirectResponse
    {
        $this->inboundService->createInbound(\App\DTOs\Transaction\InboundDTO::fromRequest($request, auth()->id()));

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
     * Update data transaksi (hanya admin gudang/super admin).
     */
    public function update(UpdateInboundRequest $request, int $id): RedirectResponse
    {
        $inbound = $this->inboundService->findInbound($id);
        
        $this->inboundService->updateInbound($inbound, \App\DTOs\Transaction\InboundDTO::fromRequest($request, $inbound->user_id));

        return redirect()
            ->route('inbound.show', $id)
            ->with('success', 'Transaksi barang masuk berhasil diperbarui.');
    }

    /**
     * Hapus transaksi barang masuk.
     * 
     * [Integritas Data]
     * - Penghapusan transaksi akan memicu proses rollback stok (pengurangan stok otomatis)
     *   di dalam InboundService::deleteInbound().
     * - History pada tabel stock_ledgers juga akan disesuaikan untuk menjaga
     *   keseimbangan neraca barang.
     *
     * @param int $id ID Transaksi
     * @return RedirectResponse
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
