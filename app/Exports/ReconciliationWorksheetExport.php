<?php

namespace App\Exports;

use App\Models\Item;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ReconciliationWorksheetExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return Item::with('category')->where('is_active', true)->orderBy('item_code')->get();
    }

    public function headings(): array
    {
        return [
            'No',
            'Kode Barang',
            'Nama Barang',
            'Kategori',
            'Satuan',
            'Stok Sistem',
            'Stok Fisik Aktual (Isi Manual)',
            'Keterangan / Alasan (Isi Manual)'
        ];
    }

    public function map($item): array
    {
        static $rowNumber = 1;

        return [
            $rowNumber++,
            $item->item_code,
            $item->name,
            $item->category ? $item->category->name : '-',
            $item->unit,
            $item->current_stock,
            '', // Kolom kosong untuk diisi manual
            '', // Kolom kosong untuk diisi manual
        ];
    }

    public function styles(Worksheet $sheet)
    {
        $highestRow = $sheet->getHighestRow();
        
        return [
            1    => ['font' => ['bold' => true]],
            "A1:H{$highestRow}" => [
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                        'color' => ['argb' => '000000'],
                    ],
                ],
            ],
        ];
    }
}
