# Track: Penyesuaian Card & Tampilan Dashboard per Role

## Metadata
- **Track ID**: `dashboard-role-customization`
- **Status**: ✅ Completed
- **Prioritas**: Tinggi
- **Deskripsi**: Menyesuaikan *Card Info* (Statistik) dan tabel/grafik yang muncul di halaman Dashboard agar spesifik dan relevan dengan fokus pekerjaan masing-masing *role* (Bagian Umum, Admin Gudang, Penyelia, dan Staf).

---

## Latar Belakang

### Kondisi Saat Ini
- Halaman Dashboard menampilkan `StatsGrid` (kumpulan *card info*) yang sama untuk semua pengguna.
- Komponen grafik (`MonthlyTrendChart`, `StatusDistributionChart`) dan tabel (`RecentRequests`, `LowStockAlerts`) dirender secara global tanpa mempertimbangkan *role* pengguna yang sedang *login*.
- Pengguna menjadi bingung karena melihat informasi yang tidak relevan dengan tugas mereka (contoh: Staf melihat jumlah total *user* atau barang stok rendah).

### Kebutuhan (Berdasarkan Analisa Peran)
- **Bagian Umum:**
  - *Fokus:* Pengadaan dan kesehatan sistem.
  - *Dibutuhkan:* Peringatan stok menipis, Total barang masuk bulan ini, Total Barang/Unit/User, dan Grafik Tren Transaksi.
- **Admin Gudang:**
  - *Fokus:* Eksekusi penyerahan fisik barang.
  - *Dibutuhkan:* Permintaan menunggu disiapkan (*Pending Issue* - status Approved), Barang diserahkan hari ini (*Issued/Completed*), dan Peringatan stok menipis.
- **Penyelia:**
  - *Fokus:* Menyetujui pengajuan bawahan.
  - *Dibutuhkan:* Permintaan menunggu persetujuan (*Pending Approval* - status Pending), Pengajuan disetujui hari ini, dan Daftar pengajuan terbaru unitnya.
- **Staf:**
  - *Fokus:* Tracking pengajuan pribadi.
  - *Dibutuhkan:* Pengajuan aktif (*My Active Requests*), Pengajuan selesai (*My Completed Requests*), dan Daftar pengajuan pribadinya. (Grafik tidak perlu).

---

## Tahap 1: Repository Layer (Database Queries)
> **Tujuan**: Memisahkan query database agar lebih spesifik dan tidak tumpang tindih untuk masing-masing *role*.

### Task 1.1 — Query untuk Penyelia (Division Head)
- [ ] Tambahkan `countPendingApproval($user)` di kontrak dan implementasi `DashboardRepository`.
  *(Hanya mengambil transaksi `OutboundStatus::Pending` yang `department_id`-nya sama dengan penyelia).*

### Task 1.2 — Query untuk Admin Gudang (Warehouse Admin)
- [ ] Tambahkan `countPendingIssue()` di kontrak dan implementasi `DashboardRepository`.
  *(Hanya mengambil transaksi `OutboundStatus::Approved` yang menunggu diserahkan).*

### Task 1.3 — Query untuk Staf (Staff)
- [ ] Tambahkan `countMyActiveRequests($user)`: mengambil status `Pending` atau `Approved` milik user tersebut.
- [ ] Tambahkan `countMyCompletedRequests($user)`: mengambil status `Completed` milik user tersebut.

- **File Terdampak**: 
  - `app/Repositories/Contracts/DashboardRepositoryInterface.php`
  - `app/Repositories/Eloquent/DashboardRepository.php`

---

## Tahap 2: Service Layer (Data Formatting)
> **Tujuan**: Menyusun *output* angka statistik menjadi sebuah array/objek standar yang seragam namun isinya berbeda tergantung *role*.

### Task 2.1 — Refactoring `getStats()` di `DashboardService`
- [ ] Modifikasi `getStats($user)` agar menggunakan struktur `match($userRole)`.
- [ ] Jika **Bagian Umum**: kembalikan array berisi `total_items`, `low_stock_count`, `inbound_this_month`, `total_users`.
- [ ] Jika **Admin Gudang**: kembalikan array berisi `pending_issue`, `approved_today` (atau issued today), `total_items`, `low_stock_count`.
- [ ] Jika **Penyelia**: kembalikan array berisi `pending_approval`, `approved_today`.
- [ ] Jika **Staf**: kembalikan array berisi `my_active_requests`, `my_completed_requests`.
- **File Terdampak**: `app/Services/DashboardService.php`

---

## Tahap 3: Frontend & UI Components
> **Tujuan**: Memastikan komponen antarmuka merespon struktur data baru tanpa *error* dan menyembunyikan elemen yang tidak perlu.

### Task 3.1 — Update Interface TypeScript
- [ ] Perbarui `DashboardStats` di `index.ts` dengan menjadikan semua properti statistik bersifat opsional (`?`), karena tidak semua role menerima data yang sama.
- **File Terdampak**: `resources/js/Types/index.ts`

### Task 3.2 — Update Komponen `StatsGrid.tsx`
- [ ] Ubah statik *mapping* (yang mem-parsing props `stats`) menjadi dinamis dengan memunculkan *Card* hanya jika nilai dari backend dikirimkan (tidak *undefined*).
- **File Terdampak**: `resources/js/Components/Features/Dashboard/StatsGrid.tsx`

### Task 3.3 — Kondisional Rendering di Layout Dashboard
- [ ] Sembunyikan `<MonthlyTrendChart />` dan `<StatusDistributionChart />` untuk *role* **Staf**.
- [ ] Sembunyikan `<LowStockAlerts />` untuk *role* **Staf** dan **Penyelia** (Hanya tampil untuk Umum & Gudang).
- [ ] Pastikan `<RecentRequests />` sudah ter-filter aman berdasarkan bawaan fungsi *repository*.
- **File Terdampak**: `resources/js/Pages/Dashboard/Index.tsx`

---

## Tahap 3: Testing & Dokumentasi
> **Tujuan**: Memastikan tidak ada *error* data dan setiap role melihat tampilan yang benar.

### Task 3.1 — QA & Verifikasi
- [ ] Login sebagai **Bagian Umum**: Verifikasi kartu total barang, stok rendah, tabel stok rendah tampil.
- [ ] Login sebagai **Admin Gudang**: Verifikasi kartu menunggu disiapkan (*pending issue*) tampil akurat.
- [ ] Login sebagai **Penyelia**: Verifikasi kartu *pending approval* tampil dan sesuai jumlah anak buahnya.
- [ ] Login sebagai **Staf**: Verifikasi kartu hanya memunculkan data pengajuannya sendiri, grafik dan stok rendah tersembunyi.

### Task 3.2 — Finalisasi
- [ ] Tandai track sebagai selesai di `conductor/tracks.md`.
