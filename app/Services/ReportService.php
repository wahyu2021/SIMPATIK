<?php

namespace App\Services;

use App\Models\Item;
use App\Models\Setting;
use App\Models\StockLedger;
use App\Models\User;
use App\Notifications\LowStockAlertNotification;
use App\Repositories\Contracts\ReportRepositoryInterface;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

class ReportService
{
    public function __construct(
        private ReportRepositoryInterface $reportRepository
    ) {}

    /**
     * Ambil data Rekapitulasi Mutasi Barang — saldo awal, penerimaan, pengeluaran, saldo akhir per item.
     * Grouped by kategori dengan subtotal.
     *
     * @return array{categories: array, summary: array, period: array}
     */
    public function getMutationReport(int $month, int $year, ?int $categoryId = null): array
    {
        [$periodStart, $periodEnd, $prevEnd] = $this->getPeriodDates($month, $year);

        // Ambil data dari repository (batch queries — no N+1)
        $items = $this->reportRepository->getItemsForReport($categoryId);
        $openingData = $this->reportRepository->getOpeningBalances($prevEnd);
        $inboundData = $this->reportRepository->getInboundTotals($periodStart, $periodEnd);
        $outboundData = $this->reportRepository->getOutboundTotals($periodStart, $periodEnd);

        // Build grouped result
        $categories = [];
        $summary = ['opening_qty' => 0, 'inbound_qty' => 0, 'outbound_qty' => 0, 'closing_qty' => 0];
        $itemNumber = 0;

        foreach ($items as $item) {
            $catId = $item->category_id;
            $catName = $item->category?->name ?? 'Tanpa Kategori';

            if (!isset($categories[$catId])) {
                $categories[$catId] = [
                    'id' => $catId,
                    'name' => $catName,
                    'items' => [],
                    'subtotal_opening' => 0,
                    'subtotal_inbound' => 0,
                    'subtotal_outbound' => 0,
                    'subtotal_closing' => 0,
                ];
            }

            $row = $this->buildItemRow(++$itemNumber, $item, $openingData, $inboundData, $outboundData);

            $categories[$catId]['items'][] = $row;
            $categories[$catId]['subtotal_opening'] += $row['opening_qty'];
            $categories[$catId]['subtotal_inbound'] += $row['inbound_qty'];
            $categories[$catId]['subtotal_outbound'] += $row['outbound_qty'];
            $categories[$catId]['subtotal_closing'] += $row['closing_qty'];

            $summary['opening_qty'] += $row['opening_qty'];
            $summary['inbound_qty'] += $row['inbound_qty'];
            $summary['outbound_qty'] += $row['outbound_qty'];
            $summary['closing_qty'] += $row['closing_qty'];
        }

        return [
            'categories' => array_values($categories),
            'summary' => $summary,
            'period' => [
                'month' => $month,
                'year' => $year,
                'label' => Carbon::create($year, $month, 1)->translatedFormat('F Y'),
                'prev_label' => Carbon::parse($prevEnd)->translatedFormat('d F Y'),
                'end_label' => Carbon::parse($periodEnd)->translatedFormat('d F Y'),
            ],
        ];
    }

    /**
     * Ambil breakdown pengeluaran per unit kerja untuk satu item di satu bulan.
     */
    public function getBreakdownByDepartment(int $itemId, int $month, int $year): array
    {
        [$periodStart, $periodEnd] = $this->getPeriodDates($month, $year);

        return $this->reportRepository->getOutboundByDepartment($itemId, $periodStart, $periodEnd);
    }

    /**
     * Info penandatangan dari settings.
     */
    public function getSignatory(): array
    {
        return [
            'company_name' => Setting::getValue('company_name', ''),
            'company_branch' => Setting::getValue('company_branch', ''),
            'company_address' => Setting::getValue('company_address', ''),
        ];
    }

    /**
     * Ambil kartu mutasi stok untuk satu item.
     */
    public function getStockLedger(int $itemId, ?int $month = null, ?int $year = null, ?string $movementType = null): array
    {
        $startDate = null;
        $endDate = null;

        if ($month && $year) {
            [$startDate, $endDate] = $this->getPeriodDates($month, $year);
        }

        $entries = $this->reportRepository->getStockLedger($itemId, $startDate, $endDate, $movementType);

        return $entries->map(fn ($e) => [
            'id' => $e->id,
            'date' => $e->transaction_date->format('Y-m-d'),
            'type' => $e->movement_type,
            'reference' => $e->document_reference,
            'qty_in' => $e->qty_in,
            'qty_out' => $e->qty_out,
            'balance' => $e->ending_balance,
        ])->toArray();
    }

    /**
     * Ambil data laporan penggunaan barang per unit kerja.
     */
    public function getDepartmentReportData(int $departmentId, int $month, int $year): array
    {
        [$startDate, $endDate] = $this->getPeriodDates($month, $year);

        $items = $this->reportRepository->getDepartmentTotals($departmentId, $startDate, $endDate);

        return [
            'items' => $items->map(fn($i) => [
                'id' => $i->id,
                'name' => $i->name,
                'item_code' => $i->item_code,
                'unit_of_measure' => $i->unit_of_measure,
                'total_qty' => (int) $i->total_qty,
            ])->toArray(),
            'period' => [
                'month' => $month,
                'year' => $year,
                'label' => Carbon::create($year, $month, 1)->translatedFormat('F Y'),
            ],
        ];
    }

