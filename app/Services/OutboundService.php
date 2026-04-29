<?php

namespace App\Services;

use App\Enums\OutboundStatus;
use App\Models\Item;
use App\Models\OutboundTransaction;
use App\Models\StockLedger;
use App\Repositories\Contracts\OutboundRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class OutboundService
{
    public function __construct(
        private OutboundRepositoryInterface $outboundRepository
    ) {}

    /**
     * Ambil daftar pengajuan barang dengan pagination dan filter.
     */
    public function getOutbounds(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->outboundRepository->paginate($perPage, $filters);
    }

    /**
     * Cari pengajuan berdasarkan ID.
     *
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException
     */
    public function findOutbound(int $id): OutboundTransaction
    {
        $outbound = $this->outboundRepository->findById($id);

        if (!$outbound) {
            abort(404, 'Pengajuan barang tidak ditemukan.');
        }

        return $outbound;
    }

    /**
     * Buat pengajuan barang baru (status: Pending).
     */
    public function createRequest(array $data): OutboundTransaction
    {
        return DB::transaction(function () use ($data) {
            if (empty($data['document_number'])) {
                $data['document_number'] = $this->outboundRepository->generateDocumentNumber();
            }

            $outbound = $this->outboundRepository->create([
                'requester_id'     => $data['requester_id'],
                'department_id'    => $data['department_id'],
                'document_number'  => $data['document_number'],
                'transaction_date' => $data['transaction_date'],
                'status'           => OutboundStatus::Pending,
                'is_special_request' => $data['is_special_request'] ?? false,
                'notes'            => $data['notes'] ?? null,
            ]);

            foreach ($data['details'] as $detail) {
                $outbound->details()->create([
                    'item_id'            => $detail['item_id'],
                    'quantity_requested' => $detail['quantity_requested'],
                    'quantity_approved'  => 0,
                    'notes'              => $detail['notes'] ?? null,
                ]);
            }

            return $outbound->load('details.item');
        });
    }

    /**
     * Penyelia setujui pengajuan (Pending → Approved).
     * quantity_approved otomatis diisi sama dengan quantity_requested.
     */
    public function approveRequest(OutboundTransaction $outbound, int $approverId): OutboundTransaction
    {
        if (!$outbound->isPending()) {
            abort(422, 'Hanya pengajuan berstatus "Menunggu" yang dapat disetujui.');
        }

        return DB::transaction(function () use ($outbound, $approverId) {
            $this->outboundRepository->update($outbound, [
                'status'      => OutboundStatus::Approved,
                'approver_id' => $approverId,
                'approved_at' => now(),
            ]);

            // Set quantity_approved = quantity_requested untuk semua detail
            foreach ($outbound->details as $detail) {
                $detail->update([
                    'quantity_approved' => $detail->quantity_requested,
                ]);
            }

            return $outbound->refresh()->load('details.item');
        });
    }

    /**
     * Penyelia tolak pengajuan (Pending → Rejected).
     */
    public function rejectRequest(OutboundTransaction $outbound, int $approverId, string $reason): OutboundTransaction
    {
        if (!$outbound->isPending()) {
            abort(422, 'Hanya pengajuan berstatus "Menunggu" yang dapat ditolak.');
        }

        $this->outboundRepository->update($outbound, [
            'status'           => OutboundStatus::Rejected,
            'approver_id'      => $approverId,
            'approved_at'      => now(),
            'rejection_reason' => $reason,
        ]);

        return $outbound->refresh()->load('details.item');
    }

    /**
     * Admin serahkan barang (Approved → Issued).
     * Kurangi stok dengan pessimistic lock, catat ledger OUT.
     */
    public function issueItems(OutboundTransaction $outbound, int $issuedById): OutboundTransaction
    {
        if (!$outbound->isApproved()) {
            abort(422, 'Hanya pengajuan berstatus "Disetujui" yang dapat diserahkan.');
        }

        return DB::transaction(function () use ($outbound, $issuedById) {
            $outbound->load('details');

            foreach ($outbound->details as $detail) {
                $qtyOut = $detail->quantity_approved;
                if ($qtyOut <= 0) continue;

                $item = Item::lockForUpdate()->findOrFail($detail->item_id);

                if ($item->current_stock < $qtyOut) {
                    abort(422, "Stok \"{$item->name}\" tidak mencukupi. Tersedia: {$item->current_stock}, dibutuhkan: {$qtyOut}.");
                }

                $newStock = $item->current_stock - $qtyOut;
                $item->update(['current_stock' => $newStock]);

                StockLedger::create([
                    'item_id'            => $detail->item_id,
                    'transaction_date'   => $outbound->transaction_date,
                    'movement_type'      => 'out',
                    'document_reference' => $outbound->document_number,
                    'qty_in'             => 0,
                    'qty_out'            => $qtyOut,
                    'ending_balance'     => $newStock,
                ]);
            }

            $this->outboundRepository->update($outbound, [
                'status'    => OutboundStatus::Issued,
                'issued_by' => $issuedById,
                'issued_at' => now(),
            ]);

            return $outbound->refresh()->load('details.item');
        });
    }

    /**
     * Batalkan pengajuan (hanya jika Pending dan oleh pemiliknya).
     */
    public function cancelRequest(OutboundTransaction $outbound): bool
    {
        if (!$outbound->isPending()) {
            abort(422, 'Hanya pengajuan berstatus "Menunggu" yang dapat dibatalkan.');
        }

        $outbound->details()->delete();
        return $this->outboundRepository->delete($outbound);
    }

    /**
     * Generate nomor dokumen berikutnya (untuk preview di form).
     */
    public function getNextDocumentNumber(): string
    {
        return $this->outboundRepository->generateDocumentNumber();
    }
}
