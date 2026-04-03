# Tech Stack — SIMPATIK

### 1. Core System (Backend & Frontend UI)

| Komponen | Teknologi | Versi | Keterangan |
|----------|-----------|-------|------------|
| Framework Inti | Laravel | 12.56.0 | Routing, Eloquent ORM, Queue, API Client |
| Admin Panel & UI | Filament PHP | 5.3.5 | TALL Stack + Livewire 4, menangani seluruh antarmuka |
| Styling | Tailwind CSS | 4.x | Bawaan Filament 5 |
| Livewire | Livewire | 4.2.4 | Reactive UI tanpa JavaScript framework terpisah |

### 2. Database & Storage

| Komponen | Teknologi | Keterangan |
|----------|-----------|------------|
| Relational Database | MySQL 8.4.3 | Master data, transaksi, audit log |
| File Storage | Laravel Local Storage | `storage/app/public/signatures/` untuk gambar tanda tangan |

### 3. Machine Learning Microservice (Otak Prediksi)

> **Catatan:** Berjalan sebagai server terpisah (API) di project Python lain.

| Komponen | Teknologi | Keterangan |
|----------|-----------|------------|
| Bahasa | Python 3.9+ | — |
| Web Framework | FastAPI | Endpoint API untuk prediksi |
| ML Algorithm | XGBoost | Forecasting kebutuhan ATK |
| Data Processing | Pandas + NumPy | Olah data historis JSON dari Laravel |

---

### 4. Daftar Package Terinstall (Composer)

| Package | Versi | Fungsi |
|---------|-------|--------|
| `filament/filament` | ^5.3.5 | Admin panel, CRUD, dashboard |
| `saade/filament-autograph` | ^4.1 | Signature pad untuk mandatory onboarding tanda tangan digital |
| `spatie/laravel-permission` | ^7.2 | Role & permission management (warehouse_admin, general_affairs, division_head, staff) |
| `barryvdh/laravel-dompdf` | ^3.1 | Export dokumen BAST/SPB ke PDF dengan tanda tangan & QR Code |
| `simplesoftwareio/simple-qrcode` | ^4.2 | Generate QR Code validasi di dokumen PDF |

> **Catatan Perubahan:** `coolsam/signature-pad` pada rancangan awal diganti dengan `saade/filament-autograph` karena kompatibilitas dengan Filament 5.

---

### 5. Lingkungan Development

| Tool | Versi |
|------|-------|
| PHP | 8.3.30 |
| Composer | 2.8.6 |
| Node.js | 24.5.0 |
| MySQL | 8.4.3 (Laragon) |
| OS | Windows |