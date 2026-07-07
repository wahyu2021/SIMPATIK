# Laporan Sequence Diagram — SIMPATIK

> **Sistem Manajemen Persediaan ATK**
> PT. Bank Pembangunan Daerah Sumatera Selatan dan Bangka Belitung
> Cabang Utama Kapten A. Rivai, Palembang

---

## 1. Pendahuluan

Sequence Diagram memodelkan urutan pemanggilan *method* dari satu komponen ke komponen lain pada arsitektur perangkat lunak. Pada sistem **SIMPATIK**, Sequence Diagram ini disusun berdasarkan arsitektur riil proyek yang menggunakan **Inertia.js (React)** sebagai *View*, **Laravel Controllers**, **Services**, dan **Eloquent Models**.

---

## 2. Sequence Diagram per Fitur Utama

### SD-01 — Login
Proses autentikasi dasar untuk membedakan hak akses (*role*) setiap aktor setelah berhasil login.

```mermaid
sequenceDiagram
    actor U as Pengguna
    participant V as View (Inertia React)
    participant C as LoginController
    participant M as User Model

    U->>V: Input Email & Password, Klik "Login"
    V->>C: store(Request)
    
    C->>C: Auth::attempt()
    alt Jika Kredensial Tidak Valid
        C-->>V: Redirect back with error
        V-->>U: Tampilkan Pesan Error
    else Jika Kredensial Valid
        C->>C: session()->regenerate()
        C-->>V: Redirect ke Dashboard sesuai Role
        V-->>U: Tampilkan Halaman Dashboard
    end
```

---

### SD-02 — Mengelola Data Master
Proses pengelolaan data master oleh Bagian Umum, termasuk penandaan penghapusan sementara (*soft delete*).

```mermaid
sequenceDiagram
    actor BU as Bagian Umum
    participant V as View (Data Master)
    participant C as MasterController
    participant M as Model (Item/Category/Dept)

    BU->>V: Input Form / Klik Hapus
    V->>C: store() / update() / destroy()
    
    C->>C: Validasi Request
    
    alt Simpan/Ubah Data
        C->>M: create() / update()
    else Hapus Data
        C->>M: delete() (Soft Delete)
    end
    
    C-->>V: Redirect with success message
    V-->>BU: Tampilkan Pesan Sukses
```

---

### SD-03 — Menginput Barang Masuk
Proses pencatatan barang dari vendor, dengan kewajiban melampirkan bukti transaksi (Nota).

```mermaid
sequenceDiagram
    actor AG as Admin Gudang
    participant V as View (Inbound Form)
    participant C as InboundController
    participant S as InboundService
    participant DB as Database (Item & Ledger)

    AG->>V: Input Data & Upload Nota Wajib
    V->>C: store(Request)
    
    C->>C: Validasi Form & File Nota
    C->>S: createTransaction(data)
    
    S->>DB: Simpan Transaksi Inbound
    S->>DB: Tambah current_stock pada Item
    S->>DB: Catat riwayat di StockLedger
    
    S-->>C: success
    C-->>V: Redirect with success message
    V-->>AG: Tampilkan Notifikasi Sukses
```

---

### SD-04 — Mengelola Pengguna
Proses pengelolaan akun pengguna. Penghapusan akan dicegah jika pengguna sudah memiliki riwayat transaksi.

```mermaid
sequenceDiagram
    actor BU as Bagian Umum
    participant V as View (User Management)
    participant C as UserController
    participant M as User Model

    BU->>V: Pilih Aksi CRUD Pengguna
    V->>C: store() / update() / destroy()
    
    alt Jika Perintah Hapus (destroy)
        C->>M: Cek Relasi Transaksi
        alt Ada Relasi
            C-->>V: Tolak Hapus, Sarankan Nonaktif
            V-->>BU: Tampilkan Pesan Peringatan
        else Tidak Ada Relasi
            C->>M: delete()
            C-->>V: Redirect success
        end
    else Jika Simpan/Ubah
        C->>M: create() / update()
        C-->>V: Redirect success
    end
```

---

### SD-05 — Melihat Audit Trail Digital
Proses melihat log aktivitas beserta detail perubahan data sebelum dan sesudahnya.

