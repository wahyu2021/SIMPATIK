# Laporan Activity Diagram — SIMPATIK

> **Sistem Manajemen Persediaan ATK**
> PT. Bank Pembangunan Daerah Sumatera Selatan dan Bangka Belitung
> Cabang Utama Kapten A. Rivai, Palembang

---

## 1. Pendahuluan

Activity Diagram merupakan diagram perilaku dalam Unified Modeling Language (UML) yang menggambarkan alur kerja (*workflow*) atau aktivitas berurutan dari sebuah sistem. Diagram ini digunakan untuk memodelkan logika bisnis dan urutan operasional dari awal hingga akhir, termasuk percabangan logika (keputusan) dan pengelompokan tanggung jawab antar aktor menggunakan *swimlanes*.

Pada sistem **SIMPATIK**, setiap *Use Case* yang terdefinisi dalam Diagram Use Case direpresentasikan oleh satu *Activity Diagram* tersendiri (relasi **1 Use Case : 1 Activity Diagram**). Seluruh alur yang digambarkan telah diverifikasi terhadap implementasi nyata pada *source code* sistem, mencakup `OutboundService`, `InboundService`, `UserService`, `ReportService`, semua *Controller*, *Enum* `OutboundStatus`, dan semua kelas *Notification*.

---

## 2. Activity Diagram per Use Case

### AD-01 — Login
Proses autentikasi yang wajib dilalui oleh **seluruh aktor** (Bagian Umum, Admin Gudang, Staff, Penyelia) sebelum dapat mengakses fitur apapun di dalam sistem SIMPATIK. Alur mencakup validasi kredensial via `LoginRequest`, pengecekan status akun aktif, regenerasi sesi (mencegah *session fixation*), lalu langsung *redirect* ke *dashboard* sesuai role.

```mermaid
flowchart TD
    Start([Mulai])
    End([Selesai])

    subgraph Pengguna [Pengguna]
        A(Buka Halaman Login)
        B(Input Email dan Password)
        C(Klik Tombol Login)
    end

    subgraph Sistem [Sistem SIMPATIK]
        D{Validasi Kredensial?}
        E(Tampilkan Pesan Error Kredensial Salah)
        F{Akun Aktif?}
        G(Tampilkan Pesan Error Akun Dinonaktifkan)
        H(Regenerasi Session ID)
        I(Redirect ke Dashboard Sesuai Role + Flash Selamat Datang)
    end

    Start --> A
    A --> B
    B --> C
    C --> D

    D -- Salah --> E
    E --> B

    D -- Benar --> F
    F -- Tidak Aktif --> G
    G --> B

    F -- Aktif --> H
    H --> I
    I --> End
```

---

### AD-02 — Mengelola Data Master
Proses CRUD (*Create, Read, Update, Delete*) yang dilakukan oleh **Bagian Umum** untuk menjaga akurasi data referensi sistem. Mencakup tiga sub-modul: **Barang** (`ItemController`), **Kategori** (`CategoryController`), dan **Unit Kerja** (`DepartmentController`). Semua operasi hapus menggunakan *soft delete* — data tidak benar-benar dihapus dari *database*.

```mermaid
flowchart TD
    Start([Mulai])
    End([Selesai])

    subgraph BagianUmum [Bagian Umum]
        A(Masuk Menu Data Master)
        B(Pilih Sub-Modul: Barang / Kategori / Unit Kerja)
        C{Pilih Aksi}
        D(Isi Form Data Baru)
        E(Ubah Data pada Form)
        F(Konfirmasi Penghapusan)
        G(Submit Form)
    end

    subgraph Sistem [Sistem SIMPATIK]
        H(Tampilkan Daftar Data dengan Filter & Paginasi)
        I{Validasi Form?}
        J(Tampilkan Pesan Error Validasi)
        K(Simpan Record Baru ke Database)
        L(Perbarui Record di Database)
        M(Soft Delete: Tandai deleted_at di Database)
        N(Catat Perubahan ke Activity Log)
        O(Tampilkan Flash Message Sukses)
        P(Redirect ke Halaman Daftar)
    end

    Start --> A
    A --> H
    H --> B
    B --> C

    C -- Tambah --> D
    C -- Edit --> E
    D --> G
    E --> G

    G --> I
    I -- Gagal --> J
    J --> D

    I -- Lolos --> K
    K --> N

    C -- Hapus --> F
    F --> M
    M --> N

    N --> O
    O --> P
    P --> End
```

