<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\InboundTransaction;
use App\Models\InboundTransactionDetail;
use App\Models\Item;
use App\Models\User;
use App\Models\StockLedger;
use Carbon\Carbon;

class InboundJuli2026Seeder extends Seeder
{
    /**
     * Run the database seeds for July 2026 Inbound (Barang Masuk).
     *
     * [Catatan Demonstrasi & Keamanan Stok]
     * - Seeder ini adalah fondasi utama agar Dasbor tidak kosong.
     * - Sengaja menyuntikkan stok dalam jumlah sangat besar (50-150 pcs) ke banyak barang
     *   untuk memastikan ketersediaan barang aman sebelum transaksi Outbound dieksekusi.
     */
    public function run()
    {
        $admin = User::role('warehouse_admin')->first();
        if (!$admin) return;

        $date = Carbon::parse('2026-07-02')->setHour(rand(8, 15))->setMinute(rand(0, 59));

        $transaction = InboundTransaction::create([
            'user_id' => $admin->id,
            'reference_number' => 'IN-JUL-2026-001',
            'transaction_date' => $date->format('Y-m-d'),
            'receipt_image_path' => 'receipts/dummy-receipt.jpg',
            'notes' => 'Restock Besar-besaran Juli 2026 (Persiapan Demo)'
        ]);

        // Pilih 25 barang secara acak untuk di-restock secara masif (memenuhi gudang virtual)
        $items = Item::inRandomOrder()->limit(25)->get();
        foreach ($items as $item) {
            $qty = rand(50, 150); // Restock dalam jumlah besar agar terhindar dari status 'Out of Stock'
            
            InboundTransactionDetail::create([
                'inbound_transaction_id' => $transaction->id,
                'item_id' => $item->id,
                'quantity' => $qty,
                'unit_price' => rand(5, 50) * 1000,
            ]);

            $newStock = $item->current_stock + $qty;
            $item->update(['current_stock' => $newStock]);

            StockLedger::create([
                'item_id' => $item->id,
                'transaction_date' => $transaction->transaction_date,
                'movement_type' => 'in',
                'document_reference' => $transaction->reference_number,
                'qty_in' => $qty,
                'qty_out' => 0,
                'ending_balance' => $newStock,
            ]);
        }
    }
}