```mermaid
sequenceDiagram
    actor BU as Bagian Umum
    participant V as View (Audit Trail)
    participant C as AuditController
    participant M as ActivityLog Model

    BU->>V: Buka Menu Audit Trail
    V->>C: index(filters)
    
    C->>M: Ambil Data Log (Before & After)
    M-->>C: Data Log Aktivitas
    
    C-->>V: Render Halaman beserta Data
    V-->>BU: Tampilkan Daftar Log
```

---

### SD-06 — Mengelola Pengaturan Sistem
Proses menyimpan konfigurasi dasar yang menampilkan nilai pengaturan saat ini.

```mermaid
sequenceDiagram
    actor BU as Bagian Umum
    participant V as View (Settings Form)
    participant C as SettingController
    participant M as Setting Model

    BU->>V: Ubah Nilai Konfigurasi
    V->>C: update(Request)
    
    C->>C: Validasi Input
    C->>M: update() Data Pengaturan
    
    C-->>V: Redirect success message
    V-->>BU: Konfigurasi Berhasil Disimpan
```

---

### SD-07 — Melihat Laporan & Rekonsiliasi
Proses membuat laporan umum dan melakukan input rekonsiliasi stok fisik versus sistem.

```mermaid
sequenceDiagram
    actor AG as Admin Gudang
    participant V as View (Report)
    participant C as ReportController
    participant DB as Database

    AG->>V: Pilih Laporan atau Rekonsiliasi
    
    alt Unduh Laporan
        V->>C: exportReport()
        C->>C: Generate PDF / Excel
        C-->>V: File Download Stream
    else Proses Rekonsiliasi
        V->>C: storeReconciliation(qty_fisik)
        C->>C: Hitung qty_diff = qty_fisik - qty_sistem
        C->>DB: Simpan Laporan Rekonsiliasi
        C->>DB: Buat Mutasi Penyesuaian (Adjustment) jika qty_diff != 0
        C-->>V: Redirect success
    end
```

---

### SD-08 — Mengajukan Permintaan Barang
Permintaan barang dari Staff (butuh persetujuan) berbeda dengan Penyelia (otomatis disetujui).

```mermaid
sequenceDiagram
    actor U as Pemohon (Staff / Penyelia)
    participant V as View (Request Form)
    participant C as OutboundController
    participant M as Outbound Model

    U->>V: Input Detail Permintaan Barang
    V->>C: store(Request)
    
    C->>C: Identifikasi Pemohon
    alt Jika Pemohon = Staff
        C->>M: create(status: 'PENDING')
        C->>C: Kirim Notifikasi ke Penyelia
    else Jika Pemohon = Penyelia
        C->>M: create(status: 'APPROVED')
        C->>C: Kirim Notifikasi ke Admin Gudang
    end
    
    C-->>V: Redirect success message
    V-->>U: Pengajuan Berhasil Terkirim
```

---

### SD-09 — Mengonfirmasi Serah Terima Barang
Proses dua arah: Admin Gudang menyerahkan, kemudian Pemohon mengonfirmasi penerimaan secara fisik.

```mermaid
sequenceDiagram
    actor AG as Admin Gudang
    participant V as View
    participant C as OutboundController
    participant M as Outbound Model
    actor P as Pemohon

    %% Tahap 1: Penyerahan
    AG->>V: Klik "Serahkan Barang"
    V->>C: handover(id)
    C->>M: update(status: 'HANDED_OVER')
    C->>C: Kirim Notifikasi ke Pemohon
    
    %% Tahap 2: Konfirmasi
    P->>V: Klik "Konfirmasi Terima"
    V->>C: complete(id)
    C->>M: update(status: 'COMPLETED')
    C-->>V: Transaksi Selesai
```

---

### SD-10 — Cetak Dokumen Transaksi
SPB dapat dicetak di awal, tetapi BAST baru bisa dicetak setelah serah terima selesai.

