# Track: Pembaruan Activity Diagram (1 Use Case = 1 Diagram)

## Metadata
- **Track ID**: `update-activity-diagram`
- **Status**: 🔴 Todo
- **Prioritas**: Tinggi
- **Deskripsi**: Memperbarui file `laporan_activity_diagram.md` agar setiap *Use Case* pada Diagram Use Case terbaru SIMPATIK memiliki *Activity Diagram*-nya masing-masing (relasi 1:1). Total: **14 Activity Diagram** menggunakan format *swimlane* Mermaid (`flowchart TD` dengan `subgraph` per aktor). Seluruh alur telah diverifikasi terhadap kode sumber aktual (`OutboundService`, `InboundService`, `UserService`, `ReportService`, semua Controller, Enum, dan Notification class).

---

## Latar Belakang

File `laporan_activity_diagram.md` saat ini hanya memiliki **7 diagram** yang sebagian besar tidak akurat dan menggabungkan beberapa *Use Case* menjadi satu alur. Setelah riset menyeluruh ke dalam kode sumber, ditemukan beberapa ketidaksesuaian kritis:

| Masalah Lama | Kondisi Real di Kode |
|---|---|
| AD 2.2 menyebut "Admin Gudang" untuk *Inbound* | `InboundController` hanya bisa diakses role `general_affairs` (permission `create-inbound`) |
| AD 2.3 menggabungkan 4+ UC menjadi satu diagram | Harus dipecah menjadi AD-08, AD-11, AD-12, AD-13, AD-09 (5 diagram terpisah) |
| Tidak ada diagram untuk Audit Trail, Pengelolaan Pengguna, Melihat Data Barang | Ketiga UC ini ada di sistem nyata |
| Status transaksi tidak akurat | State machine nyata: `Pending → Approved → Issued → HandedOver → Completed` (atau `Rejected`) |
| Tidak menyebutkan notifikasi dual-channel | Sistem nyata mengirim notifikasi via **Web (database)** + **WhatsApp API** secara bersamaan |

---

## Referensi Teknis Sistem Nyata

### State Machine OutboundStatus (dari `app/Enums/OutboundStatus.php`)
```
[Pending] ──(Penyelia approve)──▶ [Approved] ──(Admin Gudang issue)──▶ [Issued]
    │                                  │                                     │
    │                            (tolak)│                              (serahkan fisik)
    │                                  ▼                                     ▼
    └──────(tolak dari Pending)──▶ [Rejected]                        [HandedOver]
                                                                             │
                                                                     (Staff pickup)
                                                                             ▼
                                                                        [Completed]
--- Jalur bypass (Direct Request) ---
Admin Gudang input ──▶ langsung [Issued] (stok terpotong seketika)
```

### Sistem Notifikasi (dari `app/Notifications/`)
| Event | Notifikasi Dikirim | Penerima |
|---|---|---|
| Staff submit pengajuan baru | `NewOutboundRequestNotification` | Semua Penyelia di departemen yang sama (DB + WA) |
| Penyelia approve | `OutboundStatusUpdatedNotification` (ke pemohon) + `OutboundReadyForIssueNotification` | Pemohon + Semua `warehouse_admin` (DB + WA) |
| Penyelia/Admin reject | `OutboundStatusUpdatedNotification` | Pemohon (DB + WA) |
| Admin Gudang issue | `OutboundStatusUpdatedNotification` | Pemohon (DB + WA) |
| Admin Gudang handover | `OutboundStatusUpdatedNotification` | Pemohon (DB + WA) |
| Staff pickup (completed) | `OutboundStatusUpdatedNotification` | Pemohon (DB + WA) |
| Stok ≤ minimum_stock_level | `LowStockAlertNotification` | Semua `warehouse_admin` (DB + WA) |

### Permission per Role (dari `app/Enums/UserRole.php`)
- **general_affairs:** manage-users, manage-settings, manage-items, manage-categories, manage-departments, create-inbound, view-reports, export-reports
- **warehouse_admin:** approve-outbound (issue), view-all-requests, view-reports, view-items
- **division_head:** create-outbound-request, approve-outbound (verifikasi Penyelia), view-own-unit-requests
- **staff:** create-outbound-request, view-own-requests

---

## Daftar 14 Activity Diagram