---

### AD-03 — Menginput Barang Masuk
Proses pencatatan penerimaan stok ATK dari vendor yang dilakukan oleh **Bagian Umum**. Upload bukti transaksi (nota/faktur/surat jalan) bersifat **wajib** — transaksi tidak dapat disimpan tanpa lampiran dokumen fisik (format: JPG/PNG/PDF, maks 2MB). Saat transaksi berhasil disimpan, sistem menambah stok aktual dan mencatat mutasi ke *Stock Ledger* dalam satu *database transaction* dengan *pessimistic locking*.

```mermaid
flowchart TD
    Start([Mulai])
    End([Selesai])

    subgraph BagianUmum [Bagian Umum]
        A(Masuk Menu Barang Masuk)
        B(Klik Buat Transaksi Baru)
        C(Input Nomor Referensi, Tanggal, Catatan)
        D(Tambah Detail: Pilih Barang dan Kuantitas)
        E(Upload Bukti Transaksi: Nota / Faktur / Surat Jalan - WAJIB)
        F(Submit Transaksi)
    end

    subgraph Sistem [Sistem SIMPATIK]
        G(Tampilkan Form + Generate Nomor Referensi Berikutnya)
        H{Validasi Data & File?}
        I(Tampilkan Pesan Error: Data tidak lengkap atau Format File Salah)
        J(Mulai DB Transaction)
        K(Generate Nomor Referensi jika Kosong)
        L(Upload File Bukti ke Storage public/inbound-receipts)
        M(Simpan Record InboundTransaction dengan receipt_image_path)
        N(Simpan InboundDetail per Item)
        O(lockForUpdate Item di Database)
        P(Tambah current_stock += Kuantitas)
        Q(Catat StockLedger: movement_type = in)
        R{Masih Ada Item Lain?}
        S(Commit DB Transaction)
        T(Redirect ke Daftar Barang Masuk + Flash Sukses)
    end

    Start --> A
    A --> B
    B --> G
    G --> C
    C --> D
    D --> E
    E --> F
    F --> H

    H -- Gagal: Data kurang atau File tidak valid --> I
    I --> C

    H -- Lolos --> J
    J --> K
    K --> L
    L --> M
    M --> N
    N --> O
    O --> P
    P --> Q
    Q --> R

    R -- Ya --> N
    R -- Tidak --> S
    S --> T
    T --> End
```

---

### AD-04 — Mengelola Pengguna
Proses manajemen akun pengguna sistem yang dilakukan oleh **Bagian Umum**. Mencakup operasi CRUD, toggle status aktif/nonaktif, dan impor massal dari file Excel/CSV. Setiap perubahan role akan otomatis menyinkronkan permission via Spatie Permission sesuai definisi di `UserRole` enum.

```mermaid
flowchart TD
    Start([Mulai])
    End([Selesai])

    subgraph BagianUmum [Bagian Umum]
        A(Masuk Menu Manajemen Pengguna)
        B(Tentukan Filter: Pencarian, Departemen, Role, Status)
        C{Pilih Aksi}
        D(Isi Form: Nama, Email, Password, Departemen, Role, Status)
        E(Ubah Data Pengguna pada Form)
        F(Konfirmasi Penghapusan)
        G(Klik Toggle Status Aktif)
        H(Upload File Excel / CSV)
        I(Submit)
    end

    subgraph Sistem [Sistem SIMPATIK]
        J(Tampilkan Daftar User dengan Filter & Paginasi)
        K{Validasi Form?}
        L(Tampilkan Pesan Error)
        M(Buat Record User Baru di Database)
        N{Role Berubah?}
        O(syncRoles + syncPermissions via Spatie Permission)
        P(Perbarui Data User di Database)
        Q{User Punya Relasi Transaksi?}
        R(Abort 422: Sarankan Nonaktifkan Saja)
        S(Soft Delete User)
        T(Toggle Nilai is_active true atau false)
        U(Jalankan UsersImport via Maatwebska Excel)
        V{Import Berhasil?}
        W(Flash Error: Data Duplikat atau Format Salah)
        X(Flash Sukses: Jumlah User Diimpor)
        Y(Catat Activity Log)
        Z(Flash Message + Redirect)
    end

    Start --> A
    A --> J
    J --> B
    B --> C

    C -- Tambah --> D --> I
    C -- Edit --> E --> I
    I --> K
    K -- Gagal --> L --> D
    K -- Lolos --> M
    M --> O
    E --> N
    N -- Ya --> O
    N -- Tidak --> P
    O --> P --> Y

    C -- Hapus --> F
    F --> Q
    Q -- Ada --> R --> End
    Q -- Tidak Ada --> S --> Y

    C -- Toggle Status --> G
    G --> T --> Y

    C -- Import --> H
    H --> U
    U --> V
    V -- Gagal --> W --> Z
    V -- Berhasil --> X --> Z

    Y --> Z
    Z --> End
```

