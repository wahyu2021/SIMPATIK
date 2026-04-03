# SIMPATIK

**Sistem Manajemen Persediaan ATK** — Aplikasi manajemen gudang ATK & formulir cetakan untuk Bank Sumsel Babel Cabang A. Rivai.

---

## 📋 Tentang Aplikasi

SIMPATIK adalah sistem informasi berbasis web yang dirancang untuk mendigitalisasi proses pengelolaan persediaan ATK (Alat Tulis Kantor) dan formulir cetakan di lingkungan perbankan. Sistem ini menggantikan proses manual pencatatan stok, pengajuan barang, dan pelaporan mutasi menjadi alur kerja digital yang terintegrasi.

### Fitur Utama

- 🔐 **Multi-Role Authentication** — Admin Gudang, Staff Bagian Umum, Pimpinan, dan Staf Unit Kerja
- ✍️ **Mandatory Signature Onboarding** — Tanda tangan digital wajib saat pertama kali login
- 📦 **Manajemen Gudang** — Penerimaan barang (inbound) dan distribusi barang (outbound)
- ✅ **Approval Workflow** — Pengajuan barang oleh staf, disetujui oleh Staff Bagian Umum / Admin secara digital
- 📄 **Cetak Dokumen Otomatis** — Generate PDF SPB/BAST dengan tanda tangan digital & QR Code
- 📊 **Kartu Mutasi Stok** — Ledger digital untuk rekap saldo barang (masuk/keluar/sisa)
- 🤖 **Prediksi Kebutuhan (ML)** — Forecasting kebutuhan ATK menggunakan XGBoost via API Python
- ⚠️ **Low Stock Alert** — Notifikasi otomatis saat stok menyentuh batas minimum

---

## 🛠️ Tech Stack

| Layer | Teknologi | Versi |
|-------|-----------|-------|
| **Framework** | Laravel | 12.56.0 |
| **Admin Panel** | Filament PHP | 5.3.5 |
| **Database** | MySQL | 8.4.3 |
| **Role & Permission** | Spatie Laravel Permission | 7.2 |
| **Tanda Tangan Digital** | Saade Filament Autograph | 4.1 |
| **PDF Generator** | Barryvdh Laravel DomPDF | 3.1 |
| **QR Code** | SimpleSoftwareIO QR Code | 4.2 |
| **ML Forecasting** | Python + FastAPI + XGBoost | Microservice terpisah |
| **Runtime** | PHP 8.3 / Node.js 24 | - |

---

## 📂 Struktur Branch

| Branch | Fungsi |
|--------|--------|
| `dev` | Development — fitur baru dikembangkan di sini |
| `staging` | Staging — testing sebelum production |
| `production` | Production — versi live yang digunakan |

---

## ⚙️ Instalasi & Setup

### Prasyarat

- PHP >= 8.3 (dengan ekstensi: `zip`, `bz2`, `gd`, `mbstring`, `openssl`, `pdo_mysql`)
- Composer >= 2.x
- Node.js >= 20.x
- MySQL >= 8.0
- Git

### Langkah Instalasi

```bash
# 1. Clone repository
git clone https://github.com/wahyu2021/SIMPATIK.git
cd SIMPATIK

# 2. Install dependencies
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

# 5. Jalankan migrasi & seeder
php artisan migrate --seed

# 6. Buat user admin pertama
php artisan make:filament-user

# 7. Build frontend assets
npm run build

# 8. Jalankan server
php artisan serve
```

### Akses Aplikasi

- **Panel Admin**: `http://localhost:8000/admin`

---

## 👥 Role & Hak Akses

| Role | Deskripsi | Akses Utama |
|------|-----------|-------------|
| `warehouse_admin` | Admin Gudang | Full access, kelola user & settings |
| `general_affairs` | Staff Bagian Umum | Audit, approve pengajuan, kelola transaksi & master data |
| `division_head` | Pimpinan | View dashboard, laporan, & forecasting |
| `staff` | Staf Unit Kerja | Ajukan barang, lihat pengajuan divisi sendiri |

---

## 📄 Lisensi

Proprietary — Hak cipta © 2026 Bank Sumsel Babel. Hanya untuk penggunaan internal.
Lihat file [LICENSE](LICENSE) untuk detail lengkap.
