<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Services\ReportService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function __construct(
        private ReportService $reportService
    ) {}

    /**
     * Halaman Rekapitulasi Mutasi Barang.
     */
    public function index(Request $request): Response
    {
        $month = (int) $request->input('month', now()->month);
        $year = (int) $request->input('year', now()->year);
        $categoryId = $request->input('category_id') ? (int) $request->input('category_id') : null;

        $reportData = $this->reportService->getMutationReport($month, $year, $categoryId);
        $signatory = $this->reportService->getSignatory();

        return Inertia::render('Reports/Index', [
            'reportData' => $reportData,
            'signatory' => $signatory,
            'categories' => Category::select('id', 'name')->orderBy('name')->get(),
            'filters' => [
                'month' => $month,
                'year' => $year,
                'category_id' => $categoryId,
            ],
        ]);
    }

    /**
     * Ambil breakdown per unit kerja untuk satu item (AJAX).
     */
    public function breakdown(Request $request, int $itemId)
    {
        $month = (int) $request->input('month', now()->month);
        $year = (int) $request->input('year', now()->year);

        return response()->json(
            $this->reportService->getBreakdownByDepartment($itemId, $month, $year)
        );
    }

    /**
     * Halaman Kartu Mutasi Stok (Ledger).
     */
    public function stockLedger(Request $request): Response
    {
        $itemId = $request->input('item_id') ? (int) $request->input('item_id') : null;
        $month = $request->input('month') ? (int) $request->input('month') : null;
        $year = $request->input('year') ? (int) $request->input('year') : null;
        $movementType = $request->input('movement_type');

        $entries = $itemId
            ? $this->reportService->getStockLedger($itemId, $month, $year, $movementType)
            : [];

        return Inertia::render('Reports/StockLedger', [
            'entries' => $entries,
            'items' => $this->reportService->getItemOptions(),
            'filters' => [
                'item_id' => $itemId,
                'month' => $month,
                'year' => $year,
                'movement_type' => $movementType,
            ],
        ]);
    }

    /**
     * Halaman Rekonsiliasi Bulanan.
     */
    public function reconciliation(Request $request): Response
    {
        $month = (int) $request->input('month', now()->month);
        $year = (int) $request->input('year', now()->year);

        $data = $this->reportService->getReconciliationData($month, $year);

        return Inertia::render('Reports/Reconciliation', [
            'reconData' => $data,
            'filters' => ['month' => $month, 'year' => $year],
        ]);
    }

    /**
     * Simpan rekonsiliasi bulanan.
     */
    public function storeReconciliation(Request $request): RedirectResponse
    {
        $request->validate([
            'month' => 'required|integer|min:1|max:12',
            'year' => 'required|integer|min:2024',
            'notes' => 'nullable|string|max:500',
            'details' => 'required|array|min:1',
            'details.*.item_id' => 'required|integer|exists:items,id',
            'details.*.system_qty' => 'required|integer',
            'details.*.physical_qty' => 'required|integer|min:0',
            'details.*.notes' => 'nullable|string|max:255',
        ]);

        $this->reportService->saveReconciliation(
            (int) $request->month,
            (int) $request->year,
            auth()->id(),
            $request->details,
            $request->notes,
        );

        return redirect()
            ->route('reports.reconciliation', ['month' => $request->month, 'year' => $request->year])
            ->with('success', 'Rekonsiliasi berhasil disimpan.');
    }
}