---

### AD-05 — Melihat Audit Trail Digital
Proses membaca log aktivitas seluruh pengguna di dalam sistem yang hanya dapat diakses oleh **Bagian Umum**. Setiap aksi yang tercatat mencakup informasi: siapa yang melakukan, aksi apa, kapan, di modul mana, serta data `properties` yang berisi *diff* data sebelum dan sesudah perubahan.

```mermaid
flowchart TD
    Start([Mulai])
    End([Selesai])

    subgraph BagianUmum [Bagian Umum]
        A(Masuk Menu Audit Trail)
        B(Tentukan Filter: Teks Pencarian dan atau Modul)
        C(Klik Baris Log untuk Melihat Detail - Opsional)
    end

    subgraph Sistem [Sistem SIMPATIK]
        D(Tampilkan Daftar Log + Dropdown Filter Modul)
        E(Query ActivityLog dengan Relasi User)
        F(Filter Berdasarkan: description, log_name, atau Nama User)
        G(Filter Berdasarkan log_name jika Modul Dipilih)
        H(Paginate 20 Record per Halaman)
        I(Tampilkan Tabel Log: Siapa, Aksi, Kapan, Modul)
        J(Query Detail Log beserta Properties)
        K(Tampilkan Diff Data: Sebelum dan Sesudah Perubahan)
    end

    Start --> A
    A --> D
    D --> B
    B --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> C
    C --> J
    J --> K
    K --> End
```

---

### AD-06 — Mengelola Pengaturan Sistem
Proses konfigurasi parameter aplikasi yang dilakukan oleh **Bagian Umum**. Data disimpan sebagai pasangan *key-value* di tabel `settings` menggunakan mekanisme `updateOrCreate` (*upsert*), sehingga tidak perlu membedakan antara tambah atau ubah — cukup satu operasi *submit*.

```mermaid
flowchart TD
    Start([Mulai])
    End([Selesai])

    subgraph BagianUmum [Bagian Umum]
        A(Masuk Menu Pengaturan Sistem)
        B(Ubah Nilai Konfigurasi pada Form)
        C(Submit Pengaturan)
    end

    subgraph Sistem [Sistem SIMPATIK]
        D(Query Semua Record Tabel settings)
        E(Transform ke Map: key => value)
        F(Tampilkan Form Pengaturan dengan Nilai Saat Ini)
        G{Validasi UpdateSettingRequest?}
        H(Tampilkan Pesan Error Validasi)
        I(Loop Setiap Pasangan Key-Value)
        J(updateOrCreate di Tabel settings Berdasarkan key)
        K(Flash Message Sukses)
        L(Redirect Kembali ke Halaman Pengaturan)
    end

    Start --> A
    A --> D
    D --> E
    E --> F
    F --> B
    B --> C
    C --> G

    G -- Gagal --> H
    H --> B

    G -- Lolos --> I
    I --> J
    J --> I
    I --> K
    K --> L
    L --> End
```

---

