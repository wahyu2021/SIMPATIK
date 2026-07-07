<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Item;

class MasterDataSeeder extends Seeder
{
    public function run()
    {
        $file = database_path('seeders/data/master_items.csv');
        if (!file_exists($file)) return;
        
        $handle = fopen($file, 'r');
        $header = fgetcsv($handle, 1000, ',');
        
        $codeCounter = 1;
        while (($data = fgetcsv($handle, 1000, ',')) !== false) {
            $row = array_combine($header, $data);
            
            $category = Category::firstOrCreate(['name' => $row['category']]);
            
            // Deteksi Satuan Realistis berdasarkan Nama Barang
            $unit = 'Pcs';
            $nameLower = strtolower($row['item_name']);
            
            if (strpos($nameLower, 'kertas struk') !== false || strpos($nameLower, 'thermal') !== false) {
                $unit = 'Roll';
            } elseif (strpos($nameLower, 'continuous form') !== false || strpos($nameLower, 'cf') !== false) {
                $unit = 'Box';
            } elseif (strpos($nameLower, 'kertas') !== false) {
                $unit = 'Rim';
            } elseif (strpos($nameLower, 'tinta') !== false || strpos($nameLower, 'toner') !== false) {
                $unit = 'Botol';
            } elseif (strpos($nameLower, 'amplop') !== false || strpos($nameLower, 'clip') !== false || strpos($nameLower, 'staples') !== false) {
                $unit = 'Box';
            } elseif (strpos($nameLower, 'lakban') !== false || strpos($nameLower, 'pita') !== false) {
                $unit = 'Roll';
            } elseif (strpos($nameLower, 'buku') !== false || strpos($nameLower, 'kwitansi') !== false) {
                $unit = 'Buku';
            } elseif (strpos($nameLower, 'baterai') !== false) {
                $unit = 'Set';
            } elseif (strpos($nameLower, 'kalkulator') !== false || strpos($nameLower, 'gunting') !== false || strpos($nameLower, 'cater') !== false || strpos($nameLower, 'penggaris') !== false) {
                $unit = 'Unit';
            }

            // Minimum stok logis (misal 10 untuk peringatan dini)
            $minStock = 10;

            Item::updateOrCreate(
                ['name' => $row['item_name']],
                [
                    'category_id' => $category->id,
                    'item_code' => 'ITM-' . str_pad($codeCounter, 4, '0', STR_PAD_LEFT),
                    'unit_of_measure' => $unit,
                    'unit_price' => $row['unit_price'] ?: 0,
                    'current_stock' => 0,
                    'minimum_stock_level' => $minStock,
                ]
            );
            $codeCounter++;
        }
        fclose($handle);
    }
}
