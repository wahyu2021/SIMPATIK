<!DOCTYPE html>
<html>
<head>
    <title>BAST - {{ $outbound->document_number }}</title>
    <style>
        body { font-family: sans-serif; font-size: 11px; color: #333; line-height: 1.4; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #003366; padding-bottom: 10px; }
        .header h1 { margin: 0; color: #003366; font-size: 18px; }
        .header p { margin: 2px 0; }
        .info-table { width: 100%; margin-bottom: 20px; }
        .info-table td { padding: 3px 0; vertical-align: top; }
        .data-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .data-table th { background-color: #f2f2f2; border: 1px solid #ccc; padding: 8px; text-align: left; }
        .data-table td { border: 1px solid #ccc; padding: 8px; }
        .signature-grid { width: 100%; margin-top: 40px; }
        .signature-box { text-align: center; width: 50%; }
        .signature-img { height: 60px; max-width: 150px; object-fit: contain; margin: 5px auto; display: block; }
        .qr-code { text-align: right; margin-top: 20px; }
        .footer { position: fixed; bottom: 0; width: 100%; text-align: center; font-size: 9px; color: #999; }
        .intro { margin-bottom: 15px; text-align: justify; }
    </style>
</head>
<body>
    <div class="header">
        <img src="{{ public_path('images/logo.webp') }}" style="height: 50px; margin-bottom: 10px;">
        <h1>BERITA ACARA SERAH TERIMA (BAST)</h1>
        <p><strong>{{ $signatory['company_name'] }}</strong> - {{ $signatory['company_branch'] }}</p>
        <p>{{ $signatory['company_address'] }}</p>
    </div>

    <div class="intro">
        Pada hari ini, <strong>{{ $outbound->handed_over_at ? $outbound->handed_over_at->translatedFormat('l, d F Y') : '................' }}</strong>, telah dilakukan serah terima barang persediaan (ATK/Cetakan) sesuai dengan dokumen permintaan nomor <strong>{{ $outbound->document_number }}</strong> antara pihak-pihak berikut:
    </div>

    <table class="info-table">
        <tr>
            <td style="width: 15%">Unit Kerja</td>
            <td style="width: 85%">: {{ $outbound->department->name }}</td>
        </tr>
        <tr>
            <td>Pemohon</td>
            <td>: {{ $outbound->requester->name }}</td>
        </tr>
    </table>

    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 5%; text-align: center;">NO</th>
                <th style="width: 15%;">KODE</th>
                <th>NAMA BARANG / FORMULIR</th>
                <th style="width: 10%; text-align: center;">SATUAN</th>
                <th style="width: 15%; text-align: right;">JUMLAH DISERAHKAN</th>
            </tr>
        </thead>
        <tbody>
            @foreach($outbound->details as $index => $detail)
            <tr>
                <td style="text-align: center;">{{ $index + 1 }}</td>
                <td>{{ $detail->item->item_code }}</td>
                <td>{{ $detail->item->name }}</td>
                <td style="text-align: center;">{{ $detail->item->unit_of_measure }}</td>
                <td style="text-align: right;">{{ number_format($detail->quantity_approved) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <table class="signature-grid">
        <tr>
            <td class="signature-box" style="width: {{ $outbound->is_direct_request ? '50%' : '33%' }}">
                <p>Yang Menyerahkan,</p>
                @php
                    $adminName = $outbound->is_direct_request ? ($outbound->issuedByUser->name ?? 'Admin Gudang') : ($outbound->handedOverByUser->name ?? 'Admin Gudang');
                    $adminInfo = "Disetujui secara elektronik oleh: " . $adminName . " - Admin Gudang pada " . \Carbon\Carbon::parse($outbound->issued_at ?? now())->translatedFormat('d F Y H:i:s');
                    $adminQr = base64_encode(SimpleSoftwareIO\QrCode\Facades\QrCode::format('png')->size(240)->margin(0)->errorCorrection('H')->merge(public_path('images/logo.png'), 0.3, true)->generate($adminInfo));
                @endphp
                <img src="data:image/png;base64, {!! $adminQr !!}" class="signature-img">
                <p><strong>{{ $adminName }}</strong></p>
                <p style="font-size: 9px; color: #666;">Admin Gudang<br>{{ \Carbon\Carbon::parse($outbound->issued_at ?? now())->translatedFormat('d M Y H:i') }}</p>
            </td>
            
            @if(!$outbound->is_direct_request)
            <td class="signature-box" style="width: 33%">
                <p>Diketahui Oleh,</p>
                @php
                    $approverName = $outbound->approver->name ?? 'Penyelia';
                    $approverInfo = "Disetujui secara elektronik oleh: " . $approverName . " - Penyelia pada " . \Carbon\Carbon::parse($outbound->approved_at ?? now())->translatedFormat('d F Y H:i:s');
                    $approverQr = base64_encode(SimpleSoftwareIO\QrCode\Facades\QrCode::format('png')->size(240)->margin(0)->errorCorrection('H')->merge(public_path('images/logo.png'), 0.3, true)->generate($approverInfo));
                @endphp
                <img src="data:image/png;base64, {!! $approverQr !!}" class="signature-img">
                <p><strong>{{ $approverName }}</strong></p>
                <p style="font-size: 9px; color: #666;">Penyelia / Pimpinan<br>{{ \Carbon\Carbon::parse($outbound->approved_at ?? now())->translatedFormat('d M Y H:i') }}</p>
            </td>
            @endif

            <td class="signature-box" style="width: {{ $outbound->is_direct_request ? '50%' : '33%' }}">
                <p>Yang Menerima,</p>
                @php
                    $receiverName = $outbound->pickedUpByUser->name ?? ($outbound->requester->name ?? 'Penerima');
                    $receiverInfo = "Disetujui secara elektronik oleh: " . $receiverName . " - Penerima Barang pada " . \Carbon\Carbon::parse($outbound->picked_up_at ?? now())->translatedFormat('d F Y H:i:s');
                    $receiverQr = base64_encode(SimpleSoftwareIO\QrCode\Facades\QrCode::format('png')->size(240)->margin(0)->errorCorrection('H')->merge(public_path('images/logo.png'), 0.3, true)->generate($receiverInfo));
                @endphp
                <img src="data:image/png;base64, {!! $receiverQr !!}" class="signature-img">
                <p><strong>{{ $receiverName }}</strong></p>
                <p style="font-size: 9px; color: #666;">Penerima Barang<br>{{ \Carbon\Carbon::parse($outbound->picked_up_at ?? now())->translatedFormat('d M Y H:i') }}</p>
            </td>
        </tr>
    </table>

    <div class="qr-code">
        <img src="data:image/png;base64, {!! $qrCode !!}" width="80" height="80">
        <p style="font-size: 8px; color: #999;">Validasi dokumen via QR Code SIMPATIK</p>
    </div>

    <div class="footer">
        Dicetak pada: {{ now()->format('d/m/Y H:i:s') }} | ID Transaksi: #{{ $outbound->id }}
    </div>
</body>
</html>
