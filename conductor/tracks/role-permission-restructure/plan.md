# Track: Restrukturisasi Role & Permission

## Metadata
- **Track ID**: `role-permission-restructure`
- **Status**: ✅ Completed
- **Prioritas**: Tinggi
- **Deskripsi**: Merestrukturisasi pembagian hak akses (permission) antar role sesuai revisi terbaru: Admin Gudang fokus hanya pada pengeluaran barang (outbound), sementara Bagian Umum memegang kendali atas data master, user management, dan barang masuk (inbound).

---

## Latar Belakang

### Kondisi Sebelum Revisi
- `warehouse_admin` (Admin Gudang) berperan sebagai "superadmin" yang memegang hampir seluruh permission.
- `general_affairs` (Bagian Umum) hanya punya 6 permission terbatas (dashboard, inbound, reports, view-all-requests).

### Hasil Revisi
- **Admin Gudang** difokuskan hanya untuk operasional **pengeluaran barang** (outbound).
- **Bagian Umum** mengambil alih tanggung jawab **data master**, **user management**, dan tetap menangani **barang masuk**.

### Temuan Kritis
- Route untuk master data (Items, Categories, Departments), Reports, dan Settings **tidak dilindungi middleware permission** — terbuka untuk semua user authenticated.
- Permission `manage-items`, `manage-categories`, `manage-departments` sudah didefinisikan tapi **tidak digunakan di route/controller manapun**.

---

## Mapping Permission Baru (Target Akhir)

| Permission | Bagian Umum | Admin Gudang | Penyelia | Staf |
|---|---|---|---|---|
| `view-dashboard` | ✅ | ✅ | ✅ | ✅ |
| `manage-users` | ✅ | ❌ | ❌ | ❌ |
| `manage-settings` | ✅ | ❌ | ❌ | ❌ |
| `manage-items` | ✅ | ❌ | ❌ | ❌ |
| `manage-categories` | ✅ | ❌ | ❌ | ❌ |
| `manage-departments` | ✅ | ❌ | ❌ | ❌ |
| `view-items` *(baru)* | ✅ | ✅ | ✅ | ❌ |
| `view-categories` *(baru)* | ✅ | ✅ | ✅ | ❌ |
| `view-departments` *(baru)* | ✅ | ✅ | ❌ | ❌ |
| `view-inbound` | ✅ | ❌ | ❌ | ❌ |
| `create-inbound` | ✅ | ❌ | ❌ | ❌ |
| `approve-outbound` | ❌ | ✅ | ✅ | ❌ |
| `issue-outbound` | ❌ | ✅ | ❌ | ❌ |
| `create-outbound-request` | ❌ | ❌ | ❌ | ✅ |
| `view-own-requests` | ❌ | ❌ | ❌ | ✅ |
| `view-own-unit-requests` | ❌ | ❌ | ✅ | ❌ |
| `view-all-requests` | ✅ | ✅ | ❌ | ❌ |
| `view-reports` | ✅ | ✅ | ❌ | ❌ |
| `export-reports` | ✅ | ❌ | ❌ | ❌ |
| `view-forecasting` | ✅ | ❌ | ❌ | ❌ |

---

## Tahap 1: Definisi Permission Baru & Update Enum Role
> **Tujuan**: Menambahkan permission `view-*` baru dan meng-update mapping permission di `UserRole` enum.
> **Risiko**: Rendah — belum mengubah route, hanya mengubah definisi data.

### Task 1.1 — Update `RolePermissionSeeder.php`
- [ ] Tambahkan 3 permission baru ke daftar permission di seeder:
  - `view-items`
  - `view-categories`
  - `view-departments`
- **File**: `database/seeders/RolePermissionSeeder.php`

