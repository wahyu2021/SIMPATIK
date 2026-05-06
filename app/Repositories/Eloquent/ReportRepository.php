<?php

namespace App\Repositories\Eloquent;

use App\Enums\OutboundStatus;
use App\Models\Item;
use App\Models\StockLedger;
use App\Repositories\Contracts\ReportRepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

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
                DB::raw('SUM(inbound_transaction_details.quantity) as total_qty'),
                DB::raw('SUM(inbound_transaction_details.quantity * inbound_transaction_details.unit_price) as total_value')
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
            ->where('outbound_transactions.status', OutboundStatus::Issued->value)
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
            ->where('outbound_transactions.status', OutboundStatus::Issued->value)
            ->whereBetween('outbound_transactions.transaction_date', [$startDate, $endDate])
            ->select('departments.name as department', DB::raw('SUM(outbound_transaction_details.quantity_approved) as qty'))
            ->groupBy('departments.id', 'departments.name')
            ->orderBy('departments.name')
            ->get()
            ->toArray();
    }
}
