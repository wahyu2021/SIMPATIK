<?php

namespace App\Http\Controllers;

use App\Exports\DepartmentReportExport;
use App\Exports\MutationReportExport;
use App\Models\Category;
use App\Models\Department;
use App\Services\ReportService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

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
     * Export Laporan Rekapitulasi Mutasi ke PDF.
     */
    public function exportMutationPdf(Request $request)
    {
        $month = (int) $request->input('month', now()->month);
        $year = (int) $request->input('year', now()->year);
        $categoryId = $request->input('category_id') ? (int) $request->input('category_id') : null;

        $reportData = $this->reportService->getMutationReport($month, $year, $categoryId);
        $signatory = $this->reportService->getSignatory();

        $pdf = Pdf::loadView('pdf.mutation_report', compact('reportData', 'signatory'))
            ->setPaper('a4', 'landscape');

        return $pdf->stream("Rekapitulasi-Mutasi-{$year}-{$month}.pdf");
    }

    /**
     * Export Laporan Penggunaan per Unit ke PDF.
     */
    public function exportDepartmentPdf(Request $request)
    {
        $month = (int) $request->input('month', now()->month);
        $year = (int) $request->input('year', now()->year);
        $departmentId = (int) $request->input('department_id');

        if (!$departmentId) {
            return back()->with('error', 'Pilih unit kerja terlebih dahulu.');
        }

        $department = Department::findOrFail($departmentId);
        $reportData = $this->reportService->getDepartmentReportData($departmentId, $month, $year);
        $signatory = $this->reportService->getSignatory();

        $pdf = Pdf::loadView('pdf.department_report', compact('reportData', 'signatory', 'department'));

        return $pdf->stream("Laporan-Unit-{$department->name}-{$year}-{$month}.pdf");
    }

    /**
     * Export Laporan Rekapitulasi Mutasi ke Excel.
     */
    public function exportMutationExcel(Request $request)
    {
        $month = (int) $request->input('month', now()->month);
        $year = (int) $request->input('year', now()->year);
        $categoryId = $request->input('category_id') ? (int) $request->input('category_id') : null;

        $reportData = $this->reportService->getMutationReport($month, $year, $categoryId);

        return Excel::download(
            new MutationReportExport($reportData),
            "Rekapitulasi-Mutasi-{$year}-{$month}.xlsx"
        );
    }

    /**
     * Export Laporan Penggunaan per Unit ke Excel.
     */
    public function exportDepartmentExcel(Request $request)
    {
        $month = (int) $request->input('month', now()->month);
        $year = (int) $request->input('year', now()->year);
        $departmentId = (int) $request->input('department_id');

        if (!$departmentId) {
            return back()->with('error', 'Pilih unit kerja terlebih dahulu.');
        }

        $department = Department::findOrFail($departmentId);
        $reportData = $this->reportService->getDepartmentReportData($departmentId, $month, $year);

        return Excel::download(
            new DepartmentReportExport($reportData, $department->name),
            "Laporan-Unit-{$department->name}-{$year}-{$month}.xlsx"
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
     * Simpan hasil rekonsiliasi (Submit).
     */
    public function storeReconciliation(\App\Http\Requests\Report\StoreReconciliationRequest $request)
    {
        $this->reportService->saveReconciliation(
            \App\DTOs\Report\ReconciliationDTO::fromRequest($request, auth()->id())
        );

        return redirect()
            ->route('reports.reconciliation', ['month' => $request->month, 'year' => $request->year])
            ->with('success', 'Rekonsiliasi stok berhasil disimpan dan saldo telah disesuaikan.');
    }

    /**
     * Halaman Laporan Penggunaan per Unit Kerja.
     */
    public function departmentReport(Request $request): Response
    {
        $month = (int) $request->input('month', now()->month);
        $year = (int) $request->input('year', now()->year);
        $departmentId = $request->input('department_id') ? (int) $request->input('department_id') : null;

        $reportData = $departmentId
            ? $this->reportService->getDepartmentReportData($departmentId, $month, $year)
            : ['items' => [], 'period' => [
                'month' => $month,
                'year' => $year,
                'label' => \Illuminate\Support\Carbon::create($year, $month, 1)->translatedFormat('F Y'),
            ]];

        return Inertia::render('Reports/Department', [
            'reportData' => $reportData,
            'departments' => Department::select('id', 'name')->orderBy('name')->get(),
            'filters' => [
                'month' => $month,
                'year' => $year,
                'department_id' => $departmentId,
            ],
        ]);
    }

    /**
     * Export Worksheet Rekonsiliasi ke Excel (kosong untuk lapangan).
     */
    public function exportReconciliationWorksheet()
    {
        return Excel::download(
            new \App\Exports\ReconciliationWorksheetExport(),
            "Worksheet-Opname-Fisik-" . date('Y-m-d') . ".xlsx"
        );
    }

    /**
     * Export Berita Acara Rekonsiliasi ke PDF.
     */
    public function exportReconciliationPdf(Request $request)
    {
        $month = (int) $request->input('month', now()->month);
        $year = (int) $request->input('year', now()->year);

        $data = $this->reportService->getReconciliationData($month, $year);

        if ($data['status'] !== 'completed') {
            return back()->with('error', 'Rekonsiliasi untuk bulan ini belum dilakukan.');
        }

        $reconciliation = $data['reconciliation'];
        
        // Filter hanya item yang ada selisih
        $discrepancies = $reconciliation->details->filter(function ($detail) {
            return $detail->difference != 0;
        });

        $signatory = $this->reportService->getSignatory();

        $pdf = Pdf::loadView('pdf.reconciliation_report', compact('reconciliation', 'discrepancies', 'signatory', 'month', 'year'))
            ->setPaper('a4', 'portrait');

        return $pdf->stream("Berita-Acara-Rekonsiliasi-{$year}-{$month}.pdf");
    }
}
