<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\WithTitle;

class DepartmentReportExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize, WithTitle
{
    private $items;
    private $departmentName;
    private $periodLabel;

    public function __construct(array $reportData, string $departmentName)
    {
        $this->items = collect($reportData['items']);
        $this->departmentName = $departmentName;
        $this->periodLabel = $reportData['period']['label'];
    }

    public function collection()
    {
        return $this->items;
    }

    public function headings(): array
    {
        return [
            ['LAPORAN PENGGUNAAN BARANG PER UNIT KERJA'],
            ['Unit Kerja: ' . $this->departmentName],
            ['Periode: ' . $this->periodLabel],
            [''],
            ['NO', 'KODE BARANG', 'NAMA BARANG', 'SATUAN', 'JUMLAH DIAMBIL']
        ];
    }

    public function map($row): array
    {
        static $no = 0;
        return [
            ++$no,
            $row['item_code'],
            $row['name'],
            $row['unit_of_measure'],
            $row['total_qty'],
        ];
    }

    public function styles(Worksheet $sheet)
    {
        $sheet->mergeCells('A1:E1');
        $sheet->mergeCells('A2:E2');
        $sheet->mergeCells('A3:E3');
        
        $styleArray = [
            'font' => ['bold' => true],
            'alignment' => ['horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER],
        ];

        $sheet->getStyle('A1:A3')->applyFromArray($styleArray);
        $sheet->getStyle('A5:E5')->applyFromArray([
            'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
            'fill' => ['fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID, 'startColor' => ['rgb' => '003366']],
        ]);

        return [];
    }

    public function title(): string
    {
        return 'Laporan Unit Kerja';
    }
}