```mermaid
sequenceDiagram
    actor U as Pengguna
    participant V as View
    participant C as DocumentController
    participant PDF as DomPDF

    U->>V: Pilih Cetak Dokumen
    
    alt Cetak SPB
        V->>C: printSPB(id)
        C->>PDF: Generate SPB
        C-->>V: Download SPB PDF
    else Cetak BAST
        V->>C: printBAST(id)
        C->>C: Cek Status (Harus HandedOver/Completed)
        alt Status Valid
            C->>PDF: Generate BAST
            C-->>V: Download BAST PDF
        else Status Belum Valid
            C-->>V: Tolak Cetak BAST
        end
    end
```

---

### SD-11 — Verifikasi Permintaan Barang
Penyelia melakukan peninjauan terhadap pengajuan dari Staff. Bisa sesuaikan jumlah atau menolak dengan alasan.

```mermaid
sequenceDiagram
    actor KD as Penyelia
    participant V as View (Approval Page)
    participant C as ApprovalController
    participant M as Outbound Model

    KD->>V: Review Detail Pengajuan (Pending)
    V->>C: processApproval(Request)
    
    alt Setujui
        C->>C: Sesuaikan qty_approved (Opsional)
        C->>M: update(status: 'APPROVED')
    else Tolak
        C->>C: Catat Alasan Penolakan (Wajib)
        C->>M: update(status: 'REJECTED')
    end
    
    C-->>V: Redirect success message
    V-->>KD: Keputusan Telah Disimpan
```

---

### SD-12 — Membuat Permintaan Langsung
Admin gudang mengeluarkan barang tanpa melalui alur verifikasi penyelia (potong stok langsung).

```mermaid
sequenceDiagram
    actor AG as Admin Gudang
    participant V as View (Direct Request)
    participant C as OutboundController
    participant DB as Database (Item & Ledger)

    AG->>V: Input Form Permintaan Langsung
    V->>C: storeDirect(Request)
    
    C->>DB: Cek Stok Aktual (current_stock)
    
    alt Stok Tidak Cukup
        C-->>V: Error Stok Tidak Mencukupi
        V-->>AG: Tampilkan Pesan Error
    else Stok Cukup
        C->>DB: Simpan Outbound status 'ISSUED'
        C->>DB: Potong Stok Aktual
        C->>DB: Catat di StockLedger
        C-->>V: Redirect success
    end
```

---

### SD-13 — Menyetujui Permintaan Barang
Tindakan Admin Gudang untuk benar-benar mengeluarkan stok dari pengajuan yang sudah disetujui (*Approved*).

```mermaid
sequenceDiagram
    actor AG as Admin Gudang
    participant V as View (Preparation)
    participant C as OutboundController
    participant DB as Database (Item & Ledger)

    AG->>V: Proses Penyiapan Barang (Approved)
    V->>C: issueItems(id)
    
    C->>DB: Verifikasi Ketersediaan Stok Fisik
    
    alt Stok Tidak Cukup
        C-->>V: Error Stok Habis
        V-->>AG: Tampilkan Pesan Error
    else Stok Cukup
        C->>DB: Potong Stok (current_stock)
        C->>DB: Update Outbound status 'ISSUED'
        C->>DB: Catat Mutasi StockLedger
        C-->>V: Redirect success
    end
```

---

### SD-14 — Melihat Data Barang
Pemantauan data stok oleh Admin Gudang dengan ketersediaan fitur filter khusus peringatan stok minim.

```mermaid
sequenceDiagram
    actor AG as Admin Gudang
    participant V as View (Item List)
    participant C as ItemController
    participant M as Item Model

    AG->>V: Akses Menu Barang / Terapkan Filter
    V->>C: index(filters)
    
    C->>M: Kueri Daftar Barang & Cek Stok Kritis
    M-->>C: Hasil Kueri Barang
    
    C-->>V: Render Inertia View (Data Barang)
    V-->>AG: Tampilkan Daftar & Notifikasi Stok Minim
```

---

## 3. Penutup
Keseluruhan 14 urutan interaksi sistem di atas merepresentasikan bentuk penyederhanaan dari kompleksitas sistem **SIMPATIK** di lapangan, yang difokuskan pada kejelasan aliran instruksi dari aksi Pengguna ke lapisan presentasi (*View*), ke pengendali (*Controller*), dan akhirnya berlabuh pada basis data (*Model/Database*).
