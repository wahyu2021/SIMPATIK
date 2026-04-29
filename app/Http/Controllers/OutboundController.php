<?php

namespace App\Http\Controllers;

use App\Http\Requests\Outbound\RejectOutboundRequest;
use App\Http\Requests\Outbound\StoreOutboundRequest;
use App\Models\Department;
use App\Models\Item;
use App\Services\OutboundService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OutboundController extends Controller
{
    public function __construct(
        private OutboundService $outboundService
    ) {}

    /**
     * Tampilkan daftar pengajuan barang (filter sesuai role user).
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $filters = $request->only(['search', 'status', 'department_id', 'date_from', 'date_to', 'sort_by', 'sort_dir']);

        // Staff: hanya lihat pengajuan sendiri
        if ($user->hasRole('staff')) {
            $filters['requester_id'] = $user->id;
        }

        // Penyelia: hanya lihat pengajuan dari unit kerjanya
        if ($user->hasRole('division_head')) {
            $filters['department_ids'] = [$user->department_id];
        }

        return Inertia::render('Outbound/Index', [
            'outbounds'   => $this->outboundService->getOutbounds($filters),
            'filters'     => $filters,
            'departments' => Department::select('id', 'name')->orderBy('name')->get(),
        ]);
    }

    /**
     * Tampilkan form pengajuan barang baru.
     */
    public function create(): Response
    {
        return Inertia::render('Outbound/Form', [
            'items'          => Item::select('id', 'name', 'item_code', 'unit_of_measure', 'current_stock')->orderBy('name')->get(),
            'departments'    => Department::select('id', 'name')->orderBy('name')->get(),
            'nextDocument'   => $this->outboundService->getNextDocumentNumber(),
        ]);
    }

    /**
     * Simpan pengajuan barang baru (status: Pending).
     */
    public function store(StoreOutboundRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['requester_id'] = auth()->id();

        $this->outboundService->createRequest($data);

        return redirect()
            ->route('outbound.index')
            ->with('success', 'Pengajuan barang berhasil dibuat.');
    }

    /**
     * Tampilkan detail pengajuan barang.
     */
    public function show(int $id): Response
    {
        return Inertia::render('Outbound/Show', [
            'outbound' => $this->outboundService->findOutbound($id),
        ]);
    }

    /**
     * Penyelia setujui pengajuan (Pending → Approved).
     */
    public function approve(int $id): RedirectResponse
    {
        $outbound = $this->outboundService->findOutbound($id);
        $this->outboundService->approveRequest($outbound, auth()->id());

        return redirect()
            ->route('outbound.show', $id)
            ->with('success', 'Pengajuan berhasil disetujui.');
    }

    /**
     * Penyelia tolak pengajuan (Pending → Rejected).
     */
    public function reject(RejectOutboundRequest $request, int $id): RedirectResponse
    {
        $outbound = $this->outboundService->findOutbound($id);
        $this->outboundService->rejectRequest($outbound, auth()->id(), $request->validated('rejection_reason'));

        return redirect()
            ->route('outbound.show', $id)
            ->with('success', 'Pengajuan berhasil ditolak.');
    }

    /**
     * Admin serahkan barang (Approved → Issued, stok berkurang).
     */
    public function issue(int $id): RedirectResponse
    {
        $outbound = $this->outboundService->findOutbound($id);
        $this->outboundService->issueItems($outbound, auth()->id());

        return redirect()
            ->route('outbound.show', $id)
            ->with('success', 'Barang berhasil diserahkan dan stok telah diperbarui.');
    }

    /**
     * Batalkan pengajuan (hanya Pending, hanya pemilik).
     */
    public function destroy(int $id): RedirectResponse
    {
        $outbound = $this->outboundService->findOutbound($id);

        if ($outbound->requester_id !== auth()->id()) {
            abort(403, 'Anda hanya dapat membatalkan pengajuan milik sendiri.');
        }

        $this->outboundService->cancelRequest($outbound);

        return redirect()
            ->route('outbound.index')
            ->with('success', 'Pengajuan berhasil dibatalkan.');
    }
}
