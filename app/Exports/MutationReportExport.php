<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\WithTitle;

class MutationReportExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize, WithTitle
{
    private $categories;
    private $periodLabel;

    public function __construct(array $reportData)
    {
        $this->categories = $reportData['categories'];
        $this->periodLabel = $reportData['period']['label'];
    }

    public function collection()
    {
        $rows = collect();
        foreach ($this->categories as $category) {
            // Add Category Header
            $rows->push(['is_category' => true, 'name' => strtoupper($category['name'])]);
            
            foreach ($category['items'] as $item) {
                $rows->push(array_merge($item, ['is_category' => false]));
            }

            // Add Subtotal
            $rows->push([
                'is_category' => false,
                'is_subtotal' => true,
                'name' => 'Subtotal ' . $category['name'],
                'opening_qty' => $category['subtotal_opening'],
                'inbound_qty' => $category['subtotal_inbound'],
                'outbound_qty' => $category['subtotal_outbound'],
                'closing_qty' => $category['subtotal_closing'],
            ]);
        }
        return $rows;
    }

    public function headings(): array
    {
        return [
            ['REKAPITULASI MUTASI ALAT TULIS KANTOR DAN BARANG CETAKAN'],
            ['Periode: ' . $this->periodLabel],
            [''],
            ['NO', 'NAMA BARANG', 'SATUAN', 'STOK AWAL', 'STOK MASUK', 'PERMINTAAN', 'STOK AKHIR']
        ];
    }

    public function map($row): array
    {
        if ($row['is_category'] ?? false) {
            return ['', $row['name'], '', '', '', '', ''];
        }

        if ($row['is_subtotal'] ?? false) {
            return [
                '',
                $row['name'],
                '',
                $row['opening_qty'],
                $row['inbound_qty'],
                $row['outbound_qty'],
                $row['closing_qty']
            ];
        }

        return [
            $row['no'],
            $row['name'],
            $row['unit'],
            $row['opening_qty'],
            $row['inbound_qty'],
            $row['outbound_qty'],
            $row['closing_qty']
        ];
    }

    public function styles(Worksheet $sheet)
    {
        $sheet->mergeCells('A1:G1');
        $sheet->mergeCells('A2:G2');
        
        $styleArray = [
            'font' => ['bold' => true],
            'alignment' => ['horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER],
        ];

        $sheet->getStyle('A1:A2')->applyFromArray($styleArray);
        $sheet->getStyle('A4:G4')->applyFromArray([
            'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
            'fill' => ['fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID, 'startColor' => ['rgb' => '003366']],
        ]);

        return [];
    }

    public function title(): string
    {
        return 'Rekapitulasi Mutasi';
    }
}
