# Laporan Activity Diagram — SIMPATIK

> **Sistem Manajemen Persediaan ATK**
> PT. Bank Pembangunan Daerah Sumatera Selatan dan Bangka Belitung
> Cabang Utama Kapten A. Rivai, Palembang

---

## 1. Pendahuluan

Activity Diagram merupakan diagram perilaku dalam Unified Modeling Language (UML) yang menggambarkan alur kerja (*workflow*) atau aktivitas berurutan dari sebuah sistem. Diagram ini digunakan untuk memodelkan logika bisnis dan urutan operasional dari awal hingga akhir.

Pada sistem **SIMPATIK**, setiap *Use Case* utama direpresentasikan oleh satu *Activity Diagram*. Diagram ini menggambarkan interaksi antara aktor (Pengguna, Bagian Umum, Admin Gudang, Staff, Penyelia) dengan Sistem secara akurat sesuai dengan kondisi nyata sistem saat ini.

---

## 2. Activity Diagram per Use Case

### AD-01 — Login [X]
Proses autentikasi yang membedakan hak akses (*role*) setiap aktor setelah berhasil login.

```mermaid
flowchart TD
    Start([Mulai])
    End([Selesai])

    subgraph Pengguna
        A(Buka Halaman Login)
        B(Input Email dan Password)
        C(Klik Login)
    end

    subgraph Sistem
        D{Validasi Email & Password?}
        E(Tampilkan Pesan Error)
        F{Status Akun Aktif?}
        G(Masuk Dashboard Sesuai Role)
    end

    Start --> A
    A --> B
    B --> C
    C --> D

    D -- Tidak Valid --> E
    E --> B

    D -- Valid --> F
    F -- Tidak Aktif --> E
    
    F -- Aktif --> G
    G --> End
```

---

### AD-02 — Mengelola Data Master [X]
Proses pengelolaan data master oleh Bagian Umum, termasuk penandaan penghapusan sementara (*soft delete*).

```mermaid
flowchart TD
    Start([Mulai])
    End([Selesai])

    subgraph BagianUmum [Bagian Umum]
        A(Masuk Menu Data Master)
        B{Pilih Aksi}
        C(Input Form Data)
        D(Ubah Data)
        E(Konfirmasi Hapus)
    end

    subgraph Sistem
        F(Tampilkan Halaman)
        G{Validasi Form?}
        H(Tampilkan Pesan Error)
        I(Simpan Data Baru/Perubahan)
        J(Tandai Data Dihapus / Soft Delete)
        K(Tampilkan Pesan Sukses)
    end

    Start --> A
    A --> F
    F --> B

    B -- Tambah --> C
    B -- Edit --> D
    C --> G
    D --> G

    G -- Tidak Valid --> H
    H --> B

    G -- Valid --> I
    
    B -- Hapus --> E
    E --> J

    I --> K
    J --> K
    K --> End
```

---

### AD-03 — Menginput Barang Masuk [X]
Proses pencatatan barang dari vendor, dengan kewajiban melampirkan bukti transaksi.

```mermaid
flowchart TD
    Start([Mulai])
    End([Selesai])

    subgraph BagianUmum [Bagian Umum]
        A(Pilih Menu Barang Masuk)
        B(Klik Buat Transaksi Baru)
        C(Input Detail & Upload Bukti Nota Wajib)
        D(Submit Transaksi)
    end

    subgraph Sistem
        E(Generate Nomor Referensi)
        F{Validasi Form & File?}
        G(Tampilkan Pesan Error)
        H(Simpan Transaksi & File Nota)
        I(Tambah Stok Barang Aktual)
        J(Catat Riwayat Mutasi Stok)
        K(Tampilkan Pesan Sukses)
    end

    Start --> A
    A --> B
    B --> E
    E --> C
    C --> D
    D --> F

    F -- Tidak Lengkap --> G
    G --> C

    F -- Valid --> H
    H --> I
    I --> J
    J --> K
    K --> End
```

---

### AD-04 — Mengelola Pengguna [X]
Proses pengelolaan akun pengguna. Penghapusan akan dicegah jika pengguna sudah memiliki riwayat transaksi.

```mermaid
flowchart TD
    Start([Mulai])
    End([Selesai])

    subgraph BagianUmum [Bagian Umum]
        A(Masuk Manajemen Pengguna)
        B{Pilih Aksi}
        C(Isi Form Data / Ubah Data)
        D(Klik Hapus Pengguna)
    end

    subgraph Sistem
        E(Tampilkan Daftar Pengguna)
        F{Validasi Data?}
        G(Tampilkan Pesan Error)
        H(Simpan Perubahan & Atur Hak Akses)
        I{Cek Relasi Transaksi?}
        J(Tolak Hapus, Sarankan Nonaktif)
        K(Tandai Akun Dihapus)
    end

    Start --> A
    A --> E
    E --> B

    B -- Tambah/Edit --> C
    C --> F
    F -- Tidak Valid --> G
    G --> C
    F -- Valid --> H
    H --> End
    
    B -- Hapus --> D
    D --> I
    I -- Ada Relasi --> J
    I -- Tidak Ada --> K
    
    J --> End
    K --> End
```

