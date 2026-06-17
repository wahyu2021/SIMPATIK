# Implementation Plan: Perubahan Hak Akses Barang Masuk

*Goal*: Menyesuaikan hak akses fitur "Barang Masuk" (Inbound) agar hanya dapat dilihat dan dikelola oleh Bagian Umum (General Affairs) dan tidak lagi ditampilkan untuk Admin Gudang (Warehouse Admin).

## Phase 1: Backend Role & Permissions
- [x] **app/Enums/UserRole.php**:
    - Cabut akses `view-inbound` dan `create-inbound` dari role `WAREHOUSE_ADMIN`.
    - Tambahkan akses `view-inbound` dan `create-inbound` ke role `GENERAL_AFFAIRS`.

## Phase 2: Frontend Navigation
- [x] **resources/js/Config/navigation.ts**:
    - Ubah roles pada menu "Barang Masuk" dari `['warehouse_admin']` menjadi `['general_affairs']`.
- [x] **resources/js/Components/Features/Dashboard/StatsGrid.tsx** & **LowStockAlerts.tsx**:
    - Pastikan tombol/link menuju `/inbound` disembunyikan untuk Admin Gudang atau diatur hak aksesnya untuk `general_affairs`.

## Definition of Done
- Admin Gudang tidak melihat menu "Barang Masuk" dan mendapat error 403 jika mencoba mengakses `/inbound` secara langsung.
- Bagian Umum dapat melihat menu "Barang Masuk" dan dapat melakukan pencatatan transaksi barang masuk secara normal.