### AD-07 — Melihat Laporan & Rekonsiliasi
Proses pelaporan dan rekonsiliasi stok. **Bagian Umum** memiliki akses penuh termasuk ekspor (permission `export-reports`). **Admin Gudang** hanya dapat melihat laporan (permission `view-reports`) tanpa bisa mengekspor. Sub-alur rekonsiliasi mencakup: unduh *worksheet* Excel untuk penghitungan fisik di lapangan → input hasil ke sistem → *submit* → unduh Berita Acara PDF sebagai dokumen resmi.

```mermaid
flowchart TD
    Start([Mulai])
    End([Selesai])

    subgraph BagianUmum [Bagian Umum]
        A(Masuk Menu Laporan)
        B{Pilih Jenis Laporan}
        C(Pilih Periode: Bulan, Tahun dan Filter Opsional)
        D(Klik Generate Laporan)
        E(Klik Export PDF atau Excel)
        F(Unduh Worksheet Excel untuk Penghitungan Fisik - Opsional)
        G(Input Kuantitas Fisik per Item)
        H(Submit Rekonsiliasi)
        I(Unduh Berita Acara PDF - Opsional)
    end

    subgraph AdminGudang [Admin Gudang]
        A2(Masuk Menu Laporan)
        B2{Pilih Jenis Laporan}
        C2(Pilih Periode: Bulan, Tahun dan Filter Opsional)
        D2(Klik Generate Laporan)
    end

    subgraph Sistem [Sistem SIMPATIK]
        J(Query dan Agregasi Data: Saldo Awal + Masuk - Keluar)
        K(Tampilkan Preview Tabel Laporan)
        L(Generate File via DomPDF atau Maatwebska Excel)
        M(Stream atau Download File ke Browser)
        N(Cek: Rekonsiliasi Bulan Ini Sudah Ada?)
        O(Tampilkan Data Rekonsiliasi Selesai + Aktifkan Tombol Berita Acara)
        P(Generate Worksheet Excel Kosong: Nama Barang + Stok Sistem + Kolom Fisik Kosong)
        Q(Hitung Stok Sistem per Item, Tampilkan Form Input Fisik)
        R(Mulai DB Transaction)
        S(Simpan Header dan Detail Rekonsiliasi ke Database)
        T(Hitung Selisih: Fisik - Sistem per Item)
        U{Ada Selisih?}
        V(lockForUpdate Item)
        W(Update current_stock ke Kuantitas Fisik)
        X(Catat StockLedger: movement_type = adjustment)
        Y{Stok Hasil <= minimum_stock_level?}
        Z(Kirim LowStockAlertNotification ke Semua warehouse_admin: DB + WA)
        AA(Commit Transaction)
        AB(Flash Sukses + Redirect ke Halaman Rekonsiliasi)
        AC{Rekonsiliasi Sudah di-Submit?}
        AD(Generate Berita Acara PDF via DomPDF)
        AE(Stream File Berita-Acara-Rekonsiliasi.pdf ke Browser)
    end

    Start --> A
    A --> B

    B -- Mutasi Stok / Kartu Stok / Laporan Unit Kerja --> C
    C --> D
    D --> J
    J --> K
    K --> E
    E --> L
    L --> M
    M --> End

    B -- Rekonsiliasi --> N
    N -- Sudah Selesai --> O
    O --> I
    I --> AC
    AC -- Belum --> End
    AC -- Sudah --> AD
    AD --> AE
    AE --> End

    N -- Belum Ada --> F
    F --> P
    P --> End

    N -- Belum Ada --> Q
    Q --> G
    G --> H
    H --> R
    R --> S
    S --> T
    T --> U

    U -- Tidak --> AA
    U -- Ya --> V
    V --> W
    W --> X
    X --> Y
    Y -- Ya --> Z --> AA
    Y -- Tidak --> AA

    AA --> AB
    AB --> End

    Start --> A2
    A2 --> B2
    B2 -- Mutasi Stok / Kartu Stok --> C2
    C2 --> D2
    D2 --> J
```

---

### AD-08 — Mengajukan Permintaan Barang
Proses pembuatan pengajuan permintaan barang oleh **Staff** atau **Penyelia**. Terdapat logika khusus: jika pemohon adalah Penyelia, sistem secara otomatis menetapkan status `Approved` (*auto-approve*) dan langsung mengirim notifikasi ke Admin Gudang tanpa melewati tahap verifikasi. Jika pemohon adalah Staff biasa, status menjadi `Pending` dan notifikasi dikirim ke Penyelia di departemen yang sama.

