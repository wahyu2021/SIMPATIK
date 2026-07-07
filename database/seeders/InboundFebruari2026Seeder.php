<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\InboundTransaction;
use App\Models\InboundTransactionDetail;
use App\Models\Item;
use App\Models\User;

class InboundFebruari2026Seeder extends Seeder
{
    public function run()
    {
        $file = database_path('seeders/data/inbound_februari_2026.csv');
        if (!file_exists($file)) return;
        
        $user = User::first();
        $userId = $user ? $user->id : 1;

        $transaction = InboundTransaction::create([
            'user_id' => $userId,
            'reference_number' => 'IN-FEB-2026-001',
            'transaction_date' => '2026-02-27',
            'receipt_image_path' => 'receipts/dummy-receipt.jpg',
            'notes' => 'Seeding Barang Masuk Februari 2026'
        ]);

        $handle = fopen($file, 'r');
        $header = fgetcsv($handle, 1000, ',');
        
        while (($data = fgetcsv($handle, 1000, ',')) !== false) {
            $row = array_combine($header, $data);
            $item = Item::where('name', $row['item_name'])->first();
            
            if ($item) {
                $qty = $row['inbound_qty'];
                InboundTransactionDetail::create([
                    'inbound_transaction_id' => $transaction->id,
                    'item_id' => $item->id,
                    'quantity' => $qty,
                    'unit_price' => $row['unit_price'] ?: 0,
                ]);

                $newStock = $item->current_stock + $qty;
                $item->update(['current_stock' => $newStock]);

                \App\Models\StockLedger::create([
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
        fclose($handle);
    }
}