| No. | ID | Use Case | Aktor Swimlane | Source Code Utama |
|-----|-----|----------|----------------|-------------------|
| 1 | AD-01 | Login | Pengguna \| Sistem | `LoginController`, `AuthService` |
| 2 | AD-02 | Mengelola Data Master | Bagian Umum \| Sistem | `ItemController`, `CategoryController`, `DepartmentController` |
| 3 | AD-03 | Menginput Barang Masuk | Bagian Umum \| Sistem | `InboundController`, `InboundService` |
| 4 | AD-04 | Mengelola Pengguna | Bagian Umum \| Sistem | `UserManagementController`, `UserService` |
| 5 | AD-05 | Melihat Audit Trail Digital | Bagian Umum \| Sistem | `ActivityLogController` |
| 6 | AD-06 | Mengelola Pengaturan Sistem | Bagian Umum \| Sistem | `SettingController` |
| 7 | AD-07 | Melihat Laporan & Rekonsiliasi | Bagian Umum/Admin Gudang \| Sistem | `ReportController`, `ReportService` |
| 8 | AD-08 | Mengajukan Permintaan Barang | Staff/Penyelia \| Sistem | `OutboundController@store`, `OutboundService@createRequest` |
| 9 | AD-09 | Mengonfirmasi Serah Terima Barang | Admin Gudang \| Staff \| Sistem | `OutboundService@handoverItems`, `@pickupItems` |
| 10 | AD-10 | Cetak Dokumen Transaksi | Staff/Admin Gudang \| Sistem | `OutboundController@downloadSpb`, `@downloadBast` |
| 11 | AD-11 | Verifikasi Permintaan Barang | Penyelia \| Sistem | `OutboundController@approve`, `@reject`, `OutboundService@approveRequest` |
| 12 | AD-12 | Membuat Permintaan Langsung | Admin Gudang \| Sistem | `OutboundController@storeDirect`, `OutboundService@createDirectRequest` |
| 13 | AD-13 | Menyetujui Permintaan Barang | Admin Gudang \| Sistem | `OutboundController@issue`, `OutboundService@issueItems` |
| 14 | AD-14 | Melihat Data Barang | Admin Gudang \| Sistem | `ItemController@index` |

---

## Tahap 1: Persiapan

### Task 1.1 — Konfirmasi Format Diagram
- [ ] Semua diagram menggunakan `flowchart TD`.
- [ ] Aktor manusia dibungkus dalam `subgraph [NamaAktor]`.
- [ ] Sistem dibungkus dalam `subgraph Sistem [Sistem SIMPATIK]`.
- [ ] Titik awal: `([Mulai])`, titik akhir: `([Selesai])`.
- [ ] Keputusan menggunakan `{teks pertanyaan?}`.
- [ ] Notifikasi digambarkan sebagai node aksi di swimlane Sistem dengan format `(Kirim Notif: ...)`.

---

## Tahap 2: Penulisan 14 Activity Diagram (Alur Real Sistem)

### Task 2.1 — AD-01: Login
- [ ] **Swimlane:** Pengguna | Sistem SIMPATIK
- [ ] **Alur Real:**
  1. User buka halaman `/login` → input email & password
  2. Sistem validasi via `LoginRequest` (email wajib, password wajib)
  3. `AuthService::login()` → cek kredensial di DB
  4. Jika salah → tampilkan error, kembali ke form
  5. Jika benar → cek `is_active` user
  6. Jika nonaktif → tampilkan pesan "Akun dinonaktifkan"
  7. Jika aktif → `session()->regenerate()` (cegah session fixation)
  8. Cek apakah user sudah punya tanda tangan digital (signature)
  9. Jika belum → redirect ke halaman *Onboarding Signature*
  10. User gambar tanda tangan di canvas → simpan
  11. Jika sudah → redirect ke halaman *Dashboard* sesuai role

