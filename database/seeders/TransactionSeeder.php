<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\InboundTransaction;
use App\Models\InboundTransactionDetail;
use App\Models\Item;
use App\Models\OutboundTransaction;
use App\Models\OutboundTransactionDetail;
use App\Models\StockLedger;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class TransactionSeeder extends Seeder
{
    /**
     * Seed transaksi realistis — langsung insert ke DB.
     * Mencakup 6 inbound + 15 outbound dari berbagai user & departemen.
     */
    public function run(): void
    {
        $admin = User::role('warehouse_admin')->first();
        $items = Item::all();

        if (!$admin || $items->isEmpty()) {
            $this->command->warn('Skipping TransactionSeeder: missing users/items.');
            return;
        }

        $this->seedInbound($admin, $items);
        $this->seedOutbound($items);
    }

    // ═══════════════════════════════════════════════════════════════
    //  INBOUND — Barang masuk dari vendor
    // ═══════════════════════════════════════════════════════════════
    private function seedInbound(User $admin, $items): void
    {
        $inboundData = [
            [
                'ref' => 'SJ-2026/01/001', 'date' => '2026-01-15',
                'notes' => 'Pengadaan ATK awal tahun — PO #BSB-2026-001, vendor CV Sumber Jaya',
                'items' => ['Pulpen Pilot G-2' => 100, 'Pensil 2B Faber Castell' => 60, 'Correction Pen' => 30, 'Spidol Whiteboard' => 20],
            ],
            [
                'ref' => 'SJ-2026/01/002', 'date' => '2026-01-20',
                'notes' => 'Restock kertas & amplop — PO #BSB-2026-002, PT Kertas Nusantara',
                'items' => ['Kertas HVS A4 70gr' => 50, 'Kertas HVS F4 80gr' => 30, 'Amplop Putih Polos' => 20],
            ],
            [
                'ref' => 'SJ-2026/02/001', 'date' => '2026-02-10',
                'notes' => 'Perlengkapan kantor & filing — PO #BSB-2026-005, Toko Makmur Office',
                'items' => ['Stapler HD-10' => 10, 'Isi Staples No. 10' => 40, 'Gunting Besar' => 8, 'Lakban Bening' => 15, 'Ordner Bantex F4' => 25, 'Map Plastik Kancing F4' => 50, 'Binder Clip 41mm' => 15],
            ],
            [
                'ref' => 'SJ-2026/02/002', 'date' => '2026-02-18',
                'notes' => 'Restock tinta printer & kebersihan — PO #BSB-2026-006',
                'items' => ['Tinta Printer HP 680 Black' => 12, 'Tinta Printer HP 680 Color' => 10, 'Tissue Box 250 Sheets' => 30, 'Hand Sanitizer 500ml' => 15],
            ],
            [
                'ref' => 'SJ-2026/03/001', 'date' => '2026-03-12',
                'notes' => 'Pengadaan ATK Q1 tambahan — vendor CV Sumber Jaya',
                'items' => ['Pulpen Pilot G-2' => 50, 'Kertas HVS A4 70gr' => 30, 'Spidol Whiteboard' => 10],
            ],
            [
                'ref' => 'SJ-2026/04/001', 'date' => '2026-04-05',
                'notes' => 'Pengadaan rutin bulan April — PO #BSB-2026-010',
                'items' => ['Kertas HVS A4 70gr' => 25, 'Kertas HVS F4 80gr' => 15, 'Correction Pen' => 20, 'Amplop Putih Polos' => 10, 'Tissue Box 250 Sheets' => 20],
            ],
            [
                'ref' => 'SJ-2026/04/002', 'date' => '2026-04-15',
                'notes' => 'Restock darurat tinta printer — request dari Bagian Operasional',
                'items' => ['Tinta Printer HP 680 Black' => 5, 'Tinta Printer HP 680 Color' => 5],
            ],
            [
                'ref' => 'SJ-2026/04/003', 'date' => '2026-04-22',
                'notes' => 'Perlengkapan filing & kantor bulan April',
                'items' => ['Ordner Bantex F4' => 15, 'Map Plastik Kancing F4' => 30, 'Binder Clip 41mm' => 10, 'Lakban Bening' => 10],
            ],
        ];

        foreach ($inboundData as $inb) {
            $inbound = InboundTransaction::create([
                'user_id' => $admin->id,
                'reference_number' => $inb['ref'],
                'transaction_date' => $inb['date'],
                'notes' => $inb['notes'],
                'created_at' => Carbon::parse($inb['date'])->addHours(rand(8, 14))->addMinutes(rand(0, 59)),
            ]);

            foreach ($inb['items'] as $itemName => $qty) {
                $item = $items->firstWhere('name', $itemName);
                if (!$item) continue;

                InboundTransactionDetail::create([
                    'inbound_transaction_id' => $inbound->id,
                    'item_id' => $item->id,
                    'quantity' => $qty,
                    'unit_price' => $item->unit_price,
                ]);

                $newStock = $item->current_stock + $qty;
                $item->update(['current_stock' => $newStock]);

                StockLedger::create([
                    'item_id' => $item->id,
                    'transaction_date' => $inb['date'],
                    'movement_type' => 'in',
                    'document_reference' => $inb['ref'],
                    'qty_in' => $qty,
                    'qty_out' => 0,
                    'ending_balance' => $newStock,
                ]);
            }
        }

        $this->command->info('  Inbound: ' . count($inboundData) . ' transaksi barang masuk');
    }

    // ═══════════════════════════════════════════════════════════════
    //  OUTBOUND — Pengajuan barang dari berbagai unit kerja
    // ═══════════════════════════════════════════════════════════════
    private function seedOutbound($items): void
    {
        $admin = User::role('warehouse_admin')->first();

        // Ambil penyelia dan staff per departemen
        $penyeliaPelayanan = User::where('email', 'penyelia@simpatik.test')->first();
        $penyeliaTeller = User::where('email', 'penyelia.teller@simpatik.test')->first();
        $penyeliaCS = User::where('email', 'penyelia.cs@simpatik.test')->first();
        $penyeliaOps = User::where('email', 'penyelia.ops@simpatik.test')->first();

        $staffAndi = User::where('email', 'staff@simpatik.test')->first();
        $staffSiti = User::where('email', 'siti@simpatik.test')->first();
        $staffBudi = User::where('email', 'budi@simpatik.test')->first();
        $staffRina = User::where('email', 'rina@simpatik.test')->first();
        $staffDian = User::where('email', 'dian@simpatik.test')->first();
        $staffYanti = User::where('email', 'yanti@simpatik.test')->first();
        $staffLisa = User::where('email', 'lisa@simpatik.test')->first();
        $staffArief = User::where('email', 'arief@simpatik.test')->first();

        $scenarios = [
            // ── ISSUED (Selesai) — dari beberapa departemen ──
            [
                'requester' => $staffAndi, 'approver' => $penyeliaPelayanan, 'issuer' => $admin,
                'date' => '2026-02-05', 'status' => 'Issued', 'special' => false,
                'notes' => 'ATK rutin Februari — unit Pelayanan',
                'items' => ['Pulpen Pilot G-2' => 10, 'Kertas HVS A4 70gr' => 5, 'Map Plastik Kancing F4' => 15],
            ],
            [
                'requester' => $staffBudi, 'approver' => $penyeliaTeller, 'issuer' => $admin,
                'date' => '2026-02-12', 'status' => 'Issued', 'special' => false,
                'notes' => 'Kebutuhan teller — formulir dan kertas struk',
                'items' => ['Kertas HVS F4 80gr' => 10, 'Pulpen Pilot G-2' => 6],
            ],
            [
                'requester' => $staffDian, 'approver' => $penyeliaCS, 'issuer' => $admin,
                'date' => '2026-03-01', 'status' => 'Issued', 'special' => false,
                'notes' => 'Perlengkapan meja CS — tissue, hand sanitizer, pulpen',
                'items' => ['Tissue Box 250 Sheets' => 8, 'Hand Sanitizer 500ml' => 4, 'Pulpen Pilot G-2' => 5],
            ],
            [
                'requester' => $staffYanti, 'approver' => $penyeliaOps, 'issuer' => $admin,
                'date' => '2026-03-10', 'status' => 'Issued', 'special' => false,
                'notes' => 'Restock tinta & kertas printer operasional',
                'items' => ['Tinta Printer HP 680 Black' => 3, 'Tinta Printer HP 680 Color' => 2, 'Kertas HVS A4 70gr' => 8],
            ],
            [
                'requester' => $staffSiti, 'approver' => $penyeliaPelayanan, 'issuer' => $admin,
                'date' => '2026-03-20', 'status' => 'Issued', 'special' => true,
                'notes' => 'Pesanan khusus: persiapan acara sosialisasi produk baru',
                'items' => ['Kertas HVS A4 70gr' => 10, 'Amplop Putih Polos' => 5, 'Spidol Whiteboard' => 4],
            ],
            [
                'requester' => $staffAndi, 'approver' => $penyeliaPelayanan, 'issuer' => $admin,
                'date' => '2026-04-02', 'status' => 'Issued', 'special' => false,
                'notes' => 'ATK rutin April — unit Pelayanan',
                'items' => ['Pulpen Pilot G-2' => 8, 'Pensil 2B Faber Castell' => 10, 'Correction Pen' => 5],
            ],
            [
                'requester' => $staffRina, 'approver' => $penyeliaTeller, 'issuer' => $admin,
                'date' => '2026-04-08', 'status' => 'Issued', 'special' => false,
                'notes' => 'Filing arsip teller bulan Maret',
                'items' => ['Ordner Bantex F4' => 5, 'Binder Clip 41mm' => 3, 'Map Plastik Kancing F4' => 10],
            ],

            // ── APPROVED (Menunggu penyerahan dari admin gudang) ──
            [
                'requester' => $staffBudi, 'approver' => $penyeliaTeller, 'issuer' => null,
                'date' => '2026-04-22', 'status' => 'Approved', 'special' => false,
                'notes' => 'Kebutuhan kertas & tinta minggu depan',
                'items' => ['Kertas HVS A4 70gr' => 5, 'Tinta Printer HP 680 Black' => 2],
            ],
            [
                'requester' => $staffDian, 'approver' => $penyeliaCS, 'issuer' => null,
                'date' => '2026-04-25', 'status' => 'Approved', 'special' => true,
                'notes' => 'Pesanan khusus: persiapan acara gathering nasabah premium',
                'items' => ['Tissue Box 250 Sheets' => 12, 'Hand Sanitizer 500ml' => 6, 'Amplop Putih Polos' => 8],
            ],

            // ── PENDING (Menunggu approval penyelia) ──
            [
                'requester' => $staffAndi, 'approver' => null, 'issuer' => null,
                'date' => '2026-04-28', 'status' => 'Pending', 'special' => false,
                'notes' => 'Request stapler dan isi staples untuk front office',
                'items' => ['Stapler HD-10' => 2, 'Isi Staples No. 10' => 5],
            ],
            [
                'requester' => $staffYanti, 'approver' => null, 'issuer' => null,
                'date' => '2026-04-28', 'status' => 'Pending', 'special' => false,
                'notes' => 'ATK rutin Mei — unit Operasional',
                'items' => ['Pulpen Pilot G-2' => 6, 'Kertas HVS A4 70gr' => 5, 'Lakban Bening' => 3],
            ],
            [
                'requester' => $staffLisa, 'approver' => null, 'issuer' => null,
                'date' => '2026-04-29', 'status' => 'Pending', 'special' => true,
                'notes' => 'Request spidol & kertas untuk presentasi ke klien',
                'items' => ['Spidol Whiteboard' => 8, 'Kertas HVS A4 70gr' => 3],
            ],
            [
                'requester' => $staffArief, 'approver' => null, 'issuer' => null,
                'date' => '2026-04-29', 'status' => 'Pending', 'special' => false,
                'notes' => 'Perlengkapan filing dokumen kredit',
                'items' => ['Ordner Bantex F4' => 8, 'Map Plastik Kancing F4' => 20, 'Binder Clip 41mm' => 5],
            ],

            // ── REJECTED (Ditolak oleh penyelia) ──
            [
                'requester' => $staffSiti, 'approver' => $penyeliaPelayanan, 'issuer' => null,
                'date' => '2026-03-25', 'status' => 'Rejected', 'special' => true,
                'notes' => 'Request spidol 50 pcs untuk training internal',
                'reject' => 'Jumlah terlalu banyak. Kuota bulanan unit kerja untuk spidol maksimal 10 pcs. Silakan ajukan ulang dengan jumlah wajar.',
                'items' => ['Spidol Whiteboard' => 50],
            ],
            [
                'requester' => $staffYanti, 'approver' => $penyeliaOps, 'issuer' => null,
                'date' => '2026-04-12', 'status' => 'Rejected', 'special' => true,
                'notes' => 'Minta gunting dan lakban banyak untuk packing',
                'reject' => 'Untuk kebutuhan packing dalam jumlah besar harus melalui purchase order terpisah via Bagian Umum.',
                'items' => ['Gunting Besar' => 10, 'Lakban Bening' => 20],
            ],
        ];

        $docCounter = 1;

        foreach ($scenarios as $sc) {
            $dateStr = $sc['date'];
            $docNum = 'OUT-' . Carbon::parse($dateStr)->format('Ym') . '-' . str_pad($docCounter++, 4, '0', STR_PAD_LEFT);

            $outbound = OutboundTransaction::create([
                'requester_id' => $sc['requester']->id,
                'department_id' => $sc['requester']->department_id,
                'document_number' => $docNum,
                'transaction_date' => $dateStr,
                'status' => $sc['status'],
                'is_special_request' => $sc['special'],
                'notes' => $sc['notes'],
                'rejection_reason' => $sc['reject'] ?? null,
                'approver_id' => $sc['approver']?->id,
                'approved_at' => $sc['approver']
                    ? Carbon::parse($dateStr)->addDay()->setHour(rand(9, 15))->setMinute(rand(0, 59))
                    : null,
                'issued_by' => $sc['issuer']?->id,
                'issued_at' => $sc['issuer']
                    ? Carbon::parse($dateStr)->addDays(2)->setHour(rand(9, 15))->setMinute(rand(0, 59))
                    : null,
                'created_at' => Carbon::parse($dateStr)->setHour(rand(8, 11))->setMinute(rand(0, 59)),
            ]);

            foreach ($sc['items'] as $itemName => $qtyReq) {
                $item = $items->firstWhere('name', $itemName);
                if (!$item) continue;

                $qtyApproved = in_array($sc['status'], ['Approved', 'Issued']) ? $qtyReq : 0;

                OutboundTransactionDetail::create([
                    'outbound_transaction_id' => $outbound->id,
                    'item_id' => $item->id,
                    'quantity_requested' => $qtyReq,
                    'quantity_approved' => $qtyApproved,
                    'notes' => null,
                ]);

                if ($sc['status'] === 'Issued') {
                    $newStock = $item->current_stock - $qtyReq;
                    $item->update(['current_stock' => max(0, $newStock)]);

                    StockLedger::create([
                        'item_id' => $item->id,
                        'transaction_date' => $dateStr,
                        'movement_type' => 'out',
                        'document_reference' => $docNum,
                        'qty_in' => 0,
                        'qty_out' => $qtyReq,
                        'ending_balance' => max(0, $newStock),
                    ]);
                }
            }
        }

        $counts = collect($scenarios)->countBy('status');
        $this->command->info("  Outbound: " . count($scenarios) . " pengajuan — Issued: {$counts['Issued']}, Approved: {$counts['Approved']}, Pending: {$counts['Pending']}, Rejected: {$counts['Rejected']}");
    }
}
