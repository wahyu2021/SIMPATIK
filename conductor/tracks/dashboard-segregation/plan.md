# Implementation Plan: Segregasi Data Dashboard per Role

Memastikan statistik dan daftar riwayat pada dashboard hanya menampilkan data yang relevan bagi masing-masing pengguna sesuai dengan kewenangan (role) mereka.

## Goals
- **Admin Gudang**: Melihat statistik global (seluruh bank).
- **Penyelia (Kepala Unit)**: Melihat statistik unit kerjanya saja.
- **Staff (Pemohon)**: Melihat statistik permohonan pribadinya saja.
- Menjamin privasi data antar unit kerja.

## Task List
- [x] **Backend - DashboardRepository**:
    - [x] Tambahkan parameter `User` pada method penghitungan statistik.
    - [x] Implementasi scope filter `applyScope` untuk membatasi query berdasarkan `department_id` (Penyelia) atau `requester_id` (Staff).
- [x] **Backend - DashboardService**:
    - [x] Kirimkan instance `Auth::user()` ke repository untuk proses filtering data.
- [x] **Frontend - StatsGrid**:
    - [x] Sesuaikan label dan visibilitas Card Statistik agar lebih personal bagi non-admin (misal: "Permintaan Saya" bukan "Total Pengajuan").

## Definition of Done
- User ber-role `staff` tidak dapat melihat angka atau daftar pengajuan dari unit kerja lain.
- Penyelia hanya melihat total pengajuan yang terjadi di unitnya.
- Dashboard Admin tetap menampilkan data akumulasi seluruh sistem.
