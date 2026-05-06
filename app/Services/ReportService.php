<?php

namespace App\Services;

use App\Models\Setting;
use App\Repositories\Contracts\ReportRepositoryInterface;
use Illuminate\Support\Carbon;

class ReportService
{
    public function __construct(
        private ReportRepositoryInterface $reportRepository
    ) {}

    /**
     * Ambil data Saldistat ATK — saldo awal, penerimaan, pengeluaran, saldo akhir per item.
     * Grouped by kategori dengan subtotal.
     *
     * @return array{categories: array, summary: array, period: array}
     */
    public function getSaldistat(int $month, int $year, ?int $categoryId = null): array
    {
        [$periodStart, $periodEnd, $prevEnd] = $this->getPeriodDates($month, $year);

        // Ambil data dari repository (batch queries — no N+1)
        $items = $this->reportRepository->getItemsForReport($categoryId);
        $openingData = $this->reportRepository->getOpeningBalances($prevEnd);
        $inboundData = $this->reportRepository->getInboundTotals($periodStart, $periodEnd);
        $outboundData = $this->reportRepository->getOutboundTotals($periodStart, $periodEnd);

        // Build grouped result
        $categories = [];
        $summary = ['opening_value' => 0, 'inbound_value' => 0, 'outbound_value' => 0, 'closing_value' => 0];
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
            $categories[$catId]['subtotal_opening'] += $row['opening_value'];
            $categories[$catId]['subtotal_inbound'] += $row['inbound_value'];
            $categories[$catId]['subtotal_outbound'] += $row['outbound_value'];
            $categories[$catId]['subtotal_closing'] += $row['closing_value'];

            $summary['opening_value'] += $row['opening_value'];
            $summary['inbound_value'] += $row['inbound_value'];
            $summary['outbound_value'] += $row['outbound_value'];
            $summary['closing_value'] += $row['closing_value'];
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
     * Build satu baris item dengan kalkulasi saldo.
     */
    private function buildItemRow(int $no, $item, $openingData, $inboundData, $outboundData): array
    {
        $unitPrice = (float) $item->unit_price;

        $openingQty = isset($openingData[$item->id]) ? $openingData[$item->id]->ending_balance : 0;
        $openingValue = $openingQty * $unitPrice;

        $inQty = isset($inboundData[$item->id]) ? (int) $inboundData[$item->id]->total_qty : 0;
        $inValue = isset($inboundData[$item->id]) ? (float) $inboundData[$item->id]->total_value : 0;
        if ($inQty > 0 && $inValue == 0) {
            $inValue = $inQty * $unitPrice;
        }

        $outQty = isset($outboundData[$item->id]) ? (int) $outboundData[$item->id]->total_qty : 0;
        $outValue = $outQty * $unitPrice;

        $closingQty = $openingQty + $inQty - $outQty;
        $closingValue = $closingQty * $unitPrice;

        return [
            'no' => $no,
            'item_id' => $item->id,
            'name' => $item->name,
            'unit' => $item->unit_of_measure,
            'unit_price' => $unitPrice,
            'opening_qty' => $openingQty,
            'opening_value' => $openingValue,
            'inbound_qty' => $inQty,
            'inbound_value' => $inValue,
            'outbound_qty' => $outQty,
            'outbound_value' => $outValue,
            'closing_qty' => $closingQty,
            'closing_value' => $closingValue,
        ];
    }
}
