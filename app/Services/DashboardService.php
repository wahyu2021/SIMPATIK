<?php

namespace App\Services;

use App\Repositories\Contracts\DashboardRepositoryInterface;
use Illuminate\Support\Facades\Auth;

class DashboardService
{
    public function __construct(
        private DashboardRepositoryInterface $dashboardRepository
    ) {}

    /**
     * Ambil semua data untuk halaman Dashboard, terfilter sesuai role user login.
     *
     * @return array{stats: array, recentRequests: array, lowStockItems: array}
     */
    public function getDashboardData(): array
    {
        $user = Auth::user();

        return [
            'stats'          => $this->getStats($user),
            'recentRequests' => $this->mapRecentRequests($user),
            'lowStockItems'  => $this->mapLowStockItems(), // Stok rendah tetap global untuk visibility Admin
            'monthlyTrend'   => $this->dashboardRepository->getMonthlyTransactionTrend($user),
            'statusDistribution' => $this->dashboardRepository->getOutboundStatusDistribution($user),
        ];
    }

    /**
     * Kumpulkan semua angka statistik utama.
     */
    private function getStats($user): array
    {
        return [
            'total_items'        => $this->dashboardRepository->countItems(),
            'total_categories'   => $this->dashboardRepository->countCategories(),
            'total_departments'  => $this->dashboardRepository->countDepartments(),
            'total_users'        => $this->dashboardRepository->countActiveUsers(),
            'low_stock_count'    => $this->dashboardRepository->countLowStockItems(),
            'pending_requests'   => $this->dashboardRepository->countPendingRequests($user),
            'approved_today'     => $this->dashboardRepository->countApprovedToday($user),
            'inbound_this_month' => $this->dashboardRepository->countInboundThisMonth(),
        ];
    }

    /**
     * Transform Eloquent Collection pengajuan ke format frontend.
     */
    private function mapRecentRequests($user): array
    {
        return $this->dashboardRepository
            ->getRecentRequests($user)
            ->map(fn ($trx) => [
                'id'              => $trx->id,
                'document_number' => $trx->document_number,
                'requester'       => $trx->requester?->name ?? '-',
                'department'      => $trx->department?->name ?? '-',
                'status'          => $trx->status,
                'date'            => $trx->transaction_date->format('d M Y'),
            ])
            ->toArray();
    }

    /**
     * Transform Eloquent Collection stok rendah ke format frontend.
     */
    private function mapLowStockItems(): array
    {
        return $this->dashboardRepository
            ->getLowStockItems()
            ->map(fn ($item) => [
                'id'            => $item->id,
                'name'          => $item->name,
                'item_code'     => $item->item_code,
                'category'      => $item->category?->name ?? '-',
                'current_stock' => $item->current_stock,
                'minimum_stock' => $item->minimum_stock_level,
                'unit'          => $item->unit_of_measure,
            ])
            ->toArray();
    }
}
