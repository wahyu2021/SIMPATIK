# Track: Pemisahan Validasi ke Form Request

## Metadata
- **Track ID**: `refactor-form-requests`
- **Status**: ✅ Completed
- **Prioritas**: Menengah
- **Deskripsi**: Melakukan *refactoring* dengan memindahkan seluruh logika validasi inline (`$request->validate()`) yang tersebar di berbagai controller ke dalam kelas `Form Request` Laravel yang terpisah. Hal ini bertujuan untuk menerapkan prinsip *Clean Code* (Single Responsibility Principle) dan merapikan arsitektur sistem.

---

## Latar Belakang
Saat ini, sebagian besar validasi input sudah menggunakan Form Request (misal: `StoreInboundRequest`, `StoreItemRequest`), namun masih ada beberapa Controller yang menggunakan validasi *inline* di dalam methodnya. Agar proyek ini konsisten, *maintainable*, dan sesuai standar *best practice* Laravel, semua validasi harus dipusatkan ke dalam folder `app/Http/Requests/`.

---

## Daftar Controller Target Refactor

Berikut adalah Controller dan method yang masih mengandung validasi *inline*:

1. **`UserManagementController`** (Manajemen Pengguna)
2. **`CategoryController`** (Kategori Barang)
3. **`DepartmentController`** (Unit Kerja / Departemen)
4. **`ProfileController`** (Profil User)
5. **`SettingController`** (Pengaturan Aplikasi)
6. **`ReportController`** (Simpan Rekonsiliasi)
7. **`OutboundController`** (Pengajuan Langsung / Direct Request)

---

## Tahap Eksekusi

### Tahap 1: Setup Form Request (Master Data & User)
- [x] Buat `StoreCategoryRequest` dan `UpdateCategoryRequest`, lalu terapkan ke `CategoryController`.
- [x] Buat `StoreDepartmentRequest` dan `UpdateDepartmentRequest`, lalu terapkan ke `DepartmentController`.
- [x] Buat `StoreUserRequest` dan `UpdateUserRequest` (sudah ada), serta buat `ImportUserRequest` dan terapkan ke `UserManagementController`.

### Tahap 2: Setup Form Request (Transaksi & Report)
- [x] Buat `StoreDirectOutboundRequest` dan terapkan ke method `storeDirect` di `OutboundController`.
- [x] Buat `StoreReconciliationRequest` dan pindahkan validasi (termasuk *after hook*) dari `ReportController` ke request ini.

### Tahap 3: Setup Form Request (Sistem & Profil)
- [x] Buat `ProfileUpdateRequest` (jika belum menggunakan bawaan Breeze) dan terapkan ke `ProfileController`.
- [x] Buat `UpdateSettingRequest` dan terapkan ke `SettingController`.

### Tahap 4: Pengujian & Pembersihan
- [x] Pastikan tidak ada lagi penggunaan `$request->validate()` atau `Validator::make()` secara langsung di dalam controller untuk input pengguna.
- [x] Uji fungsionalitas Form (submit data valid dan tidak valid) untuk memastikan pesan *error* tetap tertangkap dengan baik oleh antarmuka (Inertia/React).
