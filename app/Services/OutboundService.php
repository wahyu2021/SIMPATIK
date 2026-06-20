<?php

namespace App\Services;

use App\Enums\OutboundStatus;
use App\Models\Item;
use App\Models\OutboundTransaction;
use App\Models\StockLedger;
use App\Models\User;
use App\Notifications\LowStockAlertNotification;
use App\Notifications\NewOutboundRequestNotification;
use App\Notifications\OutboundReadyForIssueNotification;
use App\Notifications\OutboundStatusUpdatedNotification;
use App\Repositories\Contracts\OutboundRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

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
    public function createRequest(\App\DTOs\Transaction\OutboundDTO $dto): OutboundTransaction
    {
        return DB::transaction(function () use ($dto) {
            $documentNumber = $dto->document_number;
            if (empty($documentNumber)) {
                $documentNumber = $this->outboundRepository->generateDocumentNumber();
            }

            $requester = User::query()->find($dto->requester_id);
            $isSupervisor = $requester && $requester->hasRole('division_head');
            $status = $isSupervisor ? OutboundStatus::Approved : OutboundStatus::Pending;

            $outboundData = [
                'requester_id'     => $dto->requester_id,
                'department_id'    => $dto->department_id,
                'document_number'  => $documentNumber,
                'transaction_date' => $dto->transaction_date,
                'status'           => $status,
                'is_special_request' => $dto->is_special_request,
                'notes'            => $dto->notes,
            ];

            if ($isSupervisor) {
                $outboundData['approver_id'] = $requester->id;
                $outboundData['approved_at'] = now();
            }

            $outbound = $this->outboundRepository->create($outboundData);

            foreach ($dto->details as $detail) {
                $outbound->details()->create([
                    'item_id'            => $detail['item_id'],
                    'quantity_requested' => $detail['quantity_requested'] ?? $detail['quantity'],
                    'quantity_approved'  => $isSupervisor ? ($detail['quantity_requested'] ?? $detail['quantity']) : 0,
                    'notes'              => $detail['notes'] ?? null,
                ]);
            }

            $outbound->load(['requester', 'department', 'details.item']);

            if ($isSupervisor) {
                // Notifikasi ke Admin Gudang bahwa ada barang yg harus disiapkan
                $admins = User::role('warehouse_admin')->get();
                Notification::send($admins, new OutboundReadyForIssueNotification($outbound));
            } else {
                // Notifikasi ke Penyelia di departemen yang sama
                $supervisors = User::role('division_head')
                    ->where('department_id', $outbound->department_id)
                    ->get();
                
                Notification::send($supervisors, new NewOutboundRequestNotification($outbound));
            }

            return $outbound;
        });
    }

    /**
     * Buat pengajuan barang langsung (Direct Request - Bypass Approval).
     * Status langsung menjadi Issued dan stok dipotong.
     */
    public function createDirectRequest(\App\DTOs\Transaction\OutboundDTO $dto, int $adminId): OutboundTransaction
    {
        return DB::transaction(function () use ($dto, $adminId) {
            $documentNumber = $dto->document_number;
            if (empty($documentNumber)) {
                $documentNumber = $this->outboundRepository->generateDocumentNumber();
            }

            $outbound = $this->outboundRepository->create([
                'requester_id'     => $dto->requester_id,
                'department_id'    => $dto->department_id,
                'document_number'  => $documentNumber,
                'transaction_date' => $dto->transaction_date,
                'status'           => OutboundStatus::Issued, // Langsung Issued
                'is_special_request' => $dto->is_special_request,
                'is_direct_request'  => true,
                'issued_by'        => $adminId,
                'issued_at'        => now(),
                'notes'            => $dto->notes ?? 'Input langsung oleh Admin Gudang.',
            ]);

            foreach ($dto->details as $detail) {
                $qty = $detail['quantity'] ?? $detail['quantity_requested'];
                
                // 1. Simpan detail
                $outbound->details()->create([
                    'item_id'            => $detail['item_id'],
                    'quantity_requested' => $qty,
                    'quantity_approved'  => $qty,
                    'notes'              => $detail['notes'] ?? null,
                ]);

                // 2. Potong Stok (Pessimistic Locking)
                $item = Item::lockForUpdate()->findOrFail($detail['item_id']);

                if ($item->current_stock < $qty) {
                    abort(422, "Stok \"{$item->name}\" tidak mencukupi. Tersedia: {$item->current_stock}, dibutuhkan: {$qty}.");
                }

                $newStock = $item->current_stock - $qty;
                $item->update(['current_stock' => $newStock]);

                // 3. Catat Ledger
                StockLedger::create([
                    'item_id'            => $detail['item_id'],
                    'transaction_date'   => $dto->transaction_date,
                    'movement_type'      => 'out',
                    'document_reference' => $documentNumber,
                    'qty_in'             => 0,
                    'qty_out'            => $qty,
                    'ending_balance'     => $newStock,
                ]);
            }

            return $outbound->load('details.item');
        });
    }

    /**
     * Edit pengajuan yang masih Pending.
     * Header data diperbarui, detail lama dihapus dan diganti detail baru.
     */
    public function updateRequest(OutboundTransaction $outbound, \App\DTOs\Transaction\OutboundDTO $dto): OutboundTransaction
    {
        if (!$outbound->isPending()) {
            abort(422, 'Hanya pengajuan berstatus "Menunggu" yang dapat diedit.');
        }

        return DB::transaction(function () use ($outbound, $dto) {
            $this->outboundRepository->update($outbound, [
                'department_id'    => $dto->department_id,
                'transaction_date' => $dto->transaction_date,
                'is_special_request' => $dto->is_special_request,
                'notes'            => $dto->notes,
            ]);

            $outbound->details()->delete();

            foreach ($dto->details as $detail) {
                $outbound->details()->create([
                    'item_id'            => $detail['item_id'],
                    'quantity_requested' => $detail['quantity_requested'] ?? $detail['quantity'],
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

            $outbound->refresh()->load(['requester', 'details.item']);

            // Notifikasi ke Pemohon
            $outbound->requester->notify(new OutboundStatusUpdatedNotification($outbound));

            // Notifikasi ke Admin Gudang agar tahu ada barang yang harus disiapkan
            $admins = User::role('warehouse_admin')->get();
            Notification::send($admins, new OutboundReadyForIssueNotification($outbound));

            return $outbound;
        });
    }


    /**
     * Tolak pengajuan (Pending / Approved → Rejected).
     */
    public function rejectRequest(OutboundTransaction $outbound, int $rejectorId, string $reason): OutboundTransaction
    {
        if (!$outbound->isPending() && !$outbound->isApproved()) {
            abort(422, 'Hanya pengajuan berstatus "Menunggu" atau "Disetujui" yang dapat ditolak.');
        }

        $this->outboundRepository->update($outbound, [
            'status'           => OutboundStatus::Rejected,
            'approver_id'      => $rejectorId, // Dicatat siapa yang menolak (bisa penyelia atau admin)
            'approved_at'      => now(),
            'rejection_reason' => $reason,
        ]);

        $outbound->refresh()->load(['requester', 'details.item']);
        
        // Notifikasi ke Pemohon
        $outbound->requester->notify(new OutboundStatusUpdatedNotification($outbound));

        return $outbound;
    }

    /**
     * Admin Gudang menyetujui pengeluaran barang (Approved → Issued / Siap Diambil).
     * Kurangi stok dengan pessimistic lock, catat ledger OUT.
     * Barang siap diambil oleh karyawan pemohon.
     *
     * @param array<int,int>|null $quantities Mapping [detail_id => final_quantity_issued].
     */
    public function issueItems(OutboundTransaction $outbound, int $issuedById, ?array $quantities = null): OutboundTransaction
    {
        if (!$outbound->isApproved()) {
            abort(422, 'Hanya pengajuan berstatus "Disetujui" yang dapat diproses.');
        }

        return DB::transaction(function () use ($outbound, $issuedById, $quantities) {
            $outbound->load('details');

            foreach ($outbound->details as $detail) {
                // Admin bisa menyesuaikan lagi jumlah yang dikeluarkan (tidak boleh melebihi yang diapprove penyelia)
                $qtyOut = $quantities[$detail->id] ?? $detail->quantity_approved;
                $qtyOut = min($qtyOut, $detail->quantity_approved); // Pastikan admin tidak mengeluarkan melebihi persetujuan

                if ($qtyOut != $detail->quantity_approved) {
                    $detail->update(['quantity_approved' => $qtyOut]);
                }

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

                // Notifikasi Stok Rendah ke Admin Gudang jika threshold tercapai
                if ($item->current_stock <= $item->minimum_stock_level) {
                    $admins = User::role('warehouse_admin')->get();
                    Notification::send($admins, new LowStockAlertNotification($item));
                }
            }

            $this->outboundRepository->update($outbound, [
                'status'    => OutboundStatus::Issued,
                'issued_by' => $issuedById,
                'issued_at' => now(),
            ]);

            $outbound->refresh()->load(['requester', 'details.item']);
            
            // Notifikasi ke Pemohon
            $outbound->requester->notify(new OutboundStatusUpdatedNotification($outbound));

            return $outbound;
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

        $outbound->refresh()->load(['requester', 'details.item']);
        
        // Notifikasi ke Pemohon
        $outbound->requester->notify(new OutboundStatusUpdatedNotification($outbound));

        return $outbound;
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

        $outbound->refresh()->load(['requester', 'details.item']);
        
        // Notifikasi ke Pemohon (konfirmasi selesai)
        $outbound->requester->notify(new OutboundStatusUpdatedNotification($outbound));

        return $outbound;
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
