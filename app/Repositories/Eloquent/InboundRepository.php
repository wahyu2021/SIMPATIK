<?php

namespace App\Repositories\Eloquent;

use App\Models\InboundTransaction;
use App\Repositories\Contracts\InboundRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class InboundRepository implements InboundRepositoryInterface
{
    public function paginate(int $perPage = 15, array $filters = []): LengthAwarePaginator
    {
        $query = InboundTransaction::with(['user', 'details.item']);

        // Search: nomor referensi atau catatan
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('reference_number', 'like', "%{$filters['search']}%")
                  ->orWhere('notes', 'like', "%{$filters['search']}%");
            });
        }

        // Filter berdasarkan rentang tanggal
        if (!empty($filters['date_from'])) {
            $query->where('transaction_date', '>=', $filters['date_from']);
        }
        if (!empty($filters['date_to'])) {
            $query->where('transaction_date', '<=', $filters['date_to']);
        }

        // Sorting (default: terbaru)
        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortDir = $filters['sort_dir'] ?? 'desc';
        $allowedSorts = ['reference_number', 'transaction_date', 'created_at'];

        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortDir === 'asc' ? 'asc' : 'desc');
        }

        return $query->paginate($perPage)->withQueryString();
    }

    public function findById(int $id): ?InboundTransaction
    {
        return InboundTransaction::with(['user', 'details.item'])->find($id);
    }

    public function create(array $data): InboundTransaction
    {
        return InboundTransaction::create($data);
    }

    public function update(InboundTransaction $inbound, array $data): bool
    {
        return $inbound->update($data);
    }

    public function delete(InboundTransaction $inbound): bool
    {
        return $inbound->delete();
    }

    public function generateReferenceNumber(): string
    {
        $prefix = 'INB-' . now()->format('Ym') . '-';

        $lastTransaction = InboundTransaction::where('reference_number', 'like', $prefix . '%')
            ->orderByRaw("CAST(SUBSTRING(reference_number, " . (strlen($prefix) + 1) . ") AS UNSIGNED) DESC")
            ->first();

        if ($lastTransaction && preg_match('/(\d+)$/', $lastTransaction->reference_number, $matches)) {
            $nextNumber = (int) $matches[1] + 1;
        } else {
            $nextNumber = 1;
        }

        return $prefix . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
    }
}
