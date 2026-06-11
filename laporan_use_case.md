# 1. Analisis Use Case Sistem SIMPATIK (Berdasarkan Kode Sumber)

Use Case Diagram ini disusun berdasarkan hasil riset mendalam terhadap *business logic* di dalam kode sumber SIMPATIK, khususnya pada `OutboundService`, `UserRole`, dan sistem status transaksi.

## 1.1 Identifikasi Aktor & Kewenangan Real

Berdasarkan implementasi di `App\Enums\UserRole.php`, berikut adalah kewenangan aktor yang sebenarnya:

| Aktor | Peran Teknis dalam Kode |
| :--- | :--- |
| **Admin Gudang** | Memiliki akses penuh. Fitur unik: **Direct Request** (bypass approval), **Input Inbound**, **Approve/Reject** pengajuan, **Issue Items** (potong stok), **Handover Items**, **Kelola User**, **Kelola Settings**, dan **Lihat Audit Log**. |
| **Penyelia (Division Head)** | Melakukan **Approval/Rejection** terhadap pengajuan staf di unit kerjanya saja. |
| **Staff Unit Kerja** | Melakukan **Request Outbound**, **Edit/Batalkan Pengajuan** (saat Pending), dan **Pickup Confirmation** (Dual Confirmation). |
| **Bagian Umum (GA)** | Memiliki hak akses baca (**View Reports**, **Export Reports**, **View All Requests**) untuk monitoring. |

## 1.2 Use Case Diagram

Diagram ini mencerminkan alur *State Machine* dari transaksi barang yang ada di `OutboundStatus.php`:

```mermaid
flowchart LR
    %% Definisi Aktor
    Admin(["🧑‍💼 Admin Gudang"])
    Penyelia(["👨‍⚖️ Penyelia (Division Head)"])
    Staff(["👤 Staff Unit Kerja"])
    GA(["🧐 Bagian Umum (GA)"])

    subgraph SIMPATIK [Sistem Manajemen Persediaan Terpadu]
        direction TB

        %% Modul Administrasi & Manajemen
        UC_Master((Kelola Data Master\nBarang, Kategori, Unit))
        UC_UserMgmt((Kelola User\n& Hak Akses))
        UC_Settings((Kelola Settings\nKonfigurasi Aplikasi))
        UC_Inbound((Kelola Inbound\nBarang Masuk))

        %% Siklus Outbound (Berdasarkan OutboundService)
        UC_Request((Buat Pengajuan Barang\nStatus: Pending))
        UC_Edit((Edit/Batalkan Pengajuan\nHanya saat Pending))
        UC_Direct((Direct Request\nBypass Approval))
        UC_Approve((Verifikasi Penyelia\nApprove/Reject))
        UC_Issue((Proses Gudang\nIssue & Potong Stok))
        UC_Handover((Handover Barang\nAdmin Serahkan))
        UC_Pickup((Konfirmasi Penerimaan\nStaff Ambil Barang))

        %% Modul Dokumen
        UC_SPB((Cetak SPB\nSurat Permintaan Barang))
        UC_BAST((Cetak BAST\nBerita Acara Serah Terima))

        %% Modul Analitik & Laporan
        UC_Report((Laporan & Mutasi))
        UC_Rekon((Rekonsiliasi Bulanan\nStock Opname))
        UC_Forecast((Forecasting Kebutuhan\n— Terencana —))
        UC_Audit((Log Audit Trail))

        %% Modul Pendukung
        UC_Notif((Notifikasi\nWeb & WhatsApp))
        UC_Profile((Kelola Profil\n& Tanda Tangan))
    end

    %% Interaksi Staff
    Staff --- UC_Request
    Staff --- UC_Edit
    Staff --- UC_Pickup
    Staff --- UC_SPB
    Staff --- UC_Profile
    Staff --- UC_Notif

    %% Interaksi Penyelia
    Penyelia --- UC_Approve
    Penyelia --- UC_Notif
    Penyelia --- UC_Profile

    %% Interaksi GA
    GA --- UC_Report
    GA --- UC_Profile

    %% Interaksi Admin (Akses Terluas)
    Admin --- UC_Master
    Admin --- UC_UserMgmt
    Admin --- UC_Settings
    Admin --- UC_Inbound
    Admin --- UC_Direct
    Admin --- UC_Approve
    Admin --- UC_Issue
    Admin --- UC_Handover
    Admin --- UC_Report
    Admin --- UC_Rekon
    Admin --- UC_Forecast
    Admin --- UC_Audit
    Admin --- UC_SPB
    Admin --- UC_BAST
    Admin --- UC_Notif
    Admin --- UC_Profile

    %% Hubungan Logika (Includes/Extends)
    UC_Approve -.-> |include| UC_Request
    UC_Issue -.-> |include| UC_Approve
    UC_Handover -.-> |include| UC_Issue
    UC_Pickup -.-> |include| UC_Handover
    UC_BAST -.-> |extend| UC_Handover
    UC_SPB -.-> |extend| UC_Request
    UC_Edit -.-> |extend| UC_Request
```

## 1.3 Deskripsi Skenario Utama

Berikut adalah penjelasan fungsi berdasarkan logika program (`OutboundService.php`, `OutboundController.php`, `ReportController.php`, dll):

### 1.3.1 Siklus Outbound (Inti)

