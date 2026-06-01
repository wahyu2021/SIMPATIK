<!DOCTYPE html>
<html>
<head>
    <title>Rekapitulasi Mutasi - {{ $reportData['period']['label'] }}</title>
    <style>
        body { font-family: sans-serif; font-size: 10px; color: #333; line-height: 1.4; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #003366; padding-bottom: 10px; }
        .header h1 { margin: 0; color: #003366; font-size: 16px; }
        .header p { margin: 2px 0; }
        .data-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .data-table th { background-color: #003366; color: white; border: 1px solid #002244; padding: 6px; text-align: center; }
        .data-table td { border: 1px solid #ccc; padding: 6px; }
        .category-row { background-color: #f0f7ff; font-weight: bold; color: #003366; }
        .subtotal-row { background-color: #f9fafb; font-weight: bold; font-style: italic; }
        .footer-table { width: 100%; margin-top: 30px; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .font-bold { font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <img src="{{ public_path('images/logo.webp') }}" style="height: 40px; margin-bottom: 5px;">
        <h1>REKAPITULASI MUTASI ALAT TULIS KANTOR DAN BARANG CETAKAN</h1>
        <p><strong>{{ $signatory['company_branch'] }}</strong></p>
        <p>Periode: {{ $reportData['period']['label'] }}</p>
    </div>

    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 30px;">NO</th>
                <th>NAMA BARANG</th>
                <th style="width: 60px;">SATUAN</th>
                <th style="width: 80px;">STOK AWAL</th>
                <th style="width: 80px;">STOK MASUK</th>
                <th style="width: 80px;">PERMINTAAN</th>
                <th style="width: 80px;">STOK AKHIR</th>
            </tr>
        </thead>
        <tbody>
            @foreach($reportData['categories'] as $category)
                <tr class="category-row">
                    <td colspan="7">{{ strtoupper($category['name']) }}</td>
                </tr>
                @foreach($category['items'] as $item)
                <tr>
                    <td class="text-center">{{ $item['no'] }}</td>
                    <td>{{ $item['name'] }}</td>
                    <td class="text-center">{{ $item['unit'] }}</td>
                    <td class="text-right">{{ number_format($item['opening_qty']) }}</td>
                    <td class="text-right">{{ number_format($item['inbound_qty']) }}</td>
                    <td class="text-right">{{ number_format($item['outbound_qty']) }}</td>
                    <td class="text-right font-bold">{{ number_format($item['closing_qty']) }}</td>
                </tr>
                @endforeach
                <tr class="subtotal-row">
                    <td colspan="3" class="text-right">Subtotal {{ $category['name'] }}</td>
                    <td class="text-right">{{ number_format($category['subtotal_opening']) }}</td>
                    <td class="text-right">{{ number_format($category['subtotal_inbound']) }}</td>
                    <td class="text-right">{{ number_format($category['subtotal_outbound']) }}</td>
                    <td class="text-right">{{ number_format($category['subtotal_closing']) }}</td>
                </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr style="background-color: #003366; color: white; font-bold;">
                <td colspan="3" class="text-center font-bold">GRAND TOTAL</td>
                <td class="text-right font-bold">{{ number_format($reportData['summary']['opening_qty']) }}</td>
                <td class="text-right font-bold">{{ number_format($reportData['summary']['inbound_qty']) }}</td>
                <td class="text-right font-bold">{{ number_format($reportData['summary']['outbound_qty']) }}</td>
                <td class="text-right font-bold">{{ number_format($reportData['summary']['closing_qty']) }}</td>
            </tr>
        </tfoot>
    </table>

    <table class="footer-table">
        <tr>
            <td style="width: 70%"></td>
            <td class="text-center">
                <p>Palembang, {{ $reportData['period']['end_label'] }}</p>
                <p>Unit Umum Akuntansi</p>
                <div style="height: 60px;"></div>
                <p><strong>................................................</strong></p>
            </td>
        </tr>
    </table>
</body>
</html>
