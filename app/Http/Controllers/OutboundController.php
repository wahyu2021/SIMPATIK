<?php

namespace App\Http\Controllers;

use App\Http\Requests\Outbound\RejectOutboundRequest;
use App\Http\Requests\Outbound\StoreOutboundRequest;
use App\Models\Department;
use App\Models\Item;
use App\Models\OutboundTransaction;
use App\Models\User;
use App\Services\OutboundService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

use App\Services\ReportService;
use Barryvdh\DomPDF\Facade\Pdf;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class OutboundController extends Controller
{
    public function __construct(
        private OutboundService $outboundService,
        private ReportService $reportService
    ) {}

    /**
     * Generate PDF Surat Permintaan Barang (SPB).
     */
    public function downloadSpb(int $id)
    {
        $outbound = $this->outboundService->findOutbound($id);
        $outbound->load(['requester', 'approver', 'issuedByUser', 'department', 'details.item']);

        $signatory = $this->reportService->getSignatory();
        
        $qrCode = base64_encode(QrCode::format('png')->size(320)->margin(0)->errorCorrection('H')->merge(public_path('images/logo.png'), 0.3, true)->generate(
            route('outbound.show', $id)
        ));

        $pdf = Pdf::loadView('pdf.spb', compact('outbound', 'signatory', 'qrCode'));

        return $pdf->stream("SPB-{$outbound->document_number}.pdf");
    }

    /**
     * Generate PDF Berita Acara Serah Terima (BAST).
     */
    public function downloadBast(int $id)
    {
        $outbound = $this->outboundService->findOutbound($id);
        
        if (!$outbound->isHandedOver() && !$outbound->isCompleted()) {
            abort(403, 'BAST hanya dapat dicetak setelah barang diserahkan.');
        }

        $outbound->load(['requester', 'handedOverByUser', 'pickedUpByUser', 'department', 'details.item']);

        $signatory = $this->reportService->getSignatory();
        
        $qrCode = base64_encode(QrCode::format('png')->size(320)->margin(0)->errorCorrection('H')->merge(public_path('images/logo.png'), 0.3, true)->generate(
            route('outbound.show', $id)
        ));

        $pdf = Pdf::loadView('pdf.bast', compact('outbound', 'signatory', 'qrCode'));

        return $pdf->stream("BAST-{$outbound->document_number}.pdf");
    }

    /**
     * Tampilkan daftar pengajuan barang (filter sesuai role user).
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', OutboundTransaction::class);

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
        Gate::authorize('create', OutboundTransaction::class);

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
        Gate::authorize('create', OutboundTransaction::class);

        $requesterId = auth()->id();
        $departmentId = auth()->user()->department_id; // Set otomatis dari profil

        $this->outboundService->createRequest(\App\DTOs\Transaction\OutboundDTO::fromRequest($request, $requesterId, $departmentId));

        return redirect()
            ->route('outbound.index')
            ->with('success', 'Pengajuan barang berhasil dibuat.');
    }

    /**
     * Form pengajuan langsung oleh Admin Gudang.
     */
    public function createDirect(): Response
    {
        Gate::authorize('create', OutboundTransaction::class);
        if (!auth()->user()->hasRole('warehouse_admin')) {
            abort(403, 'Hanya Admin Gudang yang dapat melakukan penginputan langsung.');
        }

        return Inertia::render('Outbound/DirectForm', [
            'items'       => Item::select('id', 'name', 'item_code', 'unit_of_measure', 'current_stock')->orderBy('name')->get(),
            'departments' => Department::select('id', 'name')->orderBy('name')->get(),
            'users'       => User::select('id', 'name', 'department_id')->with('roles:id,name')->get(),
        ]);
    }

    /**
     * Simpan pengajuan langsung oleh Admin Gudang.
     */
    public function storeDirect(\App\Http\Requests\Outbound\StoreDirectOutboundRequest $request): RedirectResponse
    {
        Gate::authorize('create', OutboundTransaction::class);
        if (!auth()->user()->hasRole('warehouse_admin')) {
            abort(403, 'Hanya Admin Gudang yang dapat melakukan penginputan langsung.');
        }

        $requesterId = $request->validated('requester_id');
        $departmentId = $request->validated('department_id');

        $outbound = $this->outboundService->createDirectRequest(
            \App\DTOs\Transaction\OutboundDTO::fromRequest($request, $requesterId, $departmentId), 
            auth()->id()
        );

        return redirect()
            ->route('outbound.show', $outbound->id)
            ->with('success', 'Pengambilan langsung berhasil dicatat. Stok otomatis terpotong.');
    }

    /**
     * Tampilkan detail pengajuan barang.
     */
    public function show(int $id): Response
    {
        $outbound = $this->outboundService->findOutbound($id);
        Gate::authorize('view', $outbound);

        return Inertia::render('Outbound/Show', [
            'outbound' => $outbound,
        ]);
    }

    /**
     * Tampilkan form edit pengajuan (hanya Pending, hanya pemilik).
     */
    public function edit(int $id): Response
    {
        $outbound = $this->outboundService->findOutbound($id);
        Gate::authorize('update', $outbound);

        return Inertia::render('Outbound/Form', [
            'outbound'       => $outbound,
            'items'          => Item::select('id', 'name', 'item_code', 'unit_of_measure', 'current_stock')->orderBy('name')->get(),
            'departments'    => Department::select('id', 'name')->orderBy('name')->get(),
        ]);
    }

    /**
     * Update pengajuan barang (hanya Pending, hanya pemilik).
     */
    public function update(StoreOutboundRequest $request, int $id): RedirectResponse
    {
        $outbound = $this->outboundService->findOutbound($id);
        Gate::authorize('update', $outbound);

        $departmentId = auth()->user()->department_id; // Set otomatis dari profil

        $this->outboundService->updateRequest(
            $outbound, 
            \App\DTOs\Transaction\OutboundDTO::fromRequest($request, $outbound->requester_id, $departmentId)
        );

        return redirect()
            ->route('outbound.show', $id)
            ->with('success', 'Pengajuan berhasil diperbarui.');
    }

    /**
     * Penyelia setujui pengajuan (Pending → Approved).
     * Opsional: kirim quantities per detail untuk partial approve.
     */
    public function approve(Request $request, int $id): RedirectResponse
    {
        $outbound = $this->outboundService->findOutbound($id);
        Gate::authorize('approve', $outbound);

        $quantities = $request->input('quantities');

        $this->outboundService->approveRequest($outbound, auth()->id(), $quantities);

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
        Gate::authorize('reject', $outbound);

        $this->outboundService->rejectRequest($outbound, auth()->id(), $request->validated('rejection_reason'));

        return redirect()
            ->route('outbound.show', $id)
            ->with('success', 'Pengajuan berhasil ditolak.');
    }

    /**
     * Admin Gudang menyetujui pengeluaran barang (Approved → Issued).
     */
    public function issue(Request $request, int $id): RedirectResponse
    {
        $outbound = $this->outboundService->findOutbound($id);
        Gate::authorize('issue', $outbound);

        $quantities = $request->input('quantities');

        $this->outboundService->issueItems($outbound, auth()->id(), $quantities);

        return redirect()
            ->route('outbound.show', $id)
            ->with('success', 'Pengeluaran barang disetujui. Barang siap diserahkan.');
    }

    /**
     * Admin Gudang serahkan barang ke pemohon (Issued → Handed Over).
     */
    public function handover(int $id): RedirectResponse
    {
        $outbound = $this->outboundService->findOutbound($id);
        Gate::authorize('handover', $outbound);

        $this->outboundService->handoverItems($outbound, auth()->id());

        return redirect()
            ->route('outbound.show', $id)
            ->with('success', 'Barang telah diserahkan. Menunggu konfirmasi penerimaan dari pemohon.');
    }

    /**
     * Pemohon konfirmasi penerimaan barang (Handed Over → Completed).
     */
    public function pickup(int $id): RedirectResponse
    {
        $outbound = $this->outboundService->findOutbound($id);
        Gate::authorize('pickup', $outbound);

        $this->outboundService->pickupItems($outbound, auth()->id());

        return redirect()
            ->route('outbound.show', $id)
            ->with('success', 'Penerimaan barang berhasil dikonfirmasi. Transaksi selesai.');
    }

    /**
     * Batalkan pengajuan (hanya Pending, hanya pemilik).
     */
    public function destroy(int $id): RedirectResponse
    {
        $outbound = $this->outboundService->findOutbound($id);
        Gate::authorize('delete', $outbound);

        $this->outboundService->cancelRequest($outbound);

        return redirect()
            ->route('outbound.index')
            ->with('success', 'Pengajuan berhasil dibatalkan.');
    }
}
