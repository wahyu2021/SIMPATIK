<?php

namespace App\Repositories\Eloquent;

use App\Enums\OutboundStatus;
use App\Models\Category;
use App\Models\Department;
use App\Models\InboundTransaction;
use App\Models\Item;
use App\Models\OutboundTransaction;
use App\Models\User;
use App\Repositories\Contracts\DashboardRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

class DashboardRepository implements DashboardRepositoryInterface
{
    public function countItems(): int
    {
        return Item::count();
    }

    public function countCategories(): int
    {
        return Category::count();
    }

    public function countDepartments(): int
    {
        return Department::count();
    }

    public function countActiveUsers(): int
    {
        return User::where('is_active', true)->count();
    }

    public function countLowStockItems(): int
    {
        return Item::whereColumn('current_stock', '<=', 'minimum_stock_level')->count();
    }

    public function countPendingRequests(?User $user = null): int
    {
        return OutboundTransaction::where('status', OutboundStatus::Pending)
            ->when($user, fn($q) => $this->applyScope($q, $user))
            ->count();
    }

    public function countApprovedToday(?User $user = null): int
    {
        return OutboundTransaction::where('status', OutboundStatus::Approved)
            ->whereDate('approved_at', Carbon::today())
            ->when($user, fn($q) => $this->applyScope($q, $user))
            ->count();
    }

    public function countInboundThisMonth(): int
    {
        return InboundTransaction::whereMonth('transaction_date', Carbon::now()->month)
            ->whereYear('transaction_date', Carbon::now()->year)
            ->count();
    }

    public function getRecentRequests(?User $user = null, int $limit = 5): Collection
    {
        return OutboundTransaction::with(['requester:id,name', 'department:id,name'])
            ->when($user, fn($q) => $this->applyScope($q, $user))
            ->latest()
            ->take($limit)
            ->get();
    }

    public function getLowStockItems(int $limit = 5): Collection
    {
        return Item::with('category:id,name')
            ->whereColumn('current_stock', '<=', 'minimum_stock_level')
            ->orderByRaw('current_stock - minimum_stock_level ASC')
            ->take($limit)
            ->get();
    }

    public function getMonthlyTransactionTrend(?User $user = null, int $months = 6): array
    {
        $result = [];

        for ($i = $months - 1; $i >= 0; $i--) {
            $date = Carbon::now()->startOfMonth()->subMonths($i);
            $month = $date->month;
            $year = $date->year;

            $inbound = InboundTransaction::whereMonth('transaction_date', $month)
                ->whereYear('transaction_date', $year)
                ->count();

            $outbound = OutboundTransaction::whereMonth('transaction_date', $month)
                ->whereYear('transaction_date', $year)
                ->whereIn('status', [OutboundStatus::Issued, OutboundStatus::Completed])
                ->when($user, fn($q) => $this->applyScope($q, $user))
                ->count();

            $result[] = [
                'month' => $date->translatedFormat('M Y'),
                'inbound' => $inbound,
                'outbound' => $outbound,
            ];
        }

        return $result;
    }

    public function getOutboundStatusDistribution(?User $user = null): array
    {
        return OutboundTransaction::selectRaw('status, COUNT(*) as count')
            ->when($user, fn($q) => $this->applyScope($q, $user))
            ->groupBy('status')
            ->get()
            ->map(fn ($row) => [
                'status' => $row->status instanceof OutboundStatus ? $row->status->value : $row->status,
                'count' => $row->count,
            ])
            ->toArray();
    }

    /**
     * Terapkan scope filter berdasarkan role user.
     */
    private function applyScope(Builder $query, User $user): Builder
    {
        // Jika Admin, bisa lihat semua (jangan difilter)
        if ($user->hasRole('warehouse_admin')) {
            return $query;
        }

        // Jika Penyelia, lihat data unitnya sendiri
        if ($user->hasRole('division_head')) {
            return $query->where('department_id', $user->department_id);
        }

        // Jika Staff, hanya lihat datanya sendiri
        return $query->where('requester_id', $user->id);
    }
}
