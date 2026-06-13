# Laporan Activity Diagram — SIMPATIK

> **Sistem Manajemen Persediaan ATK**
> PT. Bank Pembangunan Daerah Sumatera Selatan dan Bangka Belitung
> Cabang Utama Kapten A. Rivai, Palembang

---

## 1. Pendahuluan

Activity Diagram merupakan diagram perilaku dalam Unified Modeling Language (UML) yang menggambarkan alur kerja (*workflow*) atau aktivitas berurutan dari sebuah sistem. Diagram ini sangat berguna untuk memodelkan logika bisnis dan urutan operasional dari awal hingga akhir, termasuk percabangan logika (keputusan) dan eksekusi paralel.

Pada sistem **SIMPATIK**, Activity Diagram digunakan untuk merinci proses pada fitur-fitur krusial, dengan membagi aktivitas berdasarkan aktor yang terlibat menggunakan *swimlanes* (dipartisi dalam blok/subgraph).

---

## 2. Activity Diagram per Fitur

### 2.1 Proses Autentikasi (*Login*)
Proses dasar yang harus dilalui oleh semua pengguna (Staff, Kepala Divisi, Admin Gudang) sebelum dapat mengakses fitur-fitur di dalam sistem SIMPATIK.

```mermaid
flowchart TD
    Start([Mulai])
    End([Selesai])

    subgraph User [Pengguna]
        A(Buka Halaman Login)
        B(Input Email dan Password)
        C(Klik Tombol Login)
    end

    subgraph Sistem [Sistem SIMPATIK]
        D{Validasi Kredensial?}
        E(Tampilkan Pesan Error Kredensial Salah)
        F{Akun Aktif?}
        G(Tampilkan Pesan Error Akun Dinonaktifkan)
        H(Buat Session / Token Auth)
        I(Redirect ke Halaman Dashboard sesuai Role)
    end

    Start --> A
    A --> B
    B --> C
    C --> D
    
    D -- Tidak Valid --> E
    E --> B
    
    D -- Valid --> F
    F -- Tidak Aktif --> G
    G --> B
    
    F -- Ya Aktif --> H
    H --> I
    I --> End
```

---

### 2.2 Proses Pemasukan Barang (*Inbound Transaction*)
Proses ini dilakukan oleh **Admin Gudang** ketika ada barang ATK baru yang masuk dari vendor (pengadaan).

```mermaid
flowchart TD
    %% Node Definisi
    Start([Mulai])
    End([Selesai])

    subgraph AdminGudang [Admin Gudang]
        A(Masuk Menu Inbound)
        B(Buat Transaksi Baru)
        C(Input Nomor Referensi & Tanggal)
        D(Tambah Rincian Barang & Kuantitas)
        E(Submit / Simpan Transaksi)
    end

    subgraph Sistem [Sistem SIMPATIK]
        F{Validasi Data Lengkap?}
        G(Simpan Data Transaksi)
        H(Catat Mutasi ke Stock Ledger)
        I(Tambahkan Stok Aktual Item)
        J(Catat ke Activity Log)
    end

    %% Alur Kerja
    Start --> A
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    
    F -- Ya --> G
    F -- Tidak --> C
    
    G --> H
    H --> I
    I --> J
    J --> End
```

---

### 2.3 Proses Pengajuan & Pengeluaran Barang (*Outbound Transaction*)
Ini adalah alur operasional utama dan paling kompleks dalam sistem, melibatkan persetujuan berjenjang dari berbagai aktor di departemen berbeda, serta mengakomodasi **Pengajuan Langsung (*Direct Request*)**.

```mermaid
flowchart TD
    Start([Mulai])
    End([Selesai])

    StartFork{Siapa Aktornya?}

    subgraph Requester [Staff / Peminta]
        A1(Masuk Menu Permintaan)
        A2(Buat Pengajuan Barang)
        A3(Submit Pengajuan Normal)
        W(Tanda Tangan Tanda Terima)
    end

    subgraph AdminGudang [Admin Gudang]
        B1(Masuk Menu Pengambilan Langsung)
        B2(Pilih Peminta & Barang)
        B3(Submit Direct Request)
        T(Siapkan Barang Fisik)
        U(Cetak Dokumen SPB/BAST PDF)
        V(Lakukan Penyerahan Barang)
    end

    subgraph Sistem [Sistem SIMPATIK]
        E{Validasi Stok?}
        F{Tipe Transaksi?}
        G(Set Status: PENDING)
        H(Notifikasi via WhatsApp/Email ke Kepala Divisi)
        J(Tampilkan Pesan Error: Stok Habis)
        K(Set Status: REJECTED)
        M(Set Status: APPROVED)
        N(Notifikasi ke Admin Gudang)
        O(Potong Stok & Catat Ledger)
        P(Set Status: ISSUED)
        Q(Set Status: HANDED_OVER)
        R(Set Status: COMPLETED)
        S(Simpan Log Audit)
    end

    subgraph Approver [Kepala Divisi]
        I(Review Pengajuan Normal)
        L{Keputusan?}
    end

    %% Alur Workflow
    Start --> StartFork
    
    StartFork -- Pegawai Biasa --> A1
    A1 --> A2
    A2 --> A3
    A3 --> E
    
    StartFork -- Admin Gudang --> B1
    B1 --> B2
    B2 --> B3
    B3 --> E
    
    E -- Tidak Mencukupi --> J
    J --> End
    
    E -- Mencukupi --> F
    
    %% Alur Normal
    F -- Pengajuan Normal --> G
    G --> H
    H --> I
    I --> L
    
    L -- Tolak --> K
    K --> S
    
    L -- Setujui --> M
    M --> N
    N --> T
    
    %% Alur Direct Request
    F -- Direct Request --> O
    
    %% Titik Temu Alur
    T --> O
    
    O --> P
    P --> U
    U --> V
    V --> Q
    Q --> W
    W --> R
    R --> S
    S --> End
```

