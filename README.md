# SIMPATIK

**Sistem Manajemen Persediaan ATK** — Aplikasi manajemen gudang ATK & formulir cetakan untuk Bank Sumsel Babel Cabang A. Rivai.

---

## 📋 Tentang Aplikasi

SIMPATIK adalah sistem informasi berbasis web yang dirancang untuk mendigitalisasi proses pengelolaan persediaan ATK (Alat Tulis Kantor) dan formulir cetakan di lingkungan perbankan. Sistem ini menggantikan proses manual pencatatan stok, pengajuan barang, dan pelaporan mutasi menjadi alur kerja digital yang terintegrasi.

### Fitur Utama

- 🔐 **Multi-Role Authentication** — Admin Gudang, Staff Bagian Umum, Pimpinan, dan Staf Unit Kerja
- ✍️ **Mandatory Signature Onboarding** — Tanda tangan digital wajib saat pertama kali login
- 📦 **Manajemen Barang** — CRUD barang dengan auto-generate kode, filter kategori, dan alert stok rendah
- 👤 **Profil** — Edit informasi, ganti password, dan perbarui tanda tangan digital
- 📊 **Dashboard** — Statistik ringkas, pengajuan terbaru, dan peringatan stok rendah
- ✅ **Approval Workflow** — Pengajuan barang oleh staf, disetujui secara digital *(coming soon)*
- 📄 **Cetak Dokumen** — Generate PDF SPB/BAST dengan tanda tangan digital & QR Code *(coming soon)*
- 🤖 **Prediksi Kebutuhan** — Forecasting kebutuhan ATK menggunakan XGBoost via API Python *(coming soon)*
- ⚠️ **Low Stock Alert** — Notifikasi otomatis saat stok menyentuh batas minimum

---

## 🛠️ Tech Stack

### Backend
- **Framework:** Laravel 12.x
- **Architecture:** Controller → Service → Repository (Interface + Eloquent)
- **Database:** MySQL 8.x
- **Role & Permission:** Spatie Laravel Permission
- **Type Safety:** PHP Enums (`OutboundStatus`, `UserRole`)
- **PDF Generator:** Barryvdh Laravel DomPDF
- **QR Code:** SimpleSoftwareIO QR Code

### Frontend
- **Framework:** React 19 + Inertia.js 3.0
- **Styling:** Tailwind CSS 4.0
- **Language:** TypeScript
- **Architecture:** Atomic Design (UI → Fragments → Features → Pages)
- **Icons:** Lucide React
- **State:** Inertia `useForm` + Custom Hooks (`useDebounce`)

### Lainnya
- **ML Forecasting:** Python + FastAPI + XGBoost (Microservice terpisah)
- **Runtime Required:** PHP 8.2+ / Node.js 20+

---

## 🏗️ Arsitektur Project

### Backend (Laravel)

```
app/
├── Enums/                    # Type-safe enums (OutboundStatus, UserRole)
├── Http/
│   ├── Controllers/          # Thin controllers (delegate ke Service)
│   ├── Middleware/            # Auth, Signature, Inertia
│   └── Requests/             # FormRequest per modul (Item/, Profile/, Auth/)
├── Models/                   # Eloquent models + traits
├── Repositories/
│   ├── Contracts/            # Interface (dependency inversion)
│   └── Eloquent/             # Implementasi Eloquent
├── Services/                 # Business logic layer
├── Providers/                # RepositoryServiceProvider (binding)
└── Traits/                   # Reusable traits (HasSignature)
```

### Frontend (React + TypeScript)

```
resources/js/
├── Components/
│   ├── UI/                   # Komponen atomik reusable (Button, Input, DataTable, dll)
│   ├── Fragments/            # Komponen kecil komposisi (ListItem, CardLink)
│   └── Features/             # Komponen per-modul (Dashboard/, Items/, Profile/)
├── Config/                   # Konfigurasi navigasi sidebar
├── Hooks/                    # Custom hooks (useDebounce)
├── Layouts/                  # AuthenticatedLayout + Partials (Sidebar, Topbar)
├── Pages/                    # Halaman Inertia (Dashboard/, Items/, Profile/, Auth/)
└── Types/                    # TypeScript interfaces (single source of truth)
```

---

## 📂 Struktur Branch

| Branch | Fungsi |
|--------|--------|
| `dev` | Development — fitur baru dikembangkan di sini |
| `feature/*` | Feature branches — branch per modul (item-crud, profile, dll) |
| `staging` | Staging — testing sebelum production |
| `production` | Production — versi live yang digunakan |