### Task 1.2 — Update mapping `permissions()` di `UserRole.php`
- [ ] **`GENERAL_AFFAIRS`**: Tambahkan `manage-users`, `manage-settings`, `manage-items`, `manage-categories`, `manage-departments`, `view-items`, `view-categories`, `view-departments`, `view-forecasting`.
- [ ] **`WAREHOUSE_ADMIN`**: Hapus `manage-users`, `manage-settings`, `manage-items`, `manage-categories`, `manage-departments`, `view-forecasting`. Tambahkan `view-items`, `view-categories`, `view-departments`. Pastikan tetap punya: `view-dashboard`, `approve-outbound`, `issue-outbound`, `create-outbound-request`, `view-all-requests`, `view-reports`.
- [ ] **`DIVISION_HEAD`**: Tambahkan `view-items`, `view-categories`. Permission lain tetap.
- [ ] **`STAFF`**: Tidak berubah.
- **File**: `app/Enums/UserRole.php`

### Task 1.3 — Verifikasi & Jalankan Seeder
- [ ] Jalankan `php artisan db:seed --class=RolePermissionSeeder` untuk menyinkronkan permission baru ke database.
- [ ] Verifikasi di database bahwa permission baru sudah ada dan mapping role sudah benar.

### Checkpoint Tahap 1
- [ ] Pastikan aplikasi masih bisa diakses (tidak ada error fatal).
- [ ] Cek tabel `role_has_permissions` — mapping harus sesuai tabel target di atas.

---

## Tahap 2: Proteksi Route dengan Middleware
> **Tujuan**: Memasang middleware permission di semua route master data, reports, dan settings yang saat ini terbuka.
> **Risiko**: Sedang — jika salah pasang middleware, user bisa terkunci dari halaman yang seharusnya bisa diakses.

### Task 2.1 — Proteksi route Master Data (Items)
- [ ] `GET /items` (index, show): Middleware `can:view-items`
- [ ] `POST/PUT/DELETE /items` (create, store, edit, update, destroy): Middleware `can:manage-items`
- **File**: `routes/web.php`

### Task 2.2 — Proteksi route Master Data (Categories)
- [ ] `GET /categories` (index, show): Middleware `can:view-categories`
- [ ] `POST/PUT/DELETE /categories`: Middleware `can:manage-categories`
- **File**: `routes/web.php`

### Task 2.3 — Proteksi route Master Data (Departments)
- [ ] `GET /departments` (index, show): Middleware `can:view-departments`
- [ ] `POST/PUT/DELETE /departments`: Middleware `can:manage-departments`
- **File**: `routes/web.php`

### Task 2.4 — Proteksi route Settings
- [ ] Semua route `/settings`: Middleware `can:manage-settings`
- **File**: `routes/web.php`

### Task 2.5 — Proteksi route Reports
- [ ] Semua route `/reports`: Middleware `can:view-reports`
- [ ] Route export di reports: Middleware `can:export-reports`
- **File**: `routes/web.php`

### Task 2.6 — Update route User Management
- [ ] Ubah middleware dari `role:warehouse_admin` menjadi `role:general_affairs`
- **File**: `routes/web.php`

### Checkpoint Tahap 2
- [ ] Login sebagai **Bagian Umum** → harus bisa akses: dashboard, master data (full CRUD), user management, settings, inbound, reports, forecasting.
- [ ] Login sebagai **Admin Gudang** → harus bisa akses: dashboard, master data (view only), outbound, reports (view only). **TIDAK bisa** akses: user management, settings, inbound, forecasting.
- [ ] Login sebagai **Penyelia** → harus bisa akses: dashboard, items & categories (view only), outbound (approve/reject). **TIDAK bisa** akses: departments, settings, inbound.
- [ ] Login sebagai **Staf** → harus bisa akses: dashboard, outbound (create & view own). **TIDAK bisa** akses: master data, settings, inbound, reports.

---

## Tahap 3: Update UI/Frontend — Sidebar & Navigasi
> **Tujuan**: Menyesuaikan tampilan sidebar/menu navigasi agar hanya menampilkan menu sesuai permission user yang sedang login.
> **Risiko**: Rendah — perubahan kosmetik, backend sudah terlindungi di Tahap 2.

