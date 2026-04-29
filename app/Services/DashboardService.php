<?php

namespace App\Services;

use App\Repositories\Contracts\DashboardRepositoryInterface;

class DashboardService
{
    public function __construct(
        private DashboardRepositoryInterface $dashboardRepository
    ) {}

    /**
     * Ambil semua data untuk halaman Dashboard.
     *
     * @return array{stats: array, recentRequests: array, lowStockItems: array}
     */
    public function getDashboardData(): array
    {
        return [
            'stats'          => $this->getStats(),
            'recentRequests' => $this->mapRecentRequests(),
            'lowStockItems'  => $this->mapLowStockItems(),
            'monthlyTrend'   => $this->dashboardRepository->getMonthlyTransactionTrend(),
            'statusDistribution' => $this->dashboardRepository->getOutboundStatusDistribution(),
        ];
    }

    /**
     * Kumpulkan semua angka statistik utama.
     */
    private function getStats(): array
    {
        return [
            'total_items'        => $this->dashboardRepository->countItems(),
            'total_categories'   => $this->dashboardRepository->countCategories(),
            'total_departments'  => $this->dashboardRepository->countDepartments(),
            'total_users'        => $this->dashboardRepository->countActiveUsers(),
            'low_stock_count'    => $this->dashboardRepository->countLowStockItems(),
            'pending_requests'   => $this->dashboardRepository->countPendingRequests(),
            'approved_today'     => $this->dashboardRepository->countApprovedToday(),
            'inbound_this_month' => $this->dashboardRepository->countInboundThisMonth(),
        ];
    }

    /**
     * Transform Eloquent Collection pengajuan ke format frontend.
     */
    private function mapRecentRequests(): array
    {
        return $this->dashboardRepository
            ->getRecentRequests()
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
