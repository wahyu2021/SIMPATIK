# Pembagian Tugas — Modul per Anggota

## Overview

| Anggota | Modul | File yang Dibuat |
|---------|-------|-----------------|
| **Kamu** | Semua modul kompleks | Transaksi, Approval, Dashboard, PDF, dll |
| **Rekan 1** | Modul Kategori | 5 file |
| **Rekan 2** | Modul Unit Kerja | 5 file |

---

## 👤 REKAN 1 — Modul Kategori Barang

### Sub-Task 1: Controller
📁 `app/Http/Controllers/CategoryController.php`

Buat controller dengan **6 method**:

| Method | HTTP | URL | Fungsinya |
|--------|------|-----|-----------|
| `index()` | GET | `/categories` | Ambil semua kategori + hitung jumlah barang per kategori, tampilkan ke halaman daftar |
| `create()` | GET | `/categories/create` | Tampilkan halaman form kosong |
| `store()` | POST | `/categories` | Validasi input `name` (wajib, unik), simpan ke database, redirect ke index dengan flash message |
| `edit($category)` | GET | `/categories/{id}/edit` | Tampilkan halaman form yang sudah terisi data kategori yang mau diedit |
| `update($category)` | PUT | `/categories/{id}` | Validasi input `name` (wajib, unik kecuali dirinya sendiri), update database, redirect ke index |
| `destroy($category)` | DELETE | `/categories/{id}` | Hapus kategori, redirect ke index |

**Petunjuk:**
- Pakai `Inertia::render()` untuk menampilkan halaman React
- Pakai `$request->validate()` untuk validasi
- Pakai `->withCount('items')` saat ambil data agar tahu jumlah barang per kategori
- Pakai `->paginate(15)` agar ada pagination
- Pakai `redirect()->route(...)->with('success', '...')` untuk flash message

---

### Sub-Task 2: Route
📁 `routes/web.php`

- Daftarkan `CategoryController` menggunakan `Route::resource()`
- Tambahkan middleware `auth` supaya hanya bisa diakses setelah login
- **Clue:** `Route::resource('categories', CategoryController::class)`

---

### Sub-Task 3: Halaman Daftar (Index)
📁 `resources/js/Pages/Categories/Index.tsx`

Halaman ini menampilkan **tabel** dengan isi:

| Kolom | Isi |
|-------|-----|
| No | Nomor urut |
| Nama Kategori | Dari `category.name` |
| Jumlah Barang | Dari `category.items_count` (tampilkan dalam badge) |
| Aksi | Tombol **Edit** (link ke form edit) + **Hapus** (konfirmasi dulu) |

**Yang harus ada di halaman:**
- Judul "Kategori Barang" + deskripsi singkat
- Tombol **"+ Tambah Kategori"** yang mengarah ke `/categories/create`
- Flash message sukses (ambil dari `flash.success`)
- Tampilan "Belum ada data" kalau tabel kosong
- Info "Menampilkan X-Y dari Z kategori" di bawah tabel

**Petunjuk:**
- Import `Head`, `Link`, `router` dari `@inertiajs/react`
- Import type `PaginatedData`, `Category` dari `../../Types`
- Untuk hapus, pakai `router.delete('/categories/' + id)` setelah `confirm()`
- Warna tombol utama: `bg-[#0052A3]`

---

### Sub-Task 4: Halaman Form (Create & Edit)
📁 `resources/js/Pages/Categories/Form.tsx`

**1 file untuk 2 fungsi** — tambah dan edit. Bedakan pakai:
- Kalau props `category` **ada** → mode Edit
- Kalau props `category` **kosong** → mode Tambah

**Yang harus ada:**
- Input field untuk **nama** (1 field saja)
- Validation error ditampilkan di bawah input (warna merah)
- Tombol **Simpan/Perbarui** (disabled saat `processing`)
- Tombol **Batal** (link balik ke `/categories`)

**Petunjuk:**
- Pakai `useForm` dari `@inertiajs/react` → `{ data, setData, post, put, processing, errors }`
- Saat submit: mode tambah pakai `post('/categories')`, mode edit pakai `put('/categories/' + id)`
- Placeholder input: "Contoh: Alat Tulis Kantor"

---

### Sub-Task 5: Seeder
📁 `database/seeders/CategorySeeder.php`

- Buat daftar **minimal 6 kategori** barang ATK yang relevan untuk Bank BSB
- Contoh jenis kategori: alat tulis, cetakan, elektronik, kebersihan, dll
- Pakai `Category::firstOrCreate(['name' => ...])` agar tidak duplikat saat dijalankan ulang
- **Riset sendiri** kategori yang realistis berdasarkan barang-barang di gudang bank

