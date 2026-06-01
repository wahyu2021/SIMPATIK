# Implementation Plan: Generator PDF SPB & BAST

Implementasi fitur cetak dokumen resmi Bank BSB (Surat Permintaan Barang dan Berita Acara Serah Terima) menggunakan data transaksi outbound.

## Goals
- Generate dokumen PDF yang sesuai dengan standar formulir fisik Bank BSB.
- Integrasi tanda tangan digital user ke dalam PDF.
- Penambahan QR Code untuk validasi dokumen.

## Task List
- [ ] **Backend Setup**: 
    - [ ] Verifikasi konfigurasi `barryvdh/laravel-dompdf`.
    - [ ] Buat folder `resources/views/pdf` untuk template.
- [ ] **Blade Templates**:
    - [ ] Buat template `spb.blade.php` (Daftar Permintaan ATK).
    - [ ] Buat template `bast.blade.php` (Daftar Pengeluaran Barang).
- [ ] **Controller Integration**:
    - [ ] Tambahkan method `downloadPdf` di `OutboundController`.
    - [ ] Integrasikan `SimpleSoftwareIO/QrCode` untuk validasi.
- [ ] **Frontend Integration**:
    - [ ] Tambahkan tombol "Cetak SPB" dan "Cetak BAST" di halaman `Outbound/Show.tsx`.

## Definition of Done
- User dapat mengunduh PDF yang berisi daftar barang, tanda tangan digital pengaju, penyelia, dan admin gudang beserta QR Code yang valid.
