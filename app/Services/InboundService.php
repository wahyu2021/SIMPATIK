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
    public function createInbound(\App\DTOs\Transaction\InboundDTO $dto): InboundTransaction
    {
        return DB::transaction(function () use ($dto) {
            $referenceNumber = $dto->reference_number;
            if (empty($referenceNumber)) {
                $referenceNumber = $this->inboundRepository->generateReferenceNumber();
            }

            $receiptPath = null;
            if ($dto->receipt_image) {
                $receiptPath = $this->storeReceiptImage($dto->receipt_image);
            }

            $inbound = $this->inboundRepository->create([
                'user_id'          => $dto->user_id,
                'reference_number' => $referenceNumber,
                'transaction_date' => $dto->transaction_date,
                'notes'            => $dto->notes,
                'receipt_image_path' => $receiptPath,
            ]);

            foreach ($dto->details as $detail) {
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
                    'transaction_date'   => $dto->transaction_date,
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
    public function updateInbound(InboundTransaction $inbound, \App\DTOs\Transaction\InboundDTO $dto): InboundTransaction
    {
        return DB::transaction(function () use ($inbound, $dto) {
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

            $receiptPath = $inbound->receipt_image_path;
            if ($dto->receipt_image) {
                $this->deleteReceiptImage($receiptPath);
                $receiptPath = $this->storeReceiptImage($dto->receipt_image);
            }

            $this->inboundRepository->update($inbound, [
                'reference_number' => $dto->reference_number ?: $inbound->reference_number,
                'transaction_date' => $dto->transaction_date,
                'notes'            => $dto->notes,
                'receipt_image_path' => $receiptPath,
            ]);

            $inbound->refresh();

            foreach ($dto->details as $detail) {
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
                    'transaction_date'   => $dto->transaction_date,
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

            $this->deleteReceiptImage($inbound->receipt_image_path);

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

    private function storeReceiptImage($file): string
    {
        return \Illuminate\Support\Facades\Storage::disk('public')->putFile('inbound-receipts', $file);
    }

    private function deleteReceiptImage(?string $path): void
    {
        if ($path) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($path);
        }
    }
}
