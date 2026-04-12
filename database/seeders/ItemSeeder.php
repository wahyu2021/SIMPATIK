<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Item;
use Illuminate\Database\Seeder;

class ItemSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            // Alat Tulis Kantor
            ['category' => 'Alat Tulis Kantor', 'name' => 'Pulpen Pilot G-2', 'unit' => 'pcs', 'price' => 15000, 'stock' => 120, 'min' => 30],
            ['category' => 'Alat Tulis Kantor', 'name' => 'Pensil 2B Faber Castell', 'unit' => 'pcs', 'price' => 5000, 'stock' => 80, 'min' => 20],
            ['category' => 'Alat Tulis Kantor', 'name' => 'Correction Pen', 'unit' => 'pcs', 'price' => 12000, 'stock' => 40, 'min' => 15],
            ['category' => 'Alat Tulis Kantor', 'name' => 'Spidol Whiteboard', 'unit' => 'pcs', 'price' => 18000, 'stock' => 25, 'min' => 10],

            // Kertas & Cetakan
            ['category' => 'Kertas & Cetakan', 'name' => 'Kertas HVS A4 70gr', 'unit' => 'rim', 'price' => 52000, 'stock' => 50, 'min' => 20],
            ['category' => 'Kertas & Cetakan', 'name' => 'Kertas HVS F4 80gr', 'unit' => 'rim', 'price' => 65000, 'stock' => 30, 'min' => 15],
            ['category' => 'Kertas & Cetakan', 'name' => 'Amplop Putih Polos', 'unit' => 'box', 'price' => 35000, 'stock' => 10, 'min' => 5],

            // Perlengkapan Kantor
            ['category' => 'Perlengkapan Kantor', 'name' => 'Stapler HD-10', 'unit' => 'pcs', 'price' => 45000, 'stock' => 15, 'min' => 5],
            ['category' => 'Perlengkapan Kantor', 'name' => 'Isi Staples No. 10', 'unit' => 'box', 'price' => 8000, 'stock' => 50, 'min' => 20],
            ['category' => 'Perlengkapan Kantor', 'name' => 'Gunting Besar', 'unit' => 'pcs', 'price' => 22000, 'stock' => 8, 'min' => 5],
            ['category' => 'Perlengkapan Kantor', 'name' => 'Lakban Bening', 'unit' => 'roll', 'price' => 15000, 'stock' => 3, 'min' => 10],

            // Tinta & Cartridge
            ['category' => 'Tinta & Cartridge', 'name' => 'Tinta Printer HP 680 Black', 'unit' => 'pcs', 'price' => 125000, 'stock' => 5, 'min' => 3],
            ['category' => 'Tinta & Cartridge', 'name' => 'Tinta Printer HP 680 Color', 'unit' => 'pcs', 'price' => 145000, 'stock' => 2, 'min' => 3],

            // Perlengkapan Kebersihan
            ['category' => 'Perlengkapan Kebersihan', 'name' => 'Tissue Box 250 Sheets', 'unit' => 'box', 'price' => 18000, 'stock' => 30, 'min' => 15],
            ['category' => 'Perlengkapan Kebersihan', 'name' => 'Hand Sanitizer 500ml', 'unit' => 'botol', 'price' => 35000, 'stock' => 12, 'min' => 5],

            // Filing & Arsip
            ['category' => 'Filing & Arsip', 'name' => 'Ordner Bantex F4', 'unit' => 'pcs', 'price' => 42000, 'stock' => 20, 'min' => 10],
            ['category' => 'Filing & Arsip', 'name' => 'Map Plastik Kancing F4', 'unit' => 'pcs', 'price' => 5000, 'stock' => 60, 'min' => 25],
            ['category' => 'Filing & Arsip', 'name' => 'Binder Clip 41mm', 'unit' => 'box', 'price' => 12000, 'stock' => 15, 'min' => 8],
        ];

        $codeCounter = 1;

        foreach ($items as $itemData) {
            $category = Category::firstOrCreate(['name' => $itemData['category']]);

            Item::firstOrCreate(
                ['name' => $itemData['name']],
                [
                    'category_id'        => $category->id,
                    'item_code'          => 'ITM-' . str_pad($codeCounter, 4, '0', STR_PAD_LEFT),
                    'unit_of_measure'    => $itemData['unit'],
                    'unit_price'         => $itemData['price'],
                    'current_stock'      => $itemData['stock'],
                    'minimum_stock_level'=> $itemData['min'],
                ]
            );

            $codeCounter++;
        }
    }
}