---

## 📦 Modul yang Sudah Selesai

| Modul | Backend | Frontend | Status |
|-------|---------|----------|--------|
| Auth (Login, Signature) | ✅ | ✅ | Merged ke `dev` |
| Dashboard | ✅ | ✅ | Merged ke `dev` |
| User Management | ✅ | ✅ | Merged ke `dev` |
| Barang (Items CRUD) | ✅ | ✅ | `feature/item-crud` |
| Profil | ✅ | ✅ | `feature/profile` |
| Kategori | ⏳ | ⏳ | Dikerjakan Rekan 1 |
| Unit Kerja | ⏳ | ⏳ | Dikerjakan Rekan 2 |
| Barang Masuk (Inbound) | 🔲 | 🔲 | Belum dimulai |
| Pengajuan Keluar (Outbound) | 🔲 | 🔲 | Belum dimulai |
| Laporan / Reports | 🔲 | 🔲 | Belum dimulai |
| PDF Generator | 🔲 | 🔲 | Belum dimulai |

---

## ⚙️ Instalasi & Setup

### Prasyarat

- PHP >= 8.2 (dengan ekstensi: `zip`, `bz2`, `gd`, `mbstring`, `openssl`, `pdo_mysql`)
- Composer >= 2.x
- Node.js >= 20.x
- MySQL >= 8.0
- Git

### Langkah Instalasi

```bash
# 1. Clone repository
git clone https://github.com/wahyu2021/SIMPATIK.git
cd SIMPATIK

# 2. Install dependencies backend & frontend
composer install
npm install

# 3. Setup environment
cp .env.example .env
php artisan key:generate

# 4. Konfigurasi database di .env
# DB_CONNECTION=mysql
# DB_DATABASE=simpatik
# DB_USERNAME=root
# DB_PASSWORD=

# 5. Buat symbolic link untuk storage
php artisan storage:link

# 6. Jalankan migrasi & seeder
php artisan migrate --seed

# 7. Build frontend assets dan jalankan server lokal
composer run dev
```

### Akses Aplikasi

- **Aplikasi Web**: `http://localhost:8000` (otomatis redirect ke login)

---

## 👥 Role & Hak Akses

> **Catatan:** Gudang dikelola oleh 1 orang pegawai (Admin Gudang). Role lainnya adalah pengguna dari unit kerja yang mengajukan kebutuhan ATK.

| Role | Deskripsi | Akses Utama |
|------|-----------|-------------|
| `warehouse_admin` | Admin Gudang (pengelola tunggal) | Full control: kelola barang, stok, transaksi, user, settings |
| `division_head` | Penyelia / Kepala Unit Kerja | Approve pengajuan staf di unit kerjanya |
| `general_affairs` | Staff Bagian Umum | Lihat laporan, audit, dan monitoring |
| `staff` | Staf Unit Kerja (pemohon) | Ajukan barang, lihat status pengajuan sendiri |

### Alur Pengajuan Barang

```
Staf Unit Kerja          Penyelia Unit Kerja         Admin Gudang (Mba Ajeng)
     │                          │                            │
     ├── Buat Pengajuan ──────► │                            │
     │                          ├── Approve/Tolak ─────────► │
     │                          │                            ├── Proses & Keluarkan Barang
     │                          │                            ├── Update Stok
     │                          │                            └── Cetak SPB/BAST
```

---

## 🧩 Komponen UI yang Tersedia

| Komponen | Kegunaan |
|----------|----------|
| `Button` | Tombol aksi (primary, secondary, danger, link) |
| `Input` | Input teks dengan label + error handling |
| `Select` | Dropdown select dengan error handling |
| `DataTable` | Tabel data generik dengan kolom kustom |
| `Pagination` | Navigasi halaman untuk data paginate |
| `SearchInput` | Input pencarian dengan icon |
| `Badge` | Label status berwarna (success, warning, danger, dll) |
| `Alert` | Notifikasi/flash message |
| `Breadcrumbs` | Navigasi hierarki halaman |
| `PageHeader` | Header konsisten (judul + deskripsi + aksi) |
| `ConfirmDialog` | Dialog konfirmasi sebelum aksi berbahaya |
| `Modal` | Modal dialog |
| `Card` | Container card |
| `StatCard` | Card statistik untuk dashboard |

---

## 📄 Lisensi

Proprietary — Hak cipta © 2026 Bank Sumsel Babel. Hanya untuk penggunaan internal.
Lihat file [LICENSE](LICENSE) untuk detail lengkap.