---

### AD-05 — Melihat Audit Trail Digital [X]
Proses melihat log aktivitas beserta detail perubahan data sebelum dan sesudahnya.

```mermaid
flowchart TD
    Start([Mulai])
    End([Selesai])

    subgraph BagianUmum [Bagian Umum]
        A(Pilih Menu Audit Trail)
        B(Pilih Filter Modul/Pencarian)
        C(Klik Baris Log Tertentu)
    end

    subgraph Sistem
        D(Tampilkan Daftar Log Aktivitas)
        E(Tampilkan Perbandingan Data: Sebelum & Sesudah)
    end

    Start --> A
    A --> D
    D --> B
    B --> D
    D --> C
    C --> E
    E --> End
```

---

### AD-06 — Mengelola Pengaturan Sistem [X]
Proses menyimpan konfigurasi dasar yang menampilkan nilai (*value*) pengaturan saat ini.

```mermaid
flowchart TD
    Start([Mulai])
    End([Selesai])

    subgraph BagianUmum [Bagian Umum]
        A(Masuk Menu Pengaturan)
        B(Ubah Nilai Pengaturan Saat Ini)
        C(Simpan Pengaturan)
    end

    subgraph Sistem
        D(Tampilkan Form Berisi Nilai Saat Ini)
        E{Validasi Data?}
        F(Tampilkan Pesan Error)
        G(Simpan Pembaruan Pengaturan)
        H(Tampilkan Pesan Sukses)
    end

    Start --> A
    A --> D
    D --> B
    B --> C
    C --> E

    E -- Tidak Valid --> F
    F --> B

    E -- Valid --> G
    G --> H
    H --> End
```

---

### AD-07 — Melihat Laporan & Rekonsiliasi [X]
Proses membuat laporan umum dan melakukan input rekonsiliasi stok fisik versus sistem.

```mermaid
flowchart TD
    Start([Mulai])
    End([Selesai])

    subgraph Pengguna [Bagian Umum / Admin Gudang]
        A(Masuk Menu Laporan)
        B{Pilih Menu}
        C(Pilih Laporan & Periode)
        D(Ekspor PDF / Excel)
        E(Buka Rekonsiliasi)
        F(Input Hitung Fisik Barang)
        G(Unduh Berita Acara)
    end

    subgraph Sistem
        H(Tampilkan Data Laporan)
        I{Apakah Rekonsiliasi Bulan Ini Ada?}
        J(Hitung Selisih & Sesuaikan Stok Sistem)
        K(Generate Berita Acara)
    end

    Start --> A
    A --> B
    
    B -- Laporan Umum --> C
    C --> H
    H --> D
    D --> End

    B -- Rekonsiliasi Fisik --> E
    E --> I
    I -- Belum --> F
    F --> J
    J --> End

    I -- Sudah --> G
    G --> K
    K --> End
```

---

### AD-08 — Mengajukan Permintaan Barang [X]
Permintaan barang dari Staff (butuh persetujuan) berbeda dengan Penyelia (otomatis disetujui).

```mermaid
flowchart TD
    Start([Mulai])
    End([Selesai])

    subgraph Pemohon [Staff / Penyelia]
        A(Buat Pengajuan Baru)
        B(Input Detail Barang)
        C(Submit Pengajuan)
    end

    subgraph Sistem
        D(Validasi Input)
        E{Siapa Pemohon?}
        F(Set Status 'Pending')
        G(Kirim Notifikasi ke Penyelia)
        H(Set Status 'Approved' Otomatis)
        I(Kirim Notifikasi ke Admin Gudang)
    end

    Start --> A
    A --> B
    B --> C
    C --> D
    
    D --> E
    E -- Staff --> F
    F --> G
    G --> End

    E -- Penyelia --> H
    H --> I
    I --> End
```

---

### AD-09 — Mengonfirmasi Serah Terima Barang [X]
Proses dua arah: Admin Gudang menyerahkan, kemudian Pemohon mengonfirmasi penerimaan secara fisik.

```mermaid
flowchart TD
    Start([Mulai])
    End([Selesai])

    subgraph AdminGudang [Admin Gudang]
        A(Buka Transaksi Disetujui/Issued)
        B(Klik 'Serahkan Barang')
    end

    subgraph Pemohon [Staff / Penyelia]
        E(Terima Notifikasi Siap Diambil)
        F(Buka Transaksi Status HandedOver)
        G(Klik 'Konfirmasi Terima Barang')
    end

    subgraph Sistem
        C(Update Status ke 'HandedOver')
        D(Kirim Notifikasi ke Pemohon)
        H(Update Status ke 'Completed')
    end

    Start --> A
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> End
```

---

### AD-10 — Cetak Dokumen Transaksi [X]
SPB dapat dicetak di awal, tetapi BAST baru bisa dicetak setelah serah terima selesai.

