# Implementation Plan: Finalisasi Modul Laporan

Modul laporan saat ini sudah memiliki pondasi kode namun perlu penyelesaian akhir pada logika rekonsiliasi dan kartu stok.

## Goals
- Menjamin akurasi saldo akhir pada `StockLedger`.
- Menyelesaikan fitur simpan rekonsiliasi stok fisik.
- Menampilkan breakdown mutasi per barang dengan benar di frontend.

## Task List
- [ ] **Data Integrity Check**: Verifikasi trigger penambahan/pengurangan stok di `InboundService` dan `OutboundService` sudah mencatat ke `StockLedger`.
- [ ] **Reconciliation Logic**: Implementasi `storeReconciliation` di `ReportService` untuk mencatat perbedaan stok fisik vs sistem.
- [ ] **Frontend Reports**: 
    - [ ] Selesaikan halaman `Reports/StockLedger.tsx`.
    - [ ] Selesaikan halaman `Reports/Reconciliation.tsx`.
    - [ ] Selesaikan halaman `Reports/Breakdown.tsx`.
- [ ] **Validation**: Pastikan total nilai gudang di dashboard sesuai dengan akumulasi `unit_price * current_stock` di tabel items.

## Definition of Done
- Admin dapat melihat riwayat keluar-masuk barang secara kronologis tanpa selisih saldo.
- Admin dapat melakukan submit rekonsiliasi stok bulanan.