```mermaid
flowchart TD
    Start([Mulai])
    End([Selesai])

    subgraph StaffPenyelia [Staff / Penyelia]
        A(Masuk Menu Permintaan Barang)
        B(Klik Buat Pengajuan Baru)
        C(Input Tanggal, Catatan, Detail Barang dan Kuantitas)
        D(Submit Pengajuan)
    end

    subgraph Sistem [Sistem SIMPATIK]
        E(Tampilkan Form + Generate Nomor Dokumen Berikutnya)
        F{Validasi StoreOutboundRequest?}
        G(Tampilkan Pesan Error Validasi)
        H(Mulai DB Transaction)
        I(Generate Nomor Dokumen jika Kosong)
        J{Role Pemohon?}
        K(Set Status: Approved)
        K2(Set approver_id = Pemohon, approved_at = Sekarang)
        K3(Set qty_approved = qty_requested)
        L(Set Status: Pending)
        L2(Set qty_approved = 0)
        M(Simpan OutboundTransaction ke Database)
        N(Simpan Semua OutboundDetail ke Database)
        O(Kirim OutboundReadyForIssueNotification ke Semua warehouse_admin: DB + WA)
        P(Kirim NewOutboundRequestNotification ke Semua division_head di Departemen: DB + WA)
        Q(Commit DB Transaction)
        R(Redirect ke Daftar Pengajuan + Flash Sukses)
    end

    Start --> A
    A --> B
    B --> E
    E --> C
    C --> D
    D --> F

    F -- Gagal --> G
    G --> C

    F -- Lolos --> H
    H --> I
    I --> J

    J -- Penyelia division_head --> K --> K2 --> K3 --> M
    J -- Staff --> L --> L2 --> M

    M --> N
    N --> O
    N --> P

    K3 --> M
    L2 --> M

    O --> Q
    P --> Q
    Q --> R
    R --> End
```

---

### AD-09 — Mengonfirmasi Serah Terima Barang
Proses penutupan siklus transaksi fisik yang melibatkan **Admin Gudang** (menyerahkan barang) dan **Staff/Penyelia** (mengkonfirmasi penerimaan). Dua langkah ini dilakukan secara berurutan: transaksi berstatus `HandedOver` setelah Admin Gudang menyerahkan, lalu berstatus `Completed` setelah pemohon mengkonfirmasi penerimaan. Pada setiap langkah, notifikasi dikirim via *database* dan WhatsApp.

```mermaid
flowchart TD
    Start([Mulai])
    End([Selesai])

    subgraph AdminGudang [Admin Gudang]
        A(Buka Detail Transaksi Berstatus Issued)
        B(Klik Serahkan Barang)
    end

    subgraph StaffPenyelia [Staff / Penyelia]
        F(Terima Notifikasi Barang Siap Diambil)
        G(Buka Detail Transaksi Berstatus HandedOver)
        H(Klik Konfirmasi Terima Barang)
    end

    subgraph Sistem [Sistem SIMPATIK]
        C{Validasi Gate handover?}
        D(Update Status: Issued -> HandedOver)
        D2(Simpan handed_over_by, handed_over_at)
        E(Kirim OutboundStatusUpdatedNotification ke Pemohon: DB + WA)
        I{Validasi Gate pickup?}
        J(Update Status: HandedOver -> Completed)
        J2(Simpan picked_up_by, picked_up_at)
        K(Kirim OutboundStatusUpdatedNotification ke Pemohon: DB + WA)
        L(Redirect + Flash Sukses)
        M(Siklus Transaksi Tertutup)
    end

    Start --> A
    A --> B
    B --> C

    C -- Tidak Diizinkan --> L
    C -- Diizinkan --> D
    D --> D2
    D2 --> E
    E --> F

    F --> G
    G --> H
    H --> I

    I -- Tidak Diizinkan --> L
    I -- Diizinkan --> J
    J --> J2
    J2 --> K
    K --> L
    L --> M
    M --> End
```

