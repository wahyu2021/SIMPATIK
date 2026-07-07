<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\OutboundTransaction;
use App\Models\OutboundTransactionDetail;
use App\Models\StockLedger;
use App\Models\Item;
use App\Models\User;
use Carbon\Carbon;

class OutboundDesember2025Seeder extends Seeder
{
    public function run()
    {
        $file = database_path('seeders/data/outbound_desember_2025.csv');
        if (!file_exists($file)) return;
        
        $admin = User::role('warehouse_admin')->first();
        if (!$admin) return;

        $handle = fopen($file, 'r');
        $header = fgetcsv($handle, 1000, ',');
        
        $outboundItems = [];
        while (($data = fgetcsv($handle, 1000, ',')) !== false) {
            $row = array_combine($header, $data);
            $item = Item::where('name', $row['item_name'])->first();
            if ($item) {
                $outboundItems[] = [
                    'item' => $item,
                    'qty' => $row['outbound_qty']
                ];
            }
        }
        fclose($handle);

        shuffle($outboundItems);

        $docCounter = 1;
        while (count($outboundItems) > 0) {
            $chunkSize = rand(1, 3);
            $itemsForThisRequest = array_splice($outboundItems, 0, $chunkSize);

            $requester = User::role('staff')->inRandomOrder()->first();
            if (!$requester) continue;

            $head = User::role('division_head')->where('department_id', $requester->department_id)->first() ?? $admin;

            $date = Carbon::parse('2025-12-01')->addDays(rand(0, 30))->setHour(rand(8, 15))->setMinute(rand(0, 59));
            
            $transaction = OutboundTransaction::create([
                'requester_id' => $requester->id,
                'department_id' => $requester->department_id,
                'document_number' => 'OUT-DEC-2025-' . str_pad($docCounter++, 3, '0', STR_PAD_LEFT),
                'transaction_date' => $date->format('Y-m-d H:i:s'),
                'status' => 'Issued',
                'is_special_request' => false,
                'notes' => 'Pengajuan Rutin ATK / Logistik',
                'approver_id' => $head->id,
                'approved_at' => $date->copy()->addHours(1),
                'issued_by' => $admin->id,
                'issued_at' => $date->copy()->addHours(2),
            ]);

            foreach ($itemsForThisRequest as $data) {
                $item = $data['item'];
                $qty = $data['qty'];

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