| Use Case | Penjelasan Berdasarkan Kode |
| :--- | :--- |
| **Buat Pengajuan** | Staff membuat `OutboundTransaction` dengan status awal *Pending*. Sistem mengirim notifikasi WhatsApp dan Web ke Penyelia di unit kerja yang sama. |
| **Edit/Batalkan Pengajuan** | Pemilik pengajuan dapat mengedit detail atau membatalkan (soft delete) pengajuan selama status masih *Pending*. |
| **Direct Request** | Fitur khusus Admin Gudang untuk mengeluarkan barang secara instan. Sistem langsung mengubah status menjadi *Issued* dan memotong stok tanpa perlu persetujuan Penyelia. |
| **Approve/Reject** | Penyelia memverifikasi permintaan dari unit kerjanya. Jika disetujui, jumlah barang yang disetujui dicatat (`quantity_approved`). Admin Gudang juga dapat menolak pengajuan dari status *Pending* maupun *Approved*. |
| **Issue & Potong Stok** | Admin Gudang memproses pengeluaran barang. Sistem melakukan *pessimistic locking* pada tabel barang dan mengurangi stok fisik di database. Jika stok di bawah threshold, notifikasi *Low Stock Alert* dikirim otomatis. |
| **Handover & Pickup** | **Dual Confirmation**: Admin menandai barang telah diserahkan (`HandedOver`), lalu Staff harus mengonfirmasi penerimaan (`Completed`) agar siklus transaksi selesai. |

### 1.3.2 Modul Dokumen

| Use Case | Penjelasan Berdasarkan Kode |
| :--- | :--- |
| **Cetak SPB** | Generate PDF *Surat Permintaan Barang* lengkap dengan QR Code yang mengarah ke detail pengajuan. |
| **Cetak BAST** | Generate PDF *Berita Acara Serah Terima* setelah barang diserahkan. Tersedia setelah status *HandedOver* atau *Completed*. |

### 1.3.3 Modul Analitik & Laporan

| Use Case | Penjelasan Berdasarkan Kode |
| :--- | :--- |
| **Laporan & Mutasi** | Rekapitulasi mutasi stok bulanan, kartu stok (stock ledger), dan laporan penggunaan per unit kerja. Dapat diekspor ke **PDF** dan **Excel**. |
| **Rekonsiliasi Bulanan** | Stock opname: membandingkan stok sistem vs stok fisik dan menyimpan catatan selisih per item. |
| **Forecasting** | *(Terencana)* Menggunakan data historis dari *Stock Ledger* untuk memprediksi kebutuhan barang. Model `DemandForecast` dan permission `view-forecasting` sudah tersedia, menunggu implementasi controller dan service. |
| **Log Audit Trail** | Mencatat seluruh aktivitas pengguna (siapa, apa, kapan, perubahan apa) dengan diff properties. Hanya Admin Gudang yang dapat mengaksesnya. |

### 1.3.4 Modul Administrasi

| Use Case | Penjelasan Berdasarkan Kode |
| :--- | :--- |
| **Kelola Data Master** | CRUD untuk Barang (`ItemController`), Kategori (`CategoryController`), dan Unit Kerja (`DepartmentController`). |
| **Kelola Inbound** | Pencatatan barang masuk oleh Admin Gudang. Stok otomatis bertambah saat disimpan dan rollback saat dihapus. |
| **Kelola User** | Admin Gudang mengelola akun pengguna: CRUD dan toggle aktif/nonaktif. |
| **Kelola Settings** | Konfigurasi aplikasi termasuk endpoint API untuk integrasi ML/Forecasting. |
| **Notifikasi** | Dual-channel: Web (database) dan WhatsApp Gateway. Meliputi notifikasi pengajuan baru, perubahan status, barang siap diambil, dan alert stok rendah. |
| **Kelola Profil & Tanda Tangan** | Setiap user wajib memiliki tanda tangan digital (*signature onboarding*) sebelum mengakses fitur utama. Profil dan password juga dapat diubah. |

## 1.4 State Machine: Alur Status Pengajuan

```mermaid
stateDiagram-v2
    [*] --> Pending : Staff buat pengajuan
    Pending --> Approved : Penyelia approve
    Pending --> Rejected : Penyelia/Admin reject
    Pending --> Pending : Staff edit pengajuan
    Pending --> [*] : Staff batalkan (soft delete)
    Approved --> Issued : Admin issue & potong stok
    Approved --> Rejected : Admin reject
    Issued --> HandedOver : Admin serahkan barang
    HandedOver --> Completed : Staff konfirmasi terima
    Completed --> [*]
    Rejected --> [*]

    note right of Pending
        Direct Request (Admin):
        Langsung ke Issued,
        bypass Approved
    end note
```

---

**Validasi terhadap Kode:**
- Aktor **Division Head** divalidasi melalui `UserRole::DIVISION_HEAD`.
- Alur **Pending → Approved → Issued → HandedOver → Completed** divalidasi melalui `OutboundStatus.php`.
- Fitur **Direct Request** divalidasi melalui function `createDirectRequest` di `OutboundService.php`.
- Fitur **Reject dari Approved** divalidasi melalui function `rejectRequest` di `OutboundService.php`.
- Fitur **Dual Confirmation** divalidasi melalui `handoverItems` dan `pickupItems` di `OutboundService.php` serta `OutboundPolicy.php`.
- Fitur **SPB/BAST PDF** divalidasi melalui `downloadSpb` dan `downloadBast` di `OutboundController.php`.
- Fitur **Rekonsiliasi** divalidasi melalui `reconciliation` dan `storeReconciliation` di `ReportController.php`.
- Fitur **Audit Trail** divalidasi melalui `ActivityLogController.php` dan model `ActivityLog.php`.
- Fitur **Notifikasi WhatsApp** divalidasi melalui `WhatsAppChannel.php` dan 4 class Notification.
- Fitur **Signature Onboarding** divalidasi melalui middleware `signature` dan `SignatureController.php`.
