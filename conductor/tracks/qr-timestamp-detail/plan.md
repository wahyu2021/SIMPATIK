# Implementation Plan: Penambahan Timestamp Detail pada QR Code Validasi

*Goal*: Menambahkan informasi waktu spesifik (jam & menit) beserta tanggal lengkap pada teks *pop-up* yang di-*generate* melalui QR Code BAST & SPB, serta menampilkannya di *frontend* (UI Web).

## Phase 1: Update Format Teks QR Code di PDF
- [x] **resources/views/pdf/bast.blade.php**: 
    - Ubah format `(\Carbon\Carbon::now()->format('Y-m-d'))` atau format *default* lainnya menjadi `\Carbon\Carbon::parse($date)->translatedFormat('d F Y H:i')` untuk *Admin*, *Penyelia*, dan *Penerima*.
- [x] **resources/views/pdf/spb.blade.php**: 
    - Lakukan hal yang sama untuk QR Code *Pemohon*, *Penyelia*, dan *Admin*.

## Phase 2: Update UI Web (Frontend)
- [x] **resources/js/Components/Features/Outbound/OutboundSignatures.tsx**: 
    - Import `formatDateTime` dari `../../../Lib/formatters`.
    - Tambahkan tampilan tanggal & waktu *approval* (jam:menit) persis di bawah label "✅ Tervalidasi Elektronik" apabila properti `date` tersedia.

## Definition of Done
- Hasil pemindaian QR Code di PDF (SPB & BAST) memuat tulisan spesifik misalnya: `"Disetujui secara elektronik oleh: Budi - Admin Gudang pada 17 Juni 2026 14:30"`.
- Panel tanda tangan pada halaman detail dokumen (di *web browser*) menampilkan informasi waktu yang serupa.
