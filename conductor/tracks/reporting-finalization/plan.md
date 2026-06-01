# Implementation Plan: Finalisasi Modul Laporan

Modul laporan saat ini sudah memiliki pondasi kode namun perlu penyelesaian akhir pada logika rekonsiliasi dan kartu stok.

## Goals
- Menjamin akurasi saldo akhir pada `StockLedger`.
- Menyelesaikan fitur simpan rekonsiliasi stok fisik.
- Menampilkan breakdown mutasi per barang dengan benar di frontend.

## Task List
- [x] **Data Integrity Check**: Verifikasi trigger penambahan/pengurangan stok di `InboundService` dan `OutboundService` sudah mencatat ke `StockLedger`.
- [x] **Reconciliation Logic**: Implementasi `storeReconciliation` di `ReportService` untuk mencatat perbedaan stok fisik vs sistem dan melakukan **Stock Adjustment** otomatis.
- [x] **Frontend Reports**: 
    - [x] Selesaikan halaman `Reports/Index.tsx` (Rekapitulasi Mutasi).
    - [x] Selesaikan halaman `Reports/StockLedger.tsx`.
    - [x] Selesaikan halaman `Reports/Reconciliation.tsx`.
    - [x] Selesaikan halaman breakdown per unit kerja (via `BreakdownModal`).
- [x] **Validation**: Pastikan stok aktual di tabel `items` selalu sinkron dengan saldo akhir di `StockLedger` setelah berbagai transaksi dan rekonsiliasi.

## Definition of Done
- Admin dapat melihat riwayat keluar-masuk barang secara kronologis tanpa selisih saldo.
- Admin dapat melakukan submit rekonsiliasi stok bulanan.
