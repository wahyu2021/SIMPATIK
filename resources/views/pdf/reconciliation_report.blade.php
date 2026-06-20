<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Berita Acara Rekonsiliasi Stok</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            color: #333;
            line-height: 1.5;
            margin: 0;
            padding: 0;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 15px;
        }
        .company-name {
            font-size: 18px;
            font-weight: bold;
            margin: 0;
        }
        .company-info {
            font-size: 12px;
            margin: 5px 0 0 0;
            color: #555;
        }
        .report-title {
            font-size: 16px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 20px;
            text-decoration: underline;
        }
        .report-meta {
            margin-bottom: 20px;
            width: 100%;
        }
        .report-meta td {
            padding: 3px 0;
            vertical-align: top;
        }
        .report-meta td:first-child {
            width: 120px;
            font-weight: bold;
        }
        .report-meta td:nth-child(2) {
            width: 10px;
        }
        table.data {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        table.data th, table.data td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
        }
        table.data th {
            background-color: #f2f2f2;
            font-weight: bold;
            text-align: center;
        }
        table.data td.text-center {
            text-align: center;
        }
        table.data td.text-right {
            text-align: right;
        }
        .signatures {
            width: 100%;
            margin-top: 50px;
            page-break-inside: avoid;
        }
        .signatures td {
            text-align: center;
            width: 50%;
            vertical-align: bottom;
        }
        .signature-space {
            height: 80px;
        }
        .signature-name {
            font-weight: bold;
            text-decoration: underline;
        }
        .text-red {
            color: #d32f2f;
        }
        .text-green {
            color: #388e3c;
        }
    </style>
</head>
<body>

<div class="header">
    <p class="company-name">{{ $signatory['company_name'] ?? 'PT. SIMPATIK' }}</p>
    @if(!empty($signatory['company_branch']))
        <p class="company-info">{{ $signatory['company_branch'] }}</p>
    @endif
    @if(!empty($signatory['company_address']))
        <p class="company-info">{{ $signatory['company_address'] }}</p>
    @endif
</div>

<div class="report-title">
    BERITA ACARA REKONSILIASI STOK (STOCK OPNAME)
</div>

<table class="report-meta">
    <tr>
        <td>Periode Bulan</td>
        <td>:</td>
        <td>{{ \Carbon\Carbon::create($year, $month, 1)->translatedFormat('F Y') }}</td>
    </tr>
    <tr>
        <td>Tanggal Dibuat</td>
        <td>:</td>
        <td>{{ \Carbon\Carbon::parse($reconciliation->reconciliation_date)->translatedFormat('d F Y') }}</td>
    </tr>
    <tr>
        <td>Keterangan</td>
        <td>:</td>
        <td>{{ $reconciliation->notes ?: 'Terdapat penyesuaian stok berdasarkan hasil opname fisik.' }}</td>
    </tr>
</table>

@if($discrepancies->isEmpty())
    <p style="text-align: center; font-style: italic; margin-top: 50px;">Tidak ada selisih stok (Stok fisik sesuai dengan stok sistem).</p>
@else
    <table class="data">
        <thead>
            <tr>
                <th width="5%">No</th>
                <th width="15%">Kode Barang</th>
                <th width="35%">Nama Barang</th>
                <th width="10%">Stok Sistem</th>
                <th width="10%">Stok Fisik</th>
                <th width="10%">Selisih</th>
                <th width="15%">Keterangan</th>
            </tr>
        </thead>
        <tbody>
            @foreach($discrepancies as $index => $detail)
            <tr>
                <td class="text-center">{{ $index + 1 }}</td>
                <td>{{ $detail->item->item_code ?? '-' }}</td>
                <td>{{ $detail->item->name ?? '-' }}</td>
                <td class="text-center">{{ number_format($detail->system_qty, 0, ',', '.') }}</td>
                <td class="text-center">{{ number_format($detail->physical_qty, 0, ',', '.') }}</td>
                <td class="text-center font-bold">
                    @if($detail->difference > 0)
                        <span class="text-green">+{{ number_format($detail->difference, 0, ',', '.') }}</span>
                    @else
                        <span class="text-red">{{ number_format($detail->difference, 0, ',', '.') }}</span>
                    @endif
                </td>
                <td>{{ $detail->notes ?? '-' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
@endif

<table class="signatures">
    <tr>
        <td>
            Mengetahui / Menyetujui,<br>
            <strong>Kepala Bagian Umum</strong>
            <div class="signature-space"></div>
            <span class="signature-name">( ........................................ )</span>
        </td>
        <td>
            Dibuat / Dihitung Oleh,<br>
            <strong>Admin Gudang</strong>
            <div class="signature-space"></div>
            <span class="signature-name">( {{ $reconciliation->creator->name ?? '........................................' }} )</span><br>
            Tanggal: {{ \Carbon\Carbon::parse($reconciliation->reconciliation_date)->translatedFormat('d F Y') }}
        </td>
    </tr>
</table>

</body>
</html>
