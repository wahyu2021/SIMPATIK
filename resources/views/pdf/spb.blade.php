<!DOCTYPE html>
<html>
<head>
    <title>SPB - {{ $outbound->document_number }}</title>
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
        .signature-box { text-align: center; width: 33%; }
        .signature-img { height: 60px; max-width: 120px; object-fit: contain; margin: 5px auto; display: block; }
        .qr-code { text-align: right; margin-top: 20px; }
        .footer { position: fixed; bottom: 0; width: 100%; text-align: center; font-size: 9px; color: #999; }
    </style>
</head>
<body>
    <div class="header">
        <img src="{{ public_path('images/logo.webp') }}" style="height: 50px; margin-bottom: 10px;">
        <h1>SURAT PERMINTAAN BARANG (SPB)</h1>
        <p><strong>{{ $signatory['company_name'] }}</strong> - {{ $signatory['company_branch'] }}</p>
        <p>{{ $signatory['company_address'] }}</p>
    </div>

    <table class="info-table">
        <tr>
            <td style="width: 15%">No. Dokumen</td>
            <td style="width: 35%">: <strong>{{ $outbound->document_number }}</strong></td>
            <td style="width: 15%">Unit Kerja</td>
            <td style="width: 35%">: {{ $outbound->department->name }}</td>
        </tr>
        <tr>
            <td>Tanggal</td>
            <td>: {{ $outbound->transaction_date->format('d F Y') }}</td>
            <td>Status</td>
            <td>: {{ $outbound->status->label() }}</td>
        </tr>
    </table>

    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 5%; text-align: center;">NO</th>
                <th style="width: 15%;">KODE</th>
                <th>NAMA BARANG / FORMULIR</th>
                <th style="width: 10%; text-align: center;">SATUAN</th>
                <th style="width: 12%; text-align: right;">DIMINTA</th>
                <th style="width: 12%; text-align: right;">DISETUJUI</th>
            </tr>
        </thead>
        <tbody>
            @foreach($outbound->details as $index => $detail)
            <tr>
                <td style="text-align: center;">{{ $index + 1 }}</td>
                <td>{{ $detail->item->item_code }}</td>
                <td>{{ $detail->item->name }}</td>
                <td style="text-align: center;">{{ $detail->item->unit_of_measure }}</td>
                <td style="text-align: right;">{{ number_format($detail->quantity_requested) }}</td>
                <td style="text-align: right;">{{ number_format($detail->quantity_approved) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <table class="signature-grid">
        <tr>
            <td class="signature-box" style="width: {{ $outbound->is_direct_request ? '50%' : '33%' }}">
                <p>Diajukan Oleh,</p>
                @php
                    $requesterName = $outbound->requester->name ?? 'Pemohon';
                    $requesterInfo = "Diajukan secara elektronik oleh: " . $requesterName . " - Pihak Pemohon pada " . \Carbon\Carbon::parse($outbound->created_at ?? now())->translatedFormat('d F Y H:i:s');
                    $requesterQr = base64_encode(SimpleSoftwareIO\QrCode\Facades\QrCode::format('png')->size(60)->margin(0)->errorCorrection('H')->merge(public_path('images/logo.png'), 0.3, true)->generate($requesterInfo));
                @endphp
                <img src="data:image/png;base64, {!! $requesterQr !!}" class="signature-img">
                <p><strong>{{ $requesterName }}</strong></p>
                <p style="font-size: 9px; color: #666;">Pihak Pemohon<br>{{ \Carbon\Carbon::parse($outbound->created_at ?? now())->translatedFormat('d M Y H:i') }}</p>
            </td>

            @if(!$outbound->is_direct_request)
            <td class="signature-box" style="width: 33%">
                <p>Diketahui Oleh,</p>
                @php
                    $approverName = $outbound->approver->name ?? 'Penyelia';
                    $approverInfo = "Disetujui secara elektronik oleh: " . $approverName . " - Penyelia pada " . \Carbon\Carbon::parse($outbound->approved_at ?? now())->translatedFormat('d F Y H:i:s');
                    $approverQr = base64_encode(SimpleSoftwareIO\QrCode\Facades\QrCode::format('png')->size(60)->margin(0)->errorCorrection('H')->merge(public_path('images/logo.png'), 0.3, true)->generate($approverInfo));
                @endphp
                <img src="data:image/png;base64, {!! $approverQr !!}" class="signature-img">
                <p><strong>{{ $approverName }}</strong></p>
                <p style="font-size: 9px; color: #666;">Penyelia / Pimpinan<br>{{ \Carbon\Carbon::parse($outbound->approved_at ?? now())->translatedFormat('d M Y H:i') }}</p>
            </td>
            @endif

            <td class="signature-box" style="width: {{ $outbound->is_direct_request ? '50%' : '33%' }}">
                <p>Diserahkan Oleh,</p>
                @php
                    $issuerName = $outbound->issuedByUser->name ?? 'Admin Gudang';
                    $issuerInfo = "Diserahkan secara elektronik oleh: " . $issuerName . " - Admin Gudang pada " . \Carbon\Carbon::parse($outbound->issued_at ?? now())->translatedFormat('d F Y H:i:s');
                    $issuerQr = base64_encode(SimpleSoftwareIO\QrCode\Facades\QrCode::format('png')->size(60)->margin(0)->errorCorrection('H')->merge(public_path('images/logo.png'), 0.3, true)->generate($issuerInfo));
                @endphp
                <img src="data:image/png;base64, {!! $issuerQr !!}" class="signature-img">
                <p><strong>{{ $issuerName }}</strong></p>
                <p style="font-size: 9px; color: #666;">Admin Gudang<br>{{ \Carbon\Carbon::parse($outbound->issued_at ?? now())->translatedFormat('d M Y H:i') }}</p>
            </td>
        </tr>
    </table>

    <div class="qr-code">
        <img src="data:image/png;base64, {!! $qrCode !!}">
        <p style="font-size: 8px; color: #999;">Dokumen ini sah secara digital via SIMPATIK</p>
    </div>

    <div class="footer">
        Dicetak pada: {{ now()->format('d/m/Y H:i:s') }} | ID Transaksi: #{{ $outbound->id }}
    </div>
</body>
</html>