```mermaid
flowchart TD
    Start([Mulai])
    End([Selesai])

    subgraph Aktor [Staff / Admin Gudang]
        A(Buka Detail Transaksi)
        B{Pilih Dokumen}
        C(Klik Cetak SPB)
        D(Klik Cetak BAST)
    end

    subgraph Sistem
        E(Generate PDF Surat Permintaan Barang)
        F{Status Transaksi?}
        G(Tolak Akses Cetak)
        H(Generate PDF Berita Acara Serah Terima)
    end

    Start --> A
    A --> B

    B -- Cetak SPB --> C
    C --> E
    E --> End

    B -- Cetak BAST --> D
    D --> F
    
    F -- Belum Diserahkan --> G
    G --> End

    F -- HandedOver / Completed --> H
    H --> End
```

---

### AD-11 — Verifikasi Permintaan Barang
Penyelia melakukan peninjauan terhadap pengajuan dari Staff. Bisa sesuaikan jumlah atau menolak dengan alasan.

```mermaid
flowchart TD
    Start([Mulai])
    End([Selesai])

    subgraph Penyelia
        A(Buka Daftar Pending Unit Kerja Sendiri)
        B(Review Detail Pengajuan)
        C{Keputusan?}
        D(Sesuaikan Jumlah Disetujui & Klik Setuju)
        E(Input Alasan Wajib & Klik Tolak)
    end

    subgraph Sistem
        F(Update Status ke 'Approved')
        G(Update Status ke 'Rejected')
        H(Kirim Notifikasi Keputusan)
    end

    Start --> A
    A --> B
    B --> C

    C -- Setujui --> D
    D --> F
    F --> H

    C -- Tolak --> E
    E --> G
    G --> H

    H --> End
```

---

### AD-12 — Membuat Permintaan Langsung [X]
Admin gudang mengeluarkan barang tanpa melalui alur verifikasi penyelia (potong stok langsung).

```mermaid
flowchart TD
    Start([Mulai])
    End([Selesai])

    subgraph AdminGudang [Admin Gudang]
        A(Masuk Menu Permintaan Langsung)
        B(Pilih Pemohon & Detail Barang)
        C(Submit Permintaan Langsung)
    end

    subgraph Sistem
        D(Cek Ketersediaan Stok Aktual)
        E{Stok Cukup?}
        F(Tampilkan Error Stok Tidak Cukup)
        G(Simpan Transaksi dengan Status 'Issued')
        H(Kurangi Stok Barang Otomatis)
    end

    Start --> A
    A --> B
    B --> C
    C --> D
    D --> E

    E -- Tidak --> F
    F --> B

    E -- Ya --> G
    G --> H
    H --> End
```

---

### AD-13 — Menyetujui Permintaan Barang [X]
Tindakan Admin Gudang untuk benar-benar mengeluarkan stok dari pengajuan yang sudah disetujui (Approved).

```mermaid
flowchart TD
    Start([Mulai])
    End([Selesai])

    subgraph AdminGudang [Admin Gudang]
        A(Buka Transaksi Status Approved)
        B(Sesuaikan Jumlah Final - Opsional)
        C(Klik Keluarkan Barang)
    end

    subgraph Sistem
        D(Cek Ketersediaan Stok)
        E{Stok Cukup?}
        F(Tampilkan Pesan Error)
        G(Kurangi Stok Barang)
        H(Ubah Status ke 'Issued')
        I(Kirim Notifikasi Barang Siap)
    end

    Start --> A
    A --> B
    B --> C
    C --> D
    D --> E

    E -- Tidak --> F
    F --> A

    E -- Ya --> G
    G --> H
    H --> I
    I --> End
```

---

### AD-14 — Melihat Data Barang [X]
Pemantauan data stok oleh Admin Gudang dengan ketersediaan fitur filter khusus peringatan stok minim.

```mermaid
flowchart TD
    Start([Mulai])
    End([Selesai])

    subgraph AdminGudang [Admin Gudang]
        A(Masuk Menu Data Barang)
        B(Terapkan Filter: Pencarian / Stok Rendah)
        C(Klik Baris Barang)
    end

    subgraph Sistem
        D(Tampilkan Daftar Barang Tersaring)
        E(Tampilkan Detail Informasi Barang)
    end

    Start --> A
    A --> D
    D --> B
    B --> D
    D --> C
    C --> E
    E --> End
```

---

## 3. Penjelasan Notasi

| Notasi | Representasi |
|--------|-------------|
| **Oval `([...])`** | Titik awal (*Start*) dan titik akhir (*End*) dari sebuah alur aktivitas |
| **Kotak sudut melengkung `(...)`** | Aksi atau aktivitas (*Action State*) yang dilakukan aktor / sistem |
| **Belah ketupat `{...}`** | Titik keputusan (*Decision Node*) — alur bercabang berdasarkan kondisi |
| **Garis panah `-->`** | Arah aliran kontrol (*Control Flow*) dari satu aktivitas ke aktivitas berikutnya |
| **Label pada garis panah `-- teks -->`** | Kondisi atau hasil keputusan yang menentukan cabang alur yang diambil |
| **Kotak `subgraph [Nama]`** | *Swimlane* — mengelompokkan aktivitas berdasarkan entitas yang bertanggung jawab |