---

### AD-10 — Cetak Dokumen Transaksi
Proses generasi dan pengunduhan dokumen resmi berbasis PDF oleh **Staff** atau **Admin Gudang**. Terdapat dua jenis dokumen: **SPB** (Surat Permintaan Barang) yang bisa dicetak oleh keduanya kapan saja, dan **BAST** (Berita Acara Serah Terima) yang hanya bisa dicetak setelah barang benar-benar diserahkan (status `HandedOver` atau `Completed`). Setiap dokumen PDF dilengkapi dengan *QR Code* untuk validasi keaslian.

```mermaid
flowchart TD
    Start([Mulai])
    End([Selesai])

    subgraph Aktor [Staff / Admin Gudang]
        A(Buka Halaman Detail Transaksi)
        B{Pilih Dokumen}
        C(Klik Cetak SPB)
        D(Klik Cetak BAST)
    end

    subgraph Sistem [Sistem SIMPATIK]
        E(Load Transaksi + Semua Relasi dari Database)
        F(Ambil Data Signatory dari Tabel settings: Nama Instansi, Cabang, Alamat)
        G(Generate URL QR Code ke Halaman Detail Transaksi)
        H(Render PDF dari Blade View pdf.spb via DomPDF)
        I(Stream File SPB-nomor_dokumen.pdf ke Browser)
        J{Status Transaksi?}
        K(Abort 403: Dokumen Belum Dapat Dicetak)
        L(Render PDF dari Blade View pdf.bast via DomPDF)
        M(Stream File BAST-nomor_dokumen.pdf ke Browser)
    end

    Start --> A
    A --> B

    B -- SPB --> C
    C --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> End

    B -- BAST --> D
    D --> J

    J -- Pending / Approved / Issued --> K
    K --> End

    J -- HandedOver atau Completed --> L
    L --> M
    M --> End
```

---

### AD-11 — Verifikasi Permintaan Barang
Proses persetujuan atau penolakan pengajuan barang yang dilakukan oleh **Penyelia**. Penyelia hanya dapat melihat pengajuan dari unit kerjanya sendiri (*view-own-unit-requests*). Saat menyetujui, Penyelia dapat menyesuaikan kuantitas yang disetujui (tidak boleh melebihi yang diminta). Setelah disetujui, notifikasi dikirim ke pemohon sekaligus ke Admin Gudang untuk ditindaklanjuti.

```mermaid
flowchart TD
    Start([Mulai])
    End([Selesai])

    subgraph Penyelia [Penyelia]
        A(Masuk Menu Pengajuan Barang)
        B(Lihat Daftar Pengajuan Unit Kerja Sendiri Status Pending)
        C(Pilih Pengajuan dan Buka Detail)
        D(Review: Barang, Kuantitas, Tanggal, Catatan)
        E{Keputusan?}
        F(Sesuaikan qty_approved per Item - Opsional)
        G(Klik Setujui)
        H(Input Alasan Penolakan - Wajib)
        I(Klik Tolak)
    end

    subgraph Sistem [Sistem SIMPATIK]
        J(Filter Otomatis: Hanya Departemen Sendiri + Status Pending)
        K{Validasi Gate approve?}
        L(Mulai DB Transaction)
        M(Validasi Status Harus Pending)
        N(Update qty_approved = min qty_form dan qty_requested per Item)
        O(Update Status: Pending -> Approved)
        O2(Simpan approver_id, approved_at)
        P(Kirim OutboundStatusUpdatedNotification ke Pemohon: DB + WA)
        Q(Kirim OutboundReadyForIssueNotification ke Semua warehouse_admin: DB + WA)
        R(Commit Transaction)
        S{Validasi RejectOutboundRequest?}
        T(Tampilkan Error: Alasan Wajib Diisi)
        U{Validasi Gate reject?}
        V(Validasi Status Harus Pending atau Approved)
        W(Update Status: -> Rejected)
        W2(Simpan rejection_reason, approved_at)
        X(Kirim OutboundStatusUpdatedNotification ke Pemohon: DB + WA)
        Y(Redirect + Flash Sukses)
    end

    Start --> A
    A --> J
    J --> B
    B --> C
    C --> D
    D --> E

    E -- Setujui --> F
    F --> G
    G --> K
    K -- Tidak Diizinkan --> Y
    K -- Diizinkan --> L
    L --> M
    M --> N
    N --> O
    O --> O2
    O2 --> P
    P --> Q
    Q --> R
    R --> Y

    E -- Tolak --> H
    H --> I
    I --> S
    S -- Gagal --> T --> H
    S -- Lolos --> U
    U -- Tidak Diizinkan --> Y
    U -- Diizinkan --> V
    V --> W
    W --> W2
    W2 --> X
    X --> Y

    Y --> End
```

