<?php

namespace App\Repositories\Eloquent;

use App\Enums\OutboundStatus;
use App\Models\Item;
use App\Models\StockLedger;
use App\Models\StockReconciliation;
use App\Repositories\Contracts\ReportRepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Repository: ReportRepository
 *
 * [Data Access Layer]
 * Pattern Repository digunakan untuk memisahkan abstraksi query database dari logika bisnis.
 * Hal ini memastikan bahwa kode yang berhubungan langsung dengan struktur tabel/kolom Eloquent
 * terisolasi dan mudah di-mock (ditiru) saat melakukan Unit Testing.
 */
class ReportRepository implements ReportRepositoryInterface
{
    /**
     * {@inheritDoc}
     */
    public function getItemsForReport(?int $categoryId = null): Collection
    {
        $query = Item::with('category:id,name')
            ->orderBy('category_id')
            ->orderBy('name');

        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }

        return $query->get();
    }

    /**
     * {@inheritDoc}
     */
    public function getOpeningBalances(string $beforeDate): Collection
    {
        // Ambil ID ledger terakhir per item sebelum tanggal
        $lastIds = DB::table('stock_ledgers')
            ->whereDate('transaction_date', '<=', $beforeDate)
            ->select('item_id', DB::raw('MAX(id) as last_id'))
            ->groupBy('item_id')
            ->pluck('last_id');

        if ($lastIds->isEmpty()) {
            return collect();
        }

        return StockLedger::whereIn('id', $lastIds)
            ->get()
            ->keyBy('item_id');
    }

    /**
     * {@inheritDoc}
     */
    public function getInboundTotals(string $startDate, string $endDate): Collection
    {
        return DB::table('inbound_transaction_details')
            ->join('inbound_transactions', 'inbound_transactions.id', '=', 'inbound_transaction_details.inbound_transaction_id')
            ->whereBetween('inbound_transactions.transaction_date', [$startDate, $endDate])
            ->select(
                'inbound_transaction_details.item_id',
                DB::raw('SUM(inbound_transaction_details.quantity) as total_qty')
            )
            ->groupBy('inbound_transaction_details.item_id')
            ->get()
            ->keyBy('item_id');
    }

    /**
     * {@inheritDoc}
     */
    public function getOutboundTotals(string $startDate, string $endDate): Collection
    {
        return DB::table('outbound_transaction_details')
            ->join('outbound_transactions', 'outbound_transactions.id', '=', 'outbound_transaction_details.outbound_transaction_id')
            ->whereIn('outbound_transactions.status', [OutboundStatus::Issued->value, OutboundStatus::Completed->value])
            ->whereBetween('outbound_transactions.transaction_date', [$startDate, $endDate])
            ->select(
                'outbound_transaction_details.item_id',
                DB::raw('SUM(outbound_transaction_details.quantity_approved) as total_qty')
            )
            ->groupBy('outbound_transaction_details.item_id')
            ->get()
            ->keyBy('item_id');
    }

    /**
     * {@inheritDoc}
     */
    public function getOutboundByDepartment(int $itemId, string $startDate, string $endDate): array
    {
        return DB::table('outbound_transaction_details')
            ->join('outbound_transactions', 'outbound_transactions.id', '=', 'outbound_transaction_details.outbound_transaction_id')
            ->join('departments', 'departments.id', '=', 'outbound_transactions.department_id')
            ->where('outbound_transaction_details.item_id', $itemId)
            ->whereIn('outbound_transactions.status', [OutboundStatus::Issued->value, OutboundStatus::Completed->value])
            ->whereBetween('outbound_transactions.transaction_date', [$startDate, $endDate])
            ->select('departments.name as department', DB::raw('SUM(outbound_transaction_details.quantity_approved) as qty'))
            ->groupBy('departments.id', 'departments.name')
            ->orderBy('departments.name')
            ->get()
            ->toArray();
    }

    /**
     * {@inheritDoc}
     */
    public function getDepartmentTotals(int $departmentId, string $startDate, string $endDate): Collection
    {
        return DB::table('outbound_transaction_details')
            ->join('outbound_transactions', 'outbound_transactions.id', '=', 'outbound_transaction_details.outbound_transaction_id')
            ->join('items', 'items.id', '=', 'outbound_transaction_details.item_id')
            ->where('outbound_transactions.department_id', $departmentId)
            ->whereIn('outbound_transactions.status', [OutboundStatus::Issued->value, OutboundStatus::Completed->value])
            ->whereBetween('outbound_transactions.transaction_date', [$startDate, $endDate])
            ->select(
                'items.id',
                'items.name',
                'items.item_code',
                'items.unit_of_measure',
                DB::raw('SUM(outbound_transaction_details.quantity_approved) as total_qty')
            )
            ->groupBy('items.id', 'items.name', 'items.item_code', 'items.unit_of_measure')
            ->orderBy('items.name')
            ->get();
    }

    /**
     * {@inheritDoc}
     */
    public function getStockLedger(int $itemId, ?string $startDate = null, ?string $endDate = null, ?string $movementType = null): Collection
    {
        $query = StockLedger::where('item_id', $itemId)
            ->orderBy('transaction_date', 'asc')
            ->orderBy('id', 'asc');

        if ($startDate && $endDate) {
            $query->whereBetween('transaction_date', [$startDate, $endDate]);
        }

        if ($movementType) {
            $query->where('movement_type', $movementType);
        }

        return $query->get();
    }

    /**
     * {@inheritDoc}
     */
    public function getItemOptions(): Collection
    {
        return Item::select('id', 'name', 'item_code', 'unit_of_measure')
            ->orderBy('name')
            ->get();
    }

    /**
     * {@inheritDoc}
     */
    public function findReconciliation(int $month, int $year): ?object
    {
        return StockReconciliation::with(['details.item:id,name,item_code,unit_of_measure', 'creator:id,name'])
            ->where('month', $month)
            ->where('year', $year)
            ->first();
    }

    /**
     * {@inheritDoc}
     */
    public function saveReconciliation(array $header, array $details): object
    {
        $recon = StockReconciliation::create($header);

        foreach ($details as $detail) {
            $recon->details()->create($detail);
        }

        return $recon->load('details.item:id,name,item_code,unit_of_measure');
    }

    /**
     * {@inheritDoc}
     */
    public function getItemsWithStock(): Collection
    {
        return Item::select('id', 'name', 'item_code', 'unit_of_measure', 'current_stock')
            ->orderBy('name')
            ->get();
    }
}