---
---

## 👤 REKAN 2 — Modul Unit Kerja (Department)

### Sub-Task 1: Controller
📁 `app/Http/Controllers/DepartmentController.php`

Buat controller dengan **6 method** (strukturnya **sama persis** dengan CategoryController):

| Method | HTTP | URL | Fungsinya |
|--------|------|-----|-----------|
| `index()` | GET | `/departments` | Ambil semua department + hitung jumlah user per department, tampilkan ke halaman daftar |
| `create()` | GET | `/departments/create` | Tampilkan halaman form kosong |
| `store()` | POST | `/departments` | Validasi `name` (wajib, unik), simpan, redirect |
| `edit($department)` | GET | `/departments/{id}/edit` | Tampilkan form berisi data department |
| `update($department)` | PUT | `/departments/{id}` | Validasi & update, redirect |
| `destroy($department)` | DELETE | `/departments/{id}` | Hapus, redirect |

**Petunjuk:**
- **Sama persis** dengan CategoryController, ganti saja:
  - `Category` → `Department`
  - `categories` → `departments`
  - `items` → `users`
  - `->withCount('items')` → `->withCount('users')`

---

### Sub-Task 2: Route
📁 `routes/web.php`

- Sama seperti Rekan 1, tapi pakai `DepartmentController`
- **Clue:** `Route::resource('departments', DepartmentController::class)`

---

### Sub-Task 3: Halaman Daftar (Index)
📁 `resources/js/Pages/Departments/Index.tsx`

Tabel berisi:

| Kolom | Isi |
|-------|-----|
| No | Nomor urut |
| Nama Unit Kerja | Dari `department.name` |
| Jumlah Pengguna | Dari `department.users_count` + teks "orang" |
| Aksi | Tombol **Edit** + **Hapus** |

**Yang harus ada:**
- Judul "Unit Kerja" + deskripsi "Kelola daftar unit kerja di Bank Sumsel Babel"
- Tombol **"+ Tambah Unit Kerja"**
- Flash message
- Empty state
- Info pagination

**Petunjuk:**
- Struktur **sama persis** dengan `Categories/Index.tsx` milik Rekan 1
- Ganti semua kata "Kategori" → "Unit Kerja", `categories` → `departments`, `items_count` → `users_count`

---

### Sub-Task 4: Halaman Form (Create & Edit)
📁 `resources/js/Pages/Departments/Form.tsx`

- **Sama persis** dengan form Kategori, ganti:
  - Judul: "Tambah/Edit Unit Kerja"
  - Placeholder: "Contoh: Customer Service"
  - Route: `/departments` dan `/departments/{id}`
  - Props type: `department` bukan `category`

---

### Sub-Task 5: Seeder
📁 `database/seeders/DepartmentSeeder.php`

- Buat daftar **minimal 7 unit kerja** yang ada di Bank BSB Cabang Utama A. Rivai
- Contoh: Bagian Umum, Teller, Customer Service, Pelayanan, Unit KSG, dll
- Pakai `Department::firstOrCreate(['name' => ...])`
- **Riset sendiri** struktur organisasi Bank BSB cabang A. Rivai

---

## 📋 Checklist Final

### Rekan 1 — Modul Kategori
- [ ] `CategoryController.php` — 6 method CRUD
- [ ] Route `categories` di `web.php`
- [ ] `Pages/Categories/Index.tsx` — Tabel + aksi
- [ ] `Pages/Categories/Form.tsx` — Form tambah/edit
- [ ] `CategorySeeder.php` — Min. 6 kategori

### Rekan 2 — Modul Unit Kerja
- [ ] `DepartmentController.php` — 6 method CRUD
- [ ] Route `departments` di `web.php`
- [ ] `Pages/Departments/Index.tsx` — Tabel + aksi
- [ ] `Pages/Departments/Form.tsx` — Form tambah/edit
- [ ] `DepartmentSeeder.php` — Min. 7 unit kerja

> [!TIP]
> Kedua modul **hampir identik**. Kalau salah satu selesai duluan, bisa bantu temannya — tinggal ganti nama-nama saja.

> [!IMPORTANT]
> **Jangan lupa** import yang dibutuhkan di setiap file. Kalau bingung, lihat file contoh:
> - Controller contoh: lihat pattern di internet "Laravel Inertia CRUD Controller"
> - React contoh: lihat `Pages/Auth/Login.tsx` dan `Components/UI/Button.tsx` di project
> - Seeder contoh: lihat `database/seeders/UserSeeder.php`