### Task 2.2 — AD-02: Mengelola Data Master
- [ ] **Swimlane:** Bagian Umum | Sistem SIMPATIK
- [ ] **Modul:** Barang (`ItemController`), Kategori (`CategoryController`), Unit Kerja (`DepartmentController`)
- [ ] **Alur Real:**
  1. Bagian Umum pilih sub-modul (Barang/Kategori/Unit Kerja)
  2. Sistem tampilkan daftar data dengan filter & paginasi
  3. Pilih aksi: **Tambah** / **Edit** / **Hapus**
  4. Jika Tambah/Edit → tampilkan form, input data
  5. Submit → validasi via `StoreItemRequest`/`UpdateItemRequest` (dan analog untuk Kategori/Departemen)
  6. Jika gagal validasi → tampilkan error inline, kembali ke form
  7. Jika lolos → Service buat/update record di DB
  8. Jika Hapus → tampilkan konfirmasi → `soft delete` (data tetap di DB dengan `deleted_at`)
  9. Sistem tampilkan flash message sukses → redirect ke halaman daftar

### Task 2.3 — AD-03: Menginput Barang Masuk
- [ ] **Swimlane:** Bagian Umum | Sistem SIMPATIK
- [ ] **Alur Real (berdasarkan `InboundService::createInbound()`):**
  1. Bagian Umum masuk menu Barang Masuk → klik "Buat Transaksi Baru"
  2. Sistem tampilkan form + generate nomor referensi berikutnya
  3. Input: nomor referensi (opsional, auto-generate jika kosong), tanggal, catatan, upload struk/nota (opsional), detail barang (item + qty)
  4. Submit → validasi via `StoreInboundRequest`
  5. Jika gagal → tampilkan error, kembali ke form
  6. Jika lolos → `InboundService::createInbound()` dalam **DB Transaction**:
     - Generate nomor referensi jika kosong
     - Upload gambar struk ke storage `public/inbound-receipts` (jika ada)
     - Simpan record `InboundTransaction`
     - Per detail: simpan `InboundDetail` → **`lockForUpdate()`** item → `current_stock += qty` → catat `StockLedger` (movement_type: `in`)
  7. Redirect ke daftar Barang Masuk dengan flash sukses

### Task 2.4 — AD-04: Mengelola Pengguna
- [ ] **Swimlane:** Bagian Umum | Sistem SIMPATIK
- [ ] **Alur Real (berdasarkan `UserManagementController` + `UserService`):**
  1. Bagian Umum masuk menu Manajemen User
  2. Sistem tampilkan daftar user dengan filter (search, departemen, role, status aktif) + paginasi
  3. Pilih aksi:
     - **Tambah:** Input data (nama, email, password, departemen, role, status) → validasi → `UserService::createUser()` → assign role & sync permissions via Spatie Permission
     - **Edit:** Tampilkan form pre-filled → update → jika role berubah, `syncRoleAndPermissions()` ulang
     - **Hapus:** Cek apakah user punya relasi transaksi; jika ada → abort (saran: nonaktifkan saja); jika tidak → soft delete
     - **Toggle Status:** Klik toggle → `UserService::toggleStatus()` → ubah `is_active` (true↔false)
     - **Import:** Upload file Excel/CSV → `UsersImport` via Maatwebsite Excel → tampilkan jumlah yang berhasil diimpor atau pesan error
  4. Flash message sukses/gagal + redirect

### Task 2.5 — AD-05: Melihat Audit Trail Digital
- [ ] **Swimlane:** Bagian Umum | Sistem SIMPATIK
- [ ] **Alur Real (berdasarkan `ActivityLogController`):**
  1. Bagian Umum masuk menu Audit Trail
  2. Sistem tampilkan daftar log dengan paginasi (20 per halaman) + dropdown filter modul
  3. Tentukan filter: teks pencarian (cari di kolom `description`, `log_name`, nama user) dan/atau filter modul
  4. Sistem re-query `ActivityLog` dengan filter + load relasi `user`
  5. Tampilkan tabel hasil log (siapa, aksi apa, kapan, modul apa)
  6. (Opsional) Klik baris log → Sistem return JSON detail via `show()` → tampilkan data `properties` (diff data sebelum/sesudah perubahan)

### Task 2.6 — AD-06: Mengelola Pengaturan Sistem
- [ ] **Swimlane:** Bagian Umum | Sistem SIMPATIK
- [ ] **Alur Real (berdasarkan `SettingController`):**
  1. Bagian Umum masuk menu Pengaturan
  2. Sistem query semua record tabel `settings` → transform menjadi map `key => value` → tampilkan di form
  3. Edit nilai konfigurasi (identitas instansi, prefix dokumen, URL WA Gateway, URL ML/Forecasting, dll)
  4. Submit → validasi via `UpdateSettingRequest`
  5. Jika gagal → tampilkan error
  6. Jika lolos → loop tiap key-value → `updateOrCreate` di tabel `settings` (upsert; nilai null disimpan sebagai string kosong)
  7. Flash message sukses + redirect kembali ke halaman pengaturan

