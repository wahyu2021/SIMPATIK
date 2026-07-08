<?php

namespace App\Repositories\Eloquent;

use App\Models\OutboundTransaction;
use App\Repositories\Contracts\OutboundRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;

class OutboundRepository implements OutboundRepositoryInterface
{
    public function paginate(int $perPage = 15, array $filters = []): LengthAwarePaginator
    {
        $query = OutboundTransaction::with(['requester', 'approver', 'department', 'details.item']);

        // Search: nomor dokumen atau catatan
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('document_number', 'like', "%{$filters['search']}%")
                  ->orWhere('notes', 'like', "%{$filters['search']}%");
            });
        }

        // Filter: status
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        // Filter: department
        if (!empty($filters['department_id'])) {
            $query->where('department_id', $filters['department_id']);
        }

        // Filter: hanya milik user tertentu (untuk staff)
        if (!empty($filters['requester_id'])) {
            $query->where('requester_id', $filters['requester_id']);
        }

        // Filter: hanya unit kerja tertentu (untuk penyelia)
        if (!empty($filters['department_ids'])) {
            $query->whereIn('department_id', $filters['department_ids']);
        }

        // Filter: rentang tanggal
        if (!empty($filters['date_from'])) {
            $query->where('transaction_date', '>=', $filters['date_from']);
        }
        if (!empty($filters['date_to'])) {
            $query->where('transaction_date', '<=', $filters['date_to']);
        }

        // Sorting (default: terbaru)
        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortDir = $filters['sort_dir'] ?? 'desc';
        $allowedSorts = ['document_number', 'transaction_date', 'status', 'created_at'];

        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortDir === 'asc' ? 'asc' : 'desc');
        }

        $page = request()->get('page', 1);
        $version = Cache::get('outbounds_version', '0');
        $cacheKey = "outbounds_paginate_v{$version}_" . md5(json_encode(func_get_args()) . $page);

        return Cache::remember($cacheKey, 3600, function () use ($query, $perPage) {
            return $query->paginate($perPage)->onEachSide(1)->withQueryString();
        });
    }

    public function findById(int $id): ?OutboundTransaction
    {
        $version = Cache::get('outbounds_version', '0');
        return Cache::remember("outbounds_find_v{$version}_{$id}", 3600, function () use ($id) {
            return OutboundTransaction::with([
                'requester', 'approver', 'issuedByUser', 'handedOverByUser', 'pickedUpByUser',
                'department', 'details.item',
            ])->find($id);
        });
    }

    public function create(array $data): OutboundTransaction
    {
        return OutboundTransaction::create($data);
    }

    public function update(OutboundTransaction $outbound, array $data): bool
    {
        return $outbound->update($data);
    }

    public function delete(OutboundTransaction $outbound): bool
    {
        return $outbound->delete();
    }

    public function generateDocumentNumber(): string
    {
        $prefix = 'OUT-' . now()->format('Ym') . '-';

        $last = OutboundTransaction::where('document_number', 'like', $prefix . '%')
            ->orderByRaw("CAST(SUBSTRING(document_number, " . (strlen($prefix) + 1) . ") AS UNSIGNED) DESC")
            ->first();

        if ($last && preg_match('/(\d+)$/', $last->document_number, $matches)) {
            $nextNumber = (int) $matches[1] + 1;
        } else {
            $nextNumber = 1;
        }

        return $prefix . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
    }
}
