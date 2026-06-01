# Implementation Plan: Pengujian Otomatis & QA

Menjamin stabilitas aplikasi SIMPATIK melalui unit testing dan integration testing, terutama pada alur transaksi yang kritikal.

## Goals
- Menjamin alur Approval tidak dapat dilewati secara ilegal.
- Menjamin stok barang tidak pernah menjadi negatif tanpa record ledger.
- Memastikan hak akses (RBAC) berfungsi dengan benar di backend dan frontend.

## Task List
- [ ] **Unit Testing (Backend)**:
    - [ ] Buat test untuk `ItemService`: Validasi pengurangan/penambahan stok.
    - [ ] Buat test untuk `OutboundService`: Validasi transisi status (Pending -> Approved -> Issued).
- [ ] **Integration Testing**:
    - [ ] Buat feature test untuk API/Endpoint: Pastikan User Role `staff` tidak bisa memanggil fungsi `approve`.
- [ ] **Frontend Testing (Manual/E2E)**:
    - [ ] Verifikasi tampilan UI pada berbagai resolusi layar (Responsiveness).
    - [ ] Uji coba form input dengan data ekstrem (SQL Injection, XSS prevention check).

## Definition of Done
- Seluruh test suite (`php artisan test`) berjalan dengan status "Passed" 100%.
- Alur transaksi dari pembuatan pengajuan hingga penyerahan barang telah diuji dan tidak memiliki celah logika.