### Task 2.7 — AD-07: Melihat Laporan & Rekonsiliasi
- [ ] **Swimlane:** Bagian Umum/Admin Gudang | Sistem SIMPATIK
- [ ] **Alur Real (berdasarkan `ReportController` + `ReportService`):**
  1. Aktor masuk menu Laporan, pilih jenis: **Mutasi Stok** / **Kartu Stok** / **Laporan per Unit Kerja** / **Rekonsiliasi**
  2. Pilih periode (bulan, tahun) + filter opsional (kategori/item/departemen)
  3. Sistem query & agregasi data dari DB:
     - *Mutasi:* hitung saldo awal + masuk - keluar per item per kategori
     - *Kartu Stok:* ambil entri `StockLedger` per item
     - *Unit Kerja:* total pengeluaran per item untuk departemen tertentu
  4. Tampilkan preview tabel laporan
  5. (Opsional) Klik Export:
     - **PDF:** generate via DomPDF dari Blade view `pdf.*` → stream file ke browser
     - **Excel:** bungkus dalam `*Export` class → download file XLSX
  6. **Sub-alur Rekonsiliasi:**
     - Cek apakah rekonsiliasi bulan ini sudah ada di DB
     - Jika sudah `completed` → tampilkan data hasil rekonsiliasi + tombol export Berita Acara PDF
     - Jika belum → hitung stok sistem per item (opening + inbound - outbound) → tampilkan form dengan qty sistem sebagai nilai default
     - Aktor input qty fisik hasil hitung gudang per item → Submit
     - `ReportService::saveReconciliation()` dalam **DB Transaction:**
       - Simpan header + detail rekonsiliasi
       - Per item: hitung selisih (fisik - sistem)
       - Jika ada selisih → `lockForUpdate()` item → update `current_stock` ke qty fisik → catat `StockLedger` (movement_type: `adjustment`)
       - Jika stok hasil rekonsiliasi ≤ `minimum_stock_level` → kirim `LowStockAlertNotification` ke semua `warehouse_admin`
     - Flash sukses + redirect ke halaman rekonsiliasi

### Task 2.8 — AD-08: Mengajukan Permintaan Barang
- [ ] **Swimlane:** Staff/Penyelia | Sistem SIMPATIK
- [ ] **Alur Real (berdasarkan `OutboundService::createRequest()`):**
  1. Staff/Penyelia masuk menu Permintaan → klik "Buat Pengajuan"
  2. Sistem tampilkan form + generate nomor dokumen berikutnya + daftar item
  3. Input: tanggal, catatan, detail barang (item + qty yang diminta)
  4. Submit → validasi via `StoreOutboundRequest`; `requester_id` & `department_id` diambil otomatis dari `auth()->user()`
  5. `OutboundService::createRequest()` dalam **DB Transaction:**
     - Generate nomor dokumen jika kosong
     - **Cek role pemohon:**
       - Jika **Penyelia (`division_head`):** status langsung → `Approved`; `approver_id` = diri sendiri; `qty_approved` = `qty_requested`
       - Jika **Staff:** status → `Pending`; `qty_approved` = 0
     - Simpan `OutboundTransaction` + semua `OutboundDetail`
     - **Kirim Notifikasi (DB + WA):**
       - Jika Penyelia: kirim `OutboundReadyForIssueNotification` ke semua `warehouse_admin`
       - Jika Staff: kirim `NewOutboundRequestNotification` ke semua `division_head` di departemen yang sama
  6. Redirect ke daftar pengajuan dengan flash sukses

