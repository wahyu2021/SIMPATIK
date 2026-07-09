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

/**
 * Repository: DashboardRepository
 *
 * [Data Access Layer]
 * Pattern Repository digunakan untuk memisahkan abstraksi query database dari logika bisnis.
 * Hal ini memastikan bahwa kode yang berhubungan langsung dengan struktur tabel/kolom Eloquent
 * terisolasi dan mudah di-mock (ditiru) saat melakukan Unit Testing.
 */
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

    public function countPendingApproval(User $user): int
    {
        return OutboundTransaction::where('status', OutboundStatus::Pending)
            ->where('department_id', $user->department_id)
            ->count();
    }

    public function countPendingIssue(): int
    {
        return OutboundTransaction::where('status', OutboundStatus::Approved)->count();
    }

    public function countMyActiveRequests(User $user): int
    {
        return OutboundTransaction::where('requester_id', $user->id)
            ->whereIn('status', [OutboundStatus::Pending, OutboundStatus::Approved])
            ->count();
    }

    public function countMyCompletedRequests(User $user): int
    {
        return OutboundTransaction::where('requester_id', $user->id)
            ->where('status', OutboundStatus::Completed)
            ->count();
    }

    public function countApprovedToday(?User $user = null): int
    {
        return OutboundTransaction::where('status', OutboundStatus::Approved)
            ->whereDate('approved_at', Carbon::today())
            ->when($user, fn($q) => $this->applyScope($q, $user))
            ->count();
    }

    public function countIssuedToday(): int
    {
        return OutboundTransaction::whereIn('status', [OutboundStatus::Issued, OutboundStatus::HandedOver, OutboundStatus::Completed])
            ->whereDate('issued_at', Carbon::today())
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
        // Jika Admin Gudang atau Bagian Umum, bisa lihat semua (Global)
        if ($user->hasRole('warehouse_admin') || $user->hasRole('general_affairs')) {
            return $query;
        }

        // Jika Penyelia atau Staff Biasa, lihat data unit kerjanya saja (Satu Departemen)
        return $query->where('department_id', $user->department_id);
    }
}
