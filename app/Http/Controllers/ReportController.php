<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Services\ReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function __construct(
        private ReportService $reportService
    ) {}

    /**
     * Halaman Laporan Saldistat ATK.
     */
    public function index(Request $request): Response
    {
        $month = (int) $request->get('month', now()->month);
        $year = (int) $request->get('year', now()->year);
        $categoryId = $request->get('category_id') ? (int) $request->get('category_id') : null;

        $saldistat = $this->reportService->getSaldistat($month, $year, $categoryId);
        $signatory = $this->reportService->getSignatory();

        return Inertia::render('Reports/Index', [
            'saldistat' => $saldistat,
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
        $month = (int) $request->get('month', now()->month);
        $year = (int) $request->get('year', now()->year);

        return response()->json(
            $this->reportService->getBreakdownByDepartment($itemId, $month, $year)
        );
    }

    /**
     * Halaman Kartu Mutasi Stok (Ledger).
     */
    public function stockLedger(Request $request): Response
    {
        $itemId = $request->get('item_id') ? (int) $request->get('item_id') : null;
        $month = $request->get('month') ? (int) $request->get('month') : null;
        $year = $request->get('year') ? (int) $request->get('year') : null;
        $movementType = $request->get('movement_type');

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
}