### Task 2.9 — AD-09: Mengonfirmasi Serah Terima Barang
- [ ] **Swimlane:** Admin Gudang | Staff | Sistem SIMPATIK
- [ ] **Alur Real (berdasarkan `OutboundService::handoverItems()` & `::pickupItems()`):**
  1. Admin Gudang buka detail transaksi berstatus `Issued`
  2. Klik "Serahkan Barang" → Gate `handover` divalidasi
  3. `OutboundService::handoverItems()`:
     - Validasi status harus `Issued`
     - Update status → `HandedOver`; simpan `handed_over_by`, `handed_over_at`
     - Kirim `OutboundStatusUpdatedNotification` ke pemohon (DB + WA)
  4. Staff menerima notifikasi → buka detail transaksi berstatus `HandedOver`
  5. Klik "Konfirmasi Terima" → Gate `pickup` divalidasi
  6. `OutboundService::pickupItems()`:
     - Validasi status harus `HandedOver`
     - Update status → `Completed`; simpan `picked_up_by`, `picked_up_at`
     - Kirim `OutboundStatusUpdatedNotification` ke pemohon (konfirmasi selesai, DB + WA)
  7. Transaksi selesai — siklus outbound tertutup

### Task 2.10 — AD-10: Cetak Dokumen Transaksi
- [ ] **Swimlane:** Staff/Admin Gudang | Sistem SIMPATIK
- [ ] **Alur Real (berdasarkan `OutboundController@downloadSpb` & `@downloadBast`):**
  1. Aktor buka halaman detail transaksi
  2. Pilih dokumen yang akan dicetak: **SPB** (Surat Permintaan Barang) atau **BAST** (Berita Acara Serah Terima)
  3. **Alur Cetak SPB:**
     - Sistem load transaksi + semua relasi (requester, approver, details.item, dll)
     - Ambil data signatory dari tabel `settings` (nama instansi, cabang, alamat)
     - Generate URL QR Code yang mengarah ke halaman detail transaksi
     - Render PDF dari Blade view `pdf.spb` via DomPDF
     - Stream file `SPB-{nomor_dokumen}.pdf` ke browser
  4. **Alur Cetak BAST:**
     - Validasi: transaksi harus berstatus `HandedOver` atau `Completed`; jika tidak → abort 403
     - Render PDF dari Blade view `pdf.bast`
     - Stream file `BAST-{nomor_dokumen}.pdf` ke browser

### Task 2.11 — AD-11: Verifikasi Permintaan Barang
- [ ] **Swimlane:** Penyelia | Sistem SIMPATIK
- [ ] **Alur Real (berdasarkan `OutboundService::approveRequest()` & `::rejectRequest()`):**
  1. Penyelia masuk menu Pengajuan
  2. Sistem filter otomatis: hanya tampilkan pengajuan dari departemennya sendiri (permission `view-own-unit-requests`), status `Pending`
  3. Pilih pengajuan → buka halaman detail
  4. Review detail (barang, qty, tanggal, catatan)
  5. **Jika Setujui:**
     - (Opsional) Sesuaikan `qty_approved` per item (tidak boleh melebihi `qty_requested`)
     - Klik "Setujui" → Gate `approve` divalidasi
     - `OutboundService::approveRequest()` dalam **DB Transaction:**
       - Validasi status harus `Pending`
       - Update `qty_approved` = min(qty dari form, qty_requested)
       - Update status → `Approved`; simpan `approver_id`, `approved_at`
       - Kirim `OutboundStatusUpdatedNotification` ke pemohon (DB + WA)
       - Kirim `OutboundReadyForIssueNotification` ke semua `warehouse_admin` (DB + WA)
  6. **Jika Tolak:**
     - Input alasan penolakan (wajib, divalidasi `RejectOutboundRequest`)
     - Klik "Tolak" → Gate `reject` divalidasi
     - `OutboundService::rejectRequest()`:
       - Validasi status harus `Pending` atau `Approved`
       - Update status → `Rejected`; simpan `rejection_reason`, `approved_at`
       - Kirim `OutboundStatusUpdatedNotification` ke pemohon (DB + WA)
  7. Redirect ke daftar pengajuan dengan flash sukses