---

### 2.4 Pembuatan Laporan (*Reporting & Export*)
Proses di mana manajemen atau pihak operasional menarik laporan data mutasi dan penggunaan barang per unit kerja, termasuk export ke PDF/Excel.

```mermaid
flowchart TD
    Start([Mulai])
    End([Selesai])

    subgraph User [Manajemen / Admin / GA]
        A(Masuk Menu Laporan)
        B(Pilih Jenis Laporan: Mutasi / Unit Kerja)
        C(Pilih Rentang Waktu & Filter)
        D(Klik 'Generate Report')
        H(Klik 'Export Excel/PDF')
    end

    subgraph Sistem [Sistem SIMPATIK]
        E(Query Data dari Database)
        F(Agregasi Data Stok & Transaksi)
        G(Tampilkan Preview Laporan di Tabel)
        I(Kompilasi Data ke Format File)
        J(Download File ke Perangkat User)
    end

    Start --> A
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> End
```

---

### 2.5 Proses Rekonsiliasi Stok Bulanan (*Stock Reconciliation*)
Dilakukan rutin untuk mencocokkan stok yang ada di dalam *database* sistem dengan stok fisik yang ada di gudang.

```mermaid
flowchart TD
    Start([Mulai])
    End([Selesai])

    subgraph Checker [Admin Gudang / General Affairs]
        A(Masuk Menu Rekonsiliasi)
        B(Pilih Periode / Bulan)
        C(Generate Lembar Rekonsiliasi)
        E(Lakukan Perhitungan Fisik Gudang)
        F(Input Qty Fisik ke Sistem)
        G(Submit Laporan Rekonsiliasi)
    end

    subgraph Sistem [Sistem SIMPATIK]
        D(Tampilkan Daftar Barang & Qty Sistem)
        H(Hitung Selisih / Difference)
        I{Ada Selisih?}
        J(Catat Penyesuaian ke Stock Ledger)
        K(Simpan Laporan Rekonsiliasi Definitif)
    end

    Start --> A
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    
    I -- Ya --> J
    J --> K
    I -- Tidak --> K
    
    K --> End
```

---

### 2.6 Proses Prediksi Permintaan (*Demand Forecasting* - ML)
Fitur cerdas yang menggunakan Machine Learning (contoh: XGBoost) untuk memprediksi kebutuhan stok di periode mendatang.

```mermaid
flowchart TD
    Start([Mulai])
    End([Selesai])

    subgraph User [General Affairs / Admin]
        A(Masuk Menu Demand Forecast)
        B(Pilih Item dan Periode Target)
        C(Klik 'Generate Forecast')
    end

    subgraph Sistem [Aplikasi SIMPATIK]
        D(Kumpulkan Riwayat Transaksi Ledger)
        E(Kirim Data ke API Machine Learning)
        G(Terima Hasil Prediksi)
        H(Simpan ke tabel Demand Forecast)
        I(Tampilkan Hasil Prediksi & Rekomendasi Restock)
    end

    subgraph ML [Python ML Service]
        F(Proses Data dengan Model AI)
    end

    Start --> A
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> End
```

---

## 3. Penjelasan Notasi

*   **Oval Penuh / Garis Tebal Bulat:** Mewakili titik awal (*Start*) dan titik akhir (*End*) dari sebuah alur aktivitas.
*   **Kotak Sudut Melengkung:** Mewakili sebuah aksi atau aktivitas (*Action State*) yang dilakukan oleh manusia maupun sistem.
*   **Belah Ketupat (Diamond):** Mewakili titik keputusan (*Decision Node*) di mana alur akan bercabang berdasarkan kondisi (*Ya/Tidak, Disetujui/Ditolak*).
*   **Garis Panah:** Mewakili arah aliran (*Control Flow*) dari satu aktivitas ke aktivitas berikutnya.
*   **Kotak Putus-Putus (*Subgraph*):** Disebut *Swimlanes*, berfungsi untuk mengelompokkan aktivitas-aktivitas berdasarkan siapa pihak atau entitas (Aktor/Sistem) yang bertanggung jawab mengeksekusinya.