---

### AD-12 — Membuat Permintaan Langsung
Proses pengeluaran barang instan oleh **Admin Gudang** yang melewati (*bypass*) seluruh tahap verifikasi Penyelia. Begitu transaksi disimpan, status langsung menjadi `Issued` dan stok barang otomatis terpotong dalam satu *database transaction* dengan *pessimistic locking*. Tidak ada notifikasi yang dikirim pada alur ini.

```mermaid
flowchart TD
    Start([Mulai])
    End([Selesai])

    subgraph AdminGudang [Admin Gudang]
        A(Masuk Menu Permintaan Langsung)
        B(Pilih Pemohon, Departemen, Tanggal)
        C(Tambah Detail: Pilih Barang dan Kuantitas)
        D(Submit Permintaan Langsung)
    end

    subgraph Sistem [Sistem SIMPATIK]
        E(Tampilkan Form Khusus: Daftar Semua User + Semua Item)
        F{Validasi StoreDirectOutboundRequest?}
        G(Tampilkan Pesan Error Validasi)
        H(Mulai DB Transaction)
        I(Generate Nomor Dokumen Baru)
        J(Buat OutboundTransaction: Status = Issued, is_direct_request = true)
        J2(Simpan issued_by = Admin, issued_at = Sekarang)
        K(Simpan OutboundDetail: qty_approved = qty_requested)
        L(lockForUpdate Item di Database)
        M{Stok Mencukupi?}
        N(Abort 422: Stok Tidak Mencukupi)
        O(Kurangi current_stock Item)
        P(Catat StockLedger: movement_type = out)
        Q{Masih Ada Item Lain?}
        R(Commit DB Transaction)
        S(Redirect ke Halaman Detail Transaksi Baru)
    end

    Start --> A
    A --> E
    E --> B
    B --> C
    C --> D
    D --> F

    F -- Gagal --> G
    G --> B

    F -- Lolos --> H
    H --> I
    I --> J
    J --> J2
    J2 --> K
    K --> L
    L --> M

    M -- Tidak --> N
    N --> End

    M -- Ya --> O
    O --> P
    P --> Q

    Q -- Ya --> K
    Q -- Tidak --> R
    R --> S
    S --> End
```

---

### AD-13 — Menyetujui Permintaan Barang
Proses persetujuan akhir dan pengeluaran barang secara sistem oleh **Admin Gudang**. Ini adalah tahap di mana stok barang benar-benar dipotong dari *database*. Admin Gudang dapat menyesuaikan kuantitas yang dikeluarkan, namun tidak boleh melebihi kuantitas yang sudah disetujui Penyelia. Jika stok barang menyentuh batas minimum setelah pemotongan, sistem otomatis mengirim peringatan *Low Stock Alert*.

