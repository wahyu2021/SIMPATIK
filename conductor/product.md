# Product Definition: SIMPATIK (Sistem Manajemen Persediaan ATK)

## Overview
SIMPATIK adalah sistem informasi berbasis web untuk mendigitalisasi proses pengelolaan persediaan ATK (Alat Tulis Kantor) dan formulir cetakan di lingkungan perbankan (Bank Sumsel Babel Cabang A. Rivai). Sistem menggantikan proses manual pencatatan stok, pengajuan barang, dan pelaporan mutasi menjadi alur kerja digital yang terintegrasi.

## Core Features
- **Multi-Role Authentication**:
  - **Admin Gudang**: Fokus pada pengeluaran barang (outbound), pencetakan dokumen, dan monitoring persediaan.
  - **Staff Bagian Umum**: Mengelola data master (Barang, Kategori, Unit Kerja), akun pengguna, pengaturan sistem, dan barang masuk (inbound).
  - **Pimpinan (Penyelia)**: Menyetujui pengajuan barang dari staf.
  - **Staf Unit Kerja**: Mengajukan permintaan barang.
- **Mandatory Signature Onboarding**: Tanda tangan digital wajib saat pertama kali login.
- **Manajemen Barang**: CRUD barang dengan auto-generate kode, filter kategori, alert stok rendah.
- **Approval Workflow**: Pengajuan barang oleh staf disetujui digital oleh Penyelia, lalu dikeluarkan Admin Gudang.
- **Cetak Dokumen**: Generate PDF SPB/BAST dengan tanda tangan digital & QR Code.
- **Prediksi Kebutuhan (Forecasting)**: Menggunakan XGBoost via API Python untuk prediksi kebutuhan bulanan.
- **Low Stock Alert**: Notifikasi WhatsApp dan panel alert untuk stok di bawah minimum.
- **Pelaporan & Mutasi**: Kartu mutasi stok (Ledger) otomatis tercatat (IN/OUT), fitur rekonsiliasi bulanan.

## Modul Sistem (Status Aktual)
1. **Keamanan & Manajemen Akses**: 
   - Autentikasi multi-peran (Spatie).
   - Middleware `signature` untuk memastikan onboarding tanda tangan selesai.
   - Audit trail rencana implementasi.
2. **Data Induk (Master Data)**: 
   - **Kategori** (`categories`): Pengelompokan barang.
   - **Barang** (`items`): Katalog barang, stok aktual, dan batas stok minimum (fokus pada kuantitas).
   - **Unit Kerja** (`departments`): Struktur organisasi pengaju.
   - **Pengguna** (`users`): Manajemen akun dan tanda tangan digital.
3. **Transaksi Gudang**: 
   - **Barang Masuk** (`inbound`): Pencatatan stok masuk dari vendor.
   - **Pengajuan Barang** (`outbound`): Alur persetujuan berjenjang (Pending -> Approved/Rejected -> Issued -> Handover/Pickup).
4. **Pelaporan & Mutasi**: 
   - **Stock Ledger**: Kartu mutasi stok otomatis.
   - **Rekonsiliasi**: Penyesuaian stok sistem dengan fisik.
   - **Breakdown**: Laporan detail pengeluaran per barang ke unit kerja.
5. **Peramalan Cerdas (Forecasting)**: Integrasi dengan microservice Python (XGBoost).
6. **Dashboard Analitik**: Statistik real-time untuk Admin, Penyelia, dan Staff.

## Arsitektur Data
- **Soft Deletes**: Digunakan pada hampir semua model utama (User, Item, Category, Department, Outbound).
- **Relasi Kompleks**: Outbound Transaction memiliki relasi ke Requester, Approver, Department, dan Detail Item.
- **Enums**: Penggunaan PHP Enums untuk status transaksi (`OutboundStatus`) dan peran pengguna (`UserRole`).