    /**
     * Ambil daftar item untuk dropdown.
     */
    public function getItemOptions(): array
    {
        return $this->reportRepository->getItemOptions()->toArray();
    }
    /**
     * Ambil data untuk halaman rekonsiliasi.
     */
    public function getReconciliationData(int $month, int $year): array
    {
        $existing = $this->reportRepository->findReconciliation($month, $year);

        if ($existing) {
            return [
                'status' => 'completed',
                'reconciliation' => $existing,
            ];
        }

        // Hitung saldo sistem untuk akhir periode yang dipilih
        [$start, $end, $prevEnd] = $this->getPeriodDates($month, $year);
        $items = $this->reportRepository->getItemsWithStock();
        $openings = $this->reportRepository->getOpeningBalances($prevEnd);
        $inbounds = $this->reportRepository->getInboundTotals($start, $end);
        $outbounds = $this->reportRepository->getOutboundTotals($start, $end);

        return [
            'status' => 'pending',
            'items' => $items->map(function ($item) use ($openings, $inbounds, $outbounds) {
                $openQty = $openings->get($item->id)?->ending_balance ?? 0;
                $inQty = $inbounds->get($item->id)?->total_qty ?? 0;
                $outQty = $outbounds->get($item->id)?->total_qty ?? 0;
                $systemQty = $openQty + $inQty - $outQty;

                return [
                    'item_id' => $item->id,
                    'name' => $item->name,
                    'item_code' => $item->item_code,
                    'unit' => $item->unit_of_measure,
                    'system_qty' => $systemQty,
                    'physical_qty' => $systemQty, // default sama
                    'difference' => 0,
                    'notes' => '',
                ];
            })->toArray(),
        ];
    }

    /**
     * Simpan rekonsiliasi bulanan dan lakukan penyesuaian stok jika ada selisih.
     */
    public function saveReconciliation(\App\DTOs\Report\ReconciliationDTO $dto): object
    {
        return DB::transaction(function () use ($dto) {
            // 1. Simpan Header & Detail Rekonsiliasi
            $recon = $this->reportRepository->saveReconciliation(
                [
                    'month' => $dto->month,
                    'year' => $dto->year,
                    'reconciliation_date' => now(),
                    'created_by' => $dto->user_id,
                    'notes' => $dto->notes,
                ],
                collect($dto->details)->map(fn ($d) => [
                    'item_id' => $d['item_id'],
                    'system_qty' => $d['system_qty'],
                    'physical_qty' => $d['physical_qty'],
                    'difference' => $d['physical_qty'] - $d['system_qty'],
                    'notes' => $d['notes'] ?? null,
                ])->toArray()
            );

            // 2. Proses Adjustment Stok jika ada perbedaan
            foreach ($dto->details as $d) {
                $diff = $d['physical_qty'] - $d['system_qty'];
                
                if ($diff != 0) {
                    $item = Item::lockForUpdate()->findOrFail($d['item_id']);
                    
                    // Update stok aktual sistem ke angka fisik hasil audit
                    $item->update(['current_stock' => $d['physical_qty']]);

                    // Catat riwayat penyesuaian (Adjustment) di Kartu Stok
                    StockLedger::create([
                        'item_id'            => $d['item_id'],
                        'transaction_date'   => now(),
                        'movement_type'      => 'adjustment',
                        'document_reference' => "RECON-{$dto->month}-{$dto->year}",
                        'qty_in'             => $diff > 0 ? $diff : 0,
                        'qty_out'            => $diff < 0 ? abs($diff) : 0,
                        'ending_balance'     => $d['physical_qty'],
                    ]);

                    // Trigger Notifikasi jika stok hasil rekonsiliasi rendah
                    if ($item->current_stock <= $item->minimum_stock_level) {
                        $admins = User::role('warehouse_admin')->get();
                        Notification::send($admins, new LowStockAlertNotification($item));
                    }
                }
            }

            return $recon;
        });
    }

    // ─── Private Helpers ───

    /**
     * Hitung tanggal awal, akhir, dan akhir bulan sebelumnya.
     * @return array [string $start, string $end, string $prevEnd]
     */
    private function getPeriodDates(int $month, int $year): array
    {
        $start = Carbon::create($year, $month, 1)->startOfDay()->toDateTimeString();
        $end = Carbon::create($year, $month, 1)->endOfMonth()->endOfDay()->toDateTimeString();
        $prevEnd = Carbon::create($year, $month, 1)->subDay()->endOfDay()->toDateTimeString();

        return [$start, $end, $prevEnd];
    }

    /**
     * Build satu baris item dengan kalkulasi saldo (murni kuantitas).
     */
    private function buildItemRow(int $no, $item, $openingData, $inboundData, $outboundData): array
    {
        $openingQty = isset($openingData[$item->id]) ? $openingData[$item->id]->ending_balance : 0;
        $inQty = isset($inboundData[$item->id]) ? (int) $inboundData[$item->id]->total_qty : 0;
        $outQty = isset($outboundData[$item->id]) ? (int) $outboundData[$item->id]->total_qty : 0;
        $closingQty = $openingQty + $inQty - $outQty;

        return [
            'no' => $no,
            'item_id' => $item->id,
            'name' => $item->name,
            'unit' => $item->unit_of_measure,
            'opening_qty' => $openingQty,
            'inbound_qty' => $inQty,
            'outbound_qty' => $outQty,
            'closing_qty' => $closingQty,
        ];
    }
}