```mermaid
flowchart TD
    Start([Mulai])
    End([Selesai])

    subgraph AdminGudang [Admin Gudang]
        A(Masuk Menu Pengajuan Barang)
        B(Filter: Tampilkan Status Approved)
        C(Pilih Transaksi dan Buka Detail)
        D(Review Detail: Barang dan qty_approved dari Penyelia)
        E(Sesuaikan qty_final per Item - Opsional)
        F(Klik Keluarkan Barang)
    end

    subgraph Sistem [Sistem SIMPATIK]
        G{Validasi Gate issue?}
        H(Mulai DB Transaction)
        I(Validasi Status Harus Approved)
        J(Hitung qty_out = min qty_final dan qty_approved Penyelia)
        K(Update qty_approved jika qty_final Berbeda)
        L(lockForUpdate Item di Database)
        M{Stok Mencukupi?}
        N(Abort 422: Stok Tidak Mencukupi)
        O(Kurangi current_stock Item)
        P(Catat StockLedger: movement_type = out)
        Q{current_stock <= minimum_stock_level?}
        R(Kirim LowStockAlertNotification ke Semua warehouse_admin: DB + WA)
        S{Masih Ada Item Lain?}
        T(Update Status Transaksi: Approved -> Issued)
        T2(Simpan issued_by, issued_at)
        U(Kirim OutboundStatusUpdatedNotification ke Pemohon: DB + WA)
        V(Commit DB Transaction)
        W(Redirect ke Detail Transaksi + Flash Sukses)
    end

    Start --> A
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G

    G -- Tidak Diizinkan --> W
    G -- Diizinkan --> H
    H --> I
    I --> J
    J --> K
    K --> L
    L --> M

    M -- Tidak --> N
    N --> End

    M -- Ya --> O
    O --> P
    P --> Q

    Q -- Ya --> R --> S
    Q -- Tidak --> S

    S -- Ya --> J
    S -- Tidak --> T
    T --> T2
    T2 --> U
    U --> V
    V --> W
    W --> End
```

---

### AD-14 — Melihat Data Barang
Proses pemantauan data dan stok barang yang dilakukan oleh **Admin Gudang**. Admin Gudang memiliki permission `view-items` (bukan `manage-items`), sehingga hanya dapat membaca data barang tanpa bisa mengubah atau menambah. Terdapat filter khusus `low_stock` untuk langsung menyaring barang-barang yang stoknya sudah menyentuh atau di bawah batas minimum.

```mermaid
flowchart TD
    Start([Mulai])
    End([Selesai])

    subgraph AdminGudang [Admin Gudang]
        A(Masuk Menu Data Barang)
        B(Tentukan Filter: Nama, Kode, Kategori, atau Flag Stok Rendah)
        C(Klik Barang untuk Lihat Detail - Opsional)
    end

    subgraph Sistem [Sistem SIMPATIK]
        D(Query Semua Item via ItemService::getItems)
        E(Terapkan Filter: search, category_id, low_stock, sort)
        F(Ambil Daftar Kategori untuk Dropdown Filter)
        G(Tampilkan Daftar Barang dengan Paginasi)
        H(Informasi per Baris: Nama, Kode, Kategori, Satuan, Stok Aktual, Batas Minimum, Status Stok)
        I(Tampilkan Detail Lengkap Barang - Read Only)
    end

    Start --> A
    A --> D
    D --> F
    F --> G
    G --> H
    H --> B
    B --> E
    E --> G

    H --> C
    C --> I
    I --> End
```

---

## 3. Penjelasan Notasi

| Notasi | Representasi |
|--------|-------------|
| **Oval `([...])` di luar swimlane** | Titik awal (*Start*) dan titik akhir (*End*) dari sebuah alur aktivitas |
| **Kotak sudut melengkung `(...)` di dalam swimlane** | Aksi atau aktivitas (*Action State*) yang dilakukan oleh manusia maupun sistem |
| **Belah ketupat `{...}`** | Titik keputusan (*Decision Node*) — alur bercabang berdasarkan kondisi |
| **Garis panah `-->`** | Arah aliran kontrol (*Control Flow*) dari satu aktivitas ke aktivitas berikutnya |
| **Label pada garis panah `-- teks -->`** | Kondisi atau hasil keputusan yang menentukan cabang alur yang diambil |
| **Kotak `subgraph [Nama]`** | *Swimlane* — mengelompokkan aktivitas berdasarkan aktor/entitas yang bertanggung jawab |
| **Notasi `DB + WA` pada notifikasi** | Notifikasi dikirim melalui dua kanal sekaligus: *in-app* (database) dan WhatsApp API |
| **Notasi `lockForUpdate`** | *Pessimistic lock* pada baris database — mencegah *race condition* saat memotong stok |
| **Notasi `soft delete`** | Data tidak benar-benar dihapus; hanya ditandai dengan nilai `deleted_at` di database |
