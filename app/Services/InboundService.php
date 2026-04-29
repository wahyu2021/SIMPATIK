<?php

namespace App\Services;

use App\Models\InboundTransaction;
use App\Models\Item;
use App\Models\StockLedger;
use App\Repositories\Contracts\InboundRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class InboundService
{
    public function __construct(
        private InboundRepositoryInterface $inboundRepository
    ) {}

    /**
     * Ambil daftar transaksi barang masuk dengan pagination dan filter.
     */
    public function getInbounds(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->inboundRepository->paginate($perPage, $filters);
    }

    /**
     * Cari transaksi barang masuk berdasarkan ID.
     *
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException
     */
    public function findInbound(int $id): InboundTransaction
    {
        $inbound = $this->inboundRepository->findById($id);

        if (!$inbound) {
            abort(404, 'Transaksi barang masuk tidak ditemukan.');
        }

        return $inbound;
    }

    /**
     * Buat transaksi barang masuk baru.
     * Simpan header + detail, update stok (pessimistic lock), dan catat StockLedger.
     */
    public function createInbound(array $data): InboundTransaction
    {
        return DB::transaction(function () use ($data) {
            if (empty($data['reference_number'])) {
                $data['reference_number'] = $this->inboundRepository->generateReferenceNumber();
            }

            $inbound = $this->inboundRepository->create([
                'user_id'          => $data['user_id'],
                'reference_number' => $data['reference_number'],
                'transaction_date' => $data['transaction_date'],
                'notes'            => $data['notes'] ?? null,
            ]);

            foreach ($data['details'] as $detail) {
                $inbound->details()->create([
                    'item_id'    => $detail['item_id'],
                    'quantity'   => $detail['quantity'],
                    'unit_price' => $detail['unit_price'],
                ]);

                $item = Item::lockForUpdate()->findOrFail($detail['item_id']);
                $newStock = $item->current_stock + (int) $detail['quantity'];
                $item->update(['current_stock' => $newStock]);

                StockLedger::create([
                    'item_id'            => $detail['item_id'],
                    'transaction_date'   => $data['transaction_date'],
                    'movement_type'      => 'in',
                    'document_reference' => $inbound->reference_number,
                    'qty_in'             => (int) $detail['quantity'],
                    'qty_out'            => 0,
                    'ending_balance'     => $newStock,
                ]);
            }

            return $inbound->load('details.item');
        });
    }

    /**
     * Update transaksi barang masuk.
     * Rollback stok lama → hapus detail/ledger → simpan ulang detail baru + stok + ledger.
     */
    public function updateInbound(InboundTransaction $inbound, array $data): InboundTransaction
    {
        return DB::transaction(function () use ($inbound, $data) {
            $inbound->load('details');

            foreach ($inbound->details as $oldDetail) {
                $item = Item::lockForUpdate()->findOrFail($oldDetail->item_id);
                $stockAfterRollback = $item->current_stock - $oldDetail->quantity;

                if ($stockAfterRollback < 0) {
                    abort(422, "Tidak dapat mengubah transaksi: stok \"{$item->name}\" akan negatif ({$stockAfterRollback}). Barang sudah terpakai.");
                }

                $item->update(['current_stock' => $stockAfterRollback]);
            }

            $this->deleteLedgerEntries($inbound);
            $inbound->details()->delete();

            $this->inboundRepository->update($inbound, [
                'reference_number' => $data['reference_number'] ?? $inbound->reference_number,
                'transaction_date' => $data['transaction_date'],
                'notes'            => $data['notes'] ?? null,
            ]);

            $inbound->refresh();

            foreach ($data['details'] as $detail) {
                $inbound->details()->create([
                    'item_id'    => $detail['item_id'],
                    'quantity'   => $detail['quantity'],
                    'unit_price' => $detail['unit_price'],
                ]);

                $item = Item::lockForUpdate()->findOrFail($detail['item_id']);
                $newStock = $item->current_stock + (int) $detail['quantity'];
                $item->update(['current_stock' => $newStock]);

                StockLedger::create([
                    'item_id'            => $detail['item_id'],
                    'transaction_date'   => $data['transaction_date'],
                    'movement_type'      => 'in',
                    'document_reference' => $inbound->reference_number,
                    'qty_in'             => (int) $detail['quantity'],
                    'qty_out'            => 0,
                    'ending_balance'     => $newStock,
                ]);
            }

            return $inbound->load('details.item');
        });
    }

    /**
     * Hapus transaksi barang masuk beserta rollback stok dan ledger terkait.
     */
    public function deleteInbound(InboundTransaction $inbound): bool
    {
        return DB::transaction(function () use ($inbound) {
            $inbound->load('details');

            foreach ($inbound->details as $detail) {
                $item = Item::lockForUpdate()->findOrFail($detail->item_id);
                $stockAfterRollback = $item->current_stock - $detail->quantity;

                if ($stockAfterRollback < 0) {
                    abort(422, "Tidak dapat menghapus transaksi: stok \"{$item->name}\" akan negatif ({$stockAfterRollback}). Barang sudah terpakai.");
                }

                $item->update(['current_stock' => $stockAfterRollback]);
            }

            $this->deleteLedgerEntries($inbound);
            $inbound->details()->delete();

            return $this->inboundRepository->delete($inbound);
        });
    }

    /**
     * Generate nomor referensi berikutnya (untuk preview di form).
     */
    public function getNextReferenceNumber(): string
    {
        return $this->inboundRepository->generateReferenceNumber();
    }

    /**
     * Hapus StockLedger entries milik transaksi inbound ini.
     * Filter tambahan item_ids agar tidak menghapus ledger transaksi lain dengan reference sama.
     */
    private function deleteLedgerEntries(InboundTransaction $inbound): void
    {
        $itemIds = $inbound->details->pluck('item_id')->toArray();

        StockLedger::where('document_reference', $inbound->reference_number)
            ->where('movement_type', 'in')
            ->whereIn('item_id', $itemIds)
            ->delete();
    }
}
