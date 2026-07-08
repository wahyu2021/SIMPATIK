<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\OutboundTransaction;
use App\Models\OutboundTransactionDetail;
use App\Models\StockLedger;
use App\Models\Item;
use App\Models\User;
use Carbon\Carbon;

class OutboundJuli2026Seeder extends Seeder
{
    /**
     * Run the database seeds for July 2026 Outbound (Barang Keluar).
     *
     * [Catatan Demonstrasi & Keamanan Stok]
     * - Seeder ini dirancang untuk mendemonstrasikan sistem tanpa menghabiskan stok riil di gudang.
     * - Hanya mengambil sedikit barang (1-5 pcs) dan hanya menargetkan barang yang memiliki stok > 15.
     * - Status langsung diset menjadi 'Completed' agar BAST bisa langsung didemonstrasikan.
     */
    public function run()
    {
        $admin = User::role('warehouse_admin')->first();
        if (!$admin) return;

        // Buat 15 transaksi pengeluaran barang
        for ($i = 1; $i <= 15; $i++) {
            $requester = User::role('staff')->inRandomOrder()->first();
            if (!$requester) continue;

            $head = User::role('division_head')->where('department_id', $requester->department_id)->first() ?? $admin;

            $date = Carbon::parse('2026-07-01')->addDays(rand(2, 8))->setHour(rand(8, 15))->setMinute(rand(0, 59));
            
            $transaction = OutboundTransaction::create([
                'requester_id' => $requester->id,
                'department_id' => $requester->department_id,
                'document_number' => 'OUT-JUL-2026-' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'transaction_date' => $date->format('Y-m-d H:i:s'),
                'status' => 'Completed', // Langsung Completed agar bisa langsung cetak BAST
                'is_special_request' => false,
                'notes' => 'Pengajuan Rutin ATK Divisi',
                'approver_id' => $head->id,
                'approved_at' => $date->copy()->addHours(1),
                'issued_by' => $admin->id,
                'issued_at' => $date->copy()->addHours(2),
                'handed_over_by' => $admin->id,
                'handed_over_at' => $date->copy()->addHours(2)->addMinutes(30),
                'picked_up_by' => $requester->id,
                'picked_up_at' => $date->copy()->addHours(3), // Rantai logistik selesai di waktu ini
            ]);

            // Hanya pilih barang yang stoknya masih di atas 15 (Proteksi stok agar tidak habis saat demo)
            $items = Item::where('current_stock', '>', 15)->inRandomOrder()->limit(rand(1, 4))->get();

            foreach ($items as $item) {
                $qty = rand(1, 5); // Ambil sedikit saja agar stok di Dasbor tetap hijau/aman

                OutboundTransactionDetail::create([
                    'outbound_transaction_id' => $transaction->id,
                    'item_id' => $item->id,
                    'quantity_requested' => $qty,
                    'quantity_approved' => $qty,
                ]);

                $newStock = max(0, $item->current_stock - $qty);
                $item->update(['current_stock' => $newStock]);

                StockLedger::create([
                    'item_id' => $item->id,
                    'transaction_date' => $transaction->transaction_date,
                    'movement_type' => 'out',
                    'document_reference' => $transaction->document_number,
                    'qty_in' => 0,
                    'qty_out' => $qty,
                    'ending_balance' => $newStock,
                ]);
            }
        }
    }
}
