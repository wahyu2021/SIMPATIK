# Implementation Plan: Fitur Pengajuan Langsung (Direct Request)

Menangani kasus khusus di mana staf (seperti Satpam) atau pihak tertentu datang langsung ke gudang untuk mengambil barang tanpa melalui alur persetujuan (approval) digital terlebih dahulu.

## Goals
- Memungkinkan Admin Gudang mencatat transaksi yang terjadi secara langsung/fisik.
- Mendukung unit yang tidak memiliki Penyelia (Pimpinan Unit).
- Stok barang tetap terpotong secara akurat meskipun tanpa alur `Pending -> Approved`.
- Menyesuaikan format cetakan PDF sesuai dengan formulir fisik yang ada.

## Task List
- [x] **Database & Logic**:
    - [x] Tambahkan flag `is_direct_request` (boolean) di tabel `outbound_transactions`.
    - [x] Buat method `createDirectRequest` di `OutboundService` yang langsung memproses status ke `Issued` dan memotong stok.
- [ ] **Master Data**:
    - [ ] Tambahkan unit khusus bernama "Umum / Operasional" di master Departemen.
- [x] **Frontend (Admin Interface)**:
    - [x] Tambahkan tombol "Catat Pengambilan Langsung" di halaman Outbound Index.
    - [x] Buat form khusus yang memungkinkan Admin memilih Pemohon dan langsung menginput jumlah barang yang diserahkan.
- [x] **PDF Generator**:
    - [x] Sesuaikan template BAST agar jika `is_direct_request` true, kolom Tanda Tangan Penyelia disembunyikan.

## Definition of Done
- Admin Gudang dapat mencatat transaksi pengambilan barang dalam < 1 menit.
- Stok berkurang secara real-time.
- Dokumen BAST dapat langsung dicetak sebagai bukti serah terima fisik.
