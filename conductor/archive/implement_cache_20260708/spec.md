# Specification: Implement Caching System

## 1. Overview
Implementasi sistem *caching* tingkat aplikasi pada proyek SIMPATIK untuk mengurangi beban *database* dan mempercepat waktu muat (load time). 

## 2. Functional Requirements
- **Cache Driver**: Mempertahankan driver `database` untuk menghemat memori server (cocok untuk spesifikasi VPS 2GB RAM, 2 Core).
- **Scope**: Mengaplikasikan cache pada seluruh entitas utama aplikasi:
  - Master Data (Category, Department)
  - Data Barang (Items)
  - Manajemen Pengguna (Users, Roles)
  - Transaksi (Inbound & Outbound)
- **Cache Invalidation Strategy (Pilihan Senior Developer)**: Menggunakan **Model Observers**. Ini adalah praktik terbaik di Laravel. Setiap kali ada data yang Disimpan/Diubah/Dihapus, Observer akan otomatis menghapus *cache* terkait secara terpusat, sehingga kode tidak kotor.

## 3. Non-Functional Requirements
- **Arsitektur**: Pembacaan *cache* (`Cache::remember`) akan disuntikkan langsung di dalam *Repository*, sehingga *Controller* dan *Service* tetap bersih.

## 4. Acceptance Criteria
- Semua fungsi pemanggilan daftar data di dalam *Repositories* telah dibungkus dengan *Cache*.
- *Observers* telah dibuat (seperti `CategoryObserver`, `ItemObserver`) dan berhasil menghapus *cache* saat ada perubahan data.
- Perubahan data (tambah/edit) langsung memantul ke antarmuka React tanpa masalah data basi (*stale data*).
