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
     * Edit pengajuan yang masih Pending.
     * Header data diperbarui, detail lama dihapus dan diganti detail baru.
     */
    public function updateRequest(OutboundTransaction $outbound, array $data): OutboundTransaction
    {
        if (!$outbound->isPending()) {
            abort(422, 'Hanya pengajuan berstatus "Menunggu" yang dapat diedit.');
        }

        return DB::transaction(function () use ($outbound, $data) {
            $this->outboundRepository->update($outbound, [
                'department_id'    => $data['department_id'],
                'transaction_date' => $data['transaction_date'],
                'is_special_request' => $data['is_special_request'] ?? false,
                'notes'            => $data['notes'] ?? null,
            ]);

            $outbound->details()->delete();

            foreach ($data['details'] as $detail) {
                $outbound->details()->create([
                    'item_id'            => $detail['item_id'],
                    'quantity_requested' => $detail['quantity_requested'],
                    'quantity_approved'  => 0,
                    'notes'              => $detail['notes'] ?? null,
                ]);
            }

            return $outbound->refresh()->load('details.item');
        });
    }

    /**
     * Penyelia setujui pengajuan (Pending → Approved).
     *
     * @param array<int,int>|null $quantities  Mapping [detail_id => quantity_approved].
     *                                         Jika null, quantity_approved = quantity_requested.
     */
    public function approveRequest(OutboundTransaction $outbound, int $approverId, ?array $quantities = null): OutboundTransaction
    {
        if (!$outbound->isPending()) {
            abort(422, 'Hanya pengajuan berstatus "Menunggu" yang dapat disetujui.');
        }

        return DB::transaction(function () use ($outbound, $approverId, $quantities) {
            $this->outboundRepository->update($outbound, [
                'status'      => OutboundStatus::Approved,
                'approver_id' => $approverId,
                'approved_at' => now(),
            ]);

            foreach ($outbound->details as $detail) {
                $qty = $quantities[$detail->id] ?? $detail->quantity_requested;
                $detail->update([
                    'quantity_approved' => min($qty, $detail->quantity_requested),
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
     * Admin Gudang menyetujui pengeluaran barang (Approved → Issued / Siap Diambil).
     * Kurangi stok dengan pessimistic lock, catat ledger OUT.
     * Barang siap diambil oleh karyawan pemohon.
     */
    public function issueItems(OutboundTransaction $outbound, int $issuedById): OutboundTransaction
    {
        if (!$outbound->isApproved()) {
            abort(422, 'Hanya pengajuan berstatus "Disetujui" yang dapat diproses.');
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
     * Admin Gudang serahkan barang (Issued → Handed Over).
     * Tahap pertama dari dual confirmation.
     */
    public function handoverItems(OutboundTransaction $outbound, int $handedOverById): OutboundTransaction
    {
        if (!$outbound->isIssued()) {
            abort(422, 'Hanya pengajuan berstatus "Siap Diambil" yang dapat diserahkan.');
        }

        $this->outboundRepository->update($outbound, [
            'status'          => OutboundStatus::HandedOver,
            'handed_over_by'  => $handedOverById,
            'handed_over_at'  => now(),
        ]);

        return $outbound->refresh()->load('details.item');
    }

    /**
     * Pemohon konfirmasi penerimaan barang (Handed Over → Completed).
     * Tahap kedua dari dual confirmation — hanya pemohon yang bisa.
     */
    public function pickupItems(OutboundTransaction $outbound, int $pickedUpById): OutboundTransaction
    {
        if (!$outbound->isHandedOver()) {
            abort(422, 'Hanya pengajuan berstatus "Diserahkan" yang dapat dikonfirmasi penerimaannya.');
        }

        $this->outboundRepository->update($outbound, [
            'status'       => OutboundStatus::Completed,
            'picked_up_by' => $pickedUpById,
            'picked_up_at' => now(),
        ]);

        return $outbound->refresh()->load('details.item');
    }

    /**
     * Batalkan pengajuan (hanya jika Pending dan oleh pemiliknya).
     * Menggunakan soft delete agar data tetap tersedia untuk audit.
     */
    public function cancelRequest(OutboundTransaction $outbound): bool
    {
        if (!$outbound->isPending()) {
            abort(422, 'Hanya pengajuan berstatus "Menunggu" yang dapat dibatalkan.');
        }

        return $outbound->delete();
    }

    /**
     * Generate nomor dokumen berikutnya (untuk preview di form).
     */
    public function getNextDocumentNumber(): string
    {
        return $this->outboundRepository->generateDocumentNumber();
    }
}