### Task 3.1 — Identifikasi komponen sidebar/navigasi
- [ ] Cari komponen yang merender menu sidebar (kemungkinan di `resources/js/Layouts/` atau `resources/js/Components/`).
- [ ] Identifikasi bagaimana permission/role saat ini digunakan untuk menampilkan/menyembunyikan menu.

### Task 3.2 — Update visibilitas menu berdasarkan permission baru
- [ ] Menu **Master Data** (Items, Categories, Departments): Tampilkan jika user punya `view-items` / `view-categories` / `view-departments`.
- [ ] Menu **User Management**: Tampilkan jika user punya `manage-users`.
- [ ] Menu **Settings**: Tampilkan jika user punya `manage-settings`.
- [ ] Menu **Barang Masuk**: Tampilkan jika user punya `view-inbound`.
- [ ] Menu **Reports**: Tampilkan jika user punya `view-reports`.
- [ ] Menu **Forecasting**: Tampilkan jika user punya `view-forecasting`.
- **File**: Komponen sidebar/navigasi di `resources/js/`

### Task 3.3 — Sembunyikan tombol aksi CRUD di halaman master data
- [ ] Tombol "Tambah", "Edit", "Hapus" pada halaman Items hanya tampil jika user punya `manage-items`.
- [ ] Pola yang sama untuk Categories dan Departments.
- **File**: Komponen halaman master data di `resources/js/Pages/`

### Checkpoint Tahap 3
- [ ] Login per role — pastikan sidebar hanya menampilkan menu yang sesuai permission.
- [ ] Admin Gudang yang view halaman Items **tidak** melihat tombol Tambah/Edit/Hapus.

---

## Tahap 4: Update Dokumentasi Conductor & Verifikasi Akhir
> **Tujuan**: Memastikan seluruh dokumentasi proyek mencerminkan struktur permission yang baru.
> **Risiko**: Tidak ada — hanya perubahan dokumentasi.

### Task 4.1 — Update `conductor/product.md`
- [ ] Perbarui deskripsi role di bagian "Core Features" → sesuaikan deskripsi Admin Gudang dan Bagian Umum.
- **File**: `conductor/product.md`

### Task 4.2 — Update `conductor/workflow.md`
- [ ] Tambahkan catatan bahwa restrukturisasi role sudah dilakukan.
- **File**: `conductor/workflow.md`

### Task 4.3 — Update `conductor/tracks.md`
- [ ] Daftarkan track `role-permission-restructure` di registry.
- **File**: `conductor/tracks.md`

### Task 4.4 — Verifikasi akhir menyeluruh
- [ ] Pastikan tidak ada route yang masih terbuka tanpa middleware.
- [ ] Pastikan `OutboundPolicy` masih berfungsi normal (tidak terpengaruh perubahan).
- [ ] Jalankan smoke test manual: login per role, coba akses semua halaman.

### Checkpoint Tahap 4
- [ ] Semua file dokumentasi sudah ter-update.
- [ ] Semua halaman berfungsi sesuai permission baru.
- [ ] Track ditandai ✅ Completed di `tracks.md`.

---

## File yang Terdampak (Ringkasan)

| File | Tahap | Jenis Perubahan |
|---|---|---|
| `app/Enums/UserRole.php` | 1 | Update mapping permission |
| `database/seeders/RolePermissionSeeder.php` | 1 | Tambah permission baru |
| `routes/web.php` | 2 | Pasang middleware |
| Komponen Sidebar (`resources/js/`) | 3 | Update visibilitas menu |
| Komponen Pages (`resources/js/Pages/`) | 3 | Sembunyikan tombol aksi |
| `conductor/product.md` | 4 | Update dokumentasi |
| `conductor/workflow.md` | 4 | Update dokumentasi |
| `conductor/tracks.md` | 4 | Daftarkan track baru |
