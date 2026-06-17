<!DOCTYPE html>
<html>
<head>
    <title>Laporan Penggunaan Unit - {{ $department->name }}</title>
    <style>
        body { font-family: sans-serif; font-size: 11px; color: #333; line-height: 1.4; }
        .header { text-align: center; margin-bottom: 25px; border-bottom: 2px solid #003366; padding-bottom: 10px; }
        .header h1 { margin: 0; color: #003366; font-size: 18px; }
        .header p { margin: 2px 0; }
        .info-box { margin-bottom: 20px; }
        .data-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .data-table th { background-color: #f3f4f6; border: 1px solid #ccc; padding: 10px 8px; text-align: center; color: #374151; }
        .data-table td { border: 1px solid #ccc; padding: 10px 8px; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .font-bold { font-weight: bold; }
        .footer-table { width: 100%; margin-top: 50px; }
    </style>
</head>
<body>
    <div class="header">
        <img src="{{ public_path('images/logo.webp') }}" style="height: 50px; margin-bottom: 10px;">
        <h1>LAPORAN PENGGUNAAN BARANG PER UNIT KERJA</h1>
        <p><strong>{{ $signatory['company_name'] }}</strong> - {{ $signatory['company_branch'] }}</p>
    </div>

    <div class="info-box">
        <table style="width: 100%">
            <tr>
                <td style="width: 15%">Unit Kerja</td>
                <td>: <strong>{{ $department->name }}</strong></td>
            </tr>
            <tr>
                <td>Periode</td>
                <td>: {{ $reportData['period']['label'] }}</td>
            </tr>
        </table>
    </div>

    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 40px;">NO</th>
                <th style="width: 120px;">KODE BARANG</th>
                <th>NAMA BARANG</th>
                <th style="width: 80px;">SATUAN</th>
                <th style="width: 100px;">JUMLAH</th>
            </tr>
        </thead>
        <tbody>
            @php $total = 0; @endphp
            @forelse($reportData['items'] as $index => $item)
                @php $total += $item['total_qty']; @endphp
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td class="text-center" style="font-family: monospace;">{{ $item['item_code'] }}</td>
                    <td>{{ $item['name'] }}</td>
                    <td class="text-center">{{ $item['unit_of_measure'] }}</td>
                    <td class="text-right font-bold">{{ number_format($item['total_qty']) }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="5" class="text-center" style="padding: 40px; color: #999;">Tidak ada data penggunaan barang pada periode ini.</td>
                </tr>
            @endforelse
        </tbody>
        @if(count($reportData['items']) > 0)
        <tfoot>
            <tr style="background-color: #f9fafb;">
                <td colspan="4" class="text-right font-bold">TOTAL VOLUME PENGGUNAAN</td>
                <td class="text-right font-bold" style="color: #003366; font-size: 13px;">{{ number_format($total) }}</td>
            </tr>
        </tfoot>
        @endif
    </table>

    <table class="footer-table">
        <tr>
            <td style="width: 70%"></td>
            <td class="text-center">
                <p>Palembang, {{ now()->translatedFormat('d F Y') }}</p>
                <p>Unit Umum Akuntansi</p>
                <div style="height: 80px;"></div>
                <p><strong>................................................</strong></p>
            </td>
        </tr>
    </table>
</body>
</html>