### Task 2.12 — AD-12: Membuat Permintaan Langsung
- [ ] **Swimlane:** Admin Gudang | Sistem SIMPATIK
- [ ] **Alur Real (berdasarkan `OutboundService::createDirectRequest()`):**
  1. Admin Gudang masuk menu "Permintaan Langsung" (route terpisah, hanya `warehouse_admin`)
  2. Sistem tampilkan form khusus + daftar semua user (sebagai pemohon) + daftar item
  3. Input: pilih pemohon (user manapun), departemen, tanggal, detail barang (item + qty)
  4. Submit → validasi via `StoreDirectOutboundRequest`
  5. `OutboundService::createDirectRequest()` dalam **DB Transaction:**
     - Generate nomor dokumen
     - Buat `OutboundTransaction` dengan status langsung `Issued`; flag `is_direct_request = true`; `issued_by = adminId`, `issued_at = now()`
     - Per detail:
       - Simpan `OutboundDetail` (`qty_approved = qty_requested`)
       - **`lockForUpdate()`** item (pessimistic lock)
       - Validasi: jika `current_stock < qty` → abort 422 (stok tidak mencukupi)
       - Kurangi `current_stock` item
       - Catat `StockLedger` (movement_type: `out`)
     - **Tidak ada notifikasi yang dikirim**
  6. Redirect ke halaman detail transaksi baru

### Task 2.13 — AD-13: Menyetujui Permintaan Barang
- [ ] **Swimlane:** Admin Gudang | Sistem SIMPATIK
- [ ] **Alur Real (berdasarkan `OutboundService::issueItems()`):**
  1. Admin Gudang masuk menu Pengajuan → filter status `Approved`
  2. Pilih transaksi → review detail (qty yang disetujui Penyelia)
  3. (Opsional) Sesuaikan `qty_final` yang akan dikeluarkan (tidak boleh melebihi `qty_approved` Penyelia)
  4. Klik "Keluarkan Barang" → Gate `issue` divalidasi
  5. `OutboundService::issueItems()` dalam **DB Transaction:**
     - Validasi status harus `Approved`
     - Per detail:
       - `qty_out = min(qty dari form, qty_approved penyelia)` (tidak boleh melebihi approval)
       - Update `qty_approved` jika berbeda
       - **`lockForUpdate()`** item
       - Validasi stok mencukupi → jika tidak → abort 422
       - Kurangi `current_stock` item
       - Catat `StockLedger` (movement_type: `out`)
       - Cek: jika `current_stock ≤ minimum_stock_level` → kirim `LowStockAlertNotification` ke semua `warehouse_admin` (DB + WA)
     - Update status transaksi → `Issued`; simpan `issued_by`, `issued_at`
     - Kirim `OutboundStatusUpdatedNotification` ke pemohon (DB + WA)
  6. Redirect ke halaman detail transaksi dengan flash sukses

### Task 2.14 — AD-14: Melihat Data Barang
- [ ] **Swimlane:** Admin Gudang | Sistem SIMPATIK
- [ ] **Alur Real (berdasarkan `ItemController@index`, permission `view-items`):**
  1. Admin Gudang masuk menu Data Barang
  2. Sistem query semua item via `ItemService::getItems()` dengan dukungan filter
  3. (Opsional) Tentukan filter: teks pencarian (nama/kode), kategori, atau flag `low_stock` (hanya tampilkan item di bawah batas minimum)
  4. Sistem juga ambil daftar kategori untuk dropdown filter
  5. Tampilkan daftar barang ter-filter + ter-paginasi: nama, kode, kategori, satuan, `current_stock`, `minimum_stock_level`, status (stok rendah / normal)
  6. (Opsional) Klik baris barang → lihat detail (Admin Gudang hanya bisa lihat, tidak bisa edit — permission `view-items` bukan `manage-items`)

---

## Tahap 3: Validasi & Finalisasi Dokumen

### Task 3.1 — Validasi Konsistensi
- [ ] Pastikan setiap aktor dalam setiap Activity Diagram sesuai dengan `laporan_use_case.md` (permission dari `UserRole.php`).
- [ ] Pastikan status transaksi menggunakan nilai dari `OutboundStatus` enum yang nyata.
- [ ] Pastikan notifikasi yang digambarkan sesuai dengan 4 class Notification yang ada.
- [ ] Pastikan seluruh kode Mermaid dapat di-render tanpa error.

### Task 3.2 — Overwrite File
- [ ] Tulis ulang keseluruhan isi file `laporan_activity_diagram.md` dengan 14 diagram yang sudah selesai.
- [ ] Struktur dokumen: Pendahuluan → 14 AD (AD-01 s/d AD-14) → Penjelasan Notasi.

### Task 3.3 — Selesai
- [ ] Tandai track ini sebagai ✅ Completed di `conductor/tracks.md`.
