# Laporan Sequence Diagram — SIMPATIK

> **Sistem Manajemen Persediaan ATK**
> PT. Bank Pembangunan Daerah Sumatera Selatan dan Bangka Belitung
> Cabang Utama Kapten A. Rivai, Palembang

---

## 1. Pendahuluan

Sequence Diagram memodelkan urutan pemanggilan *method* dari satu komponen ke komponen lain pada arsitektur perangkat lunak. Pada sistem **SIMPATIK**, Sequence Diagram ini disusun berdasarkan arsitektur riil proyek yang menggunakan **Inertia.js (React)** sebagai *View*, **Laravel Controllers**, **Services** untuk logika bisnis, dan **Eloquent Models**.

---

## 2. Sequence Diagram per Fitur Utama

### 2.1 Proses Autentikasi & Pengecekan Tanda Tangan (*Login & Signature Middleware*)
Proses ini mencakup *login* standar via `LoginController` dan pengecekan kelengkapan tanda tangan oleh *Middleware*.

```mermaid
sequenceDiagram
    autonumber
    actor U as Pengguna
    participant V as View (Inertia React)
    participant C as LoginController
    participant MW as Signature Middleware
    participant M as User Model

    U->>V: Buka '/login'
    U->>V: Input Email & Password, Klik "Login"
    V->>C: store(Request)
    
    C->>C: Auth::attempt()
    alt Jika Kredensial Tidak Valid
        C-->>V: Redirect back with error
        V-->>U: Tampilkan Pesan Error
    else Jika Kredensial Valid
        C->>C: session()->regenerate()
        C-->>V: Redirect intended ('/dashboard')
    end
    
    V->>MW: Request '/dashboard' (atau rute lain)
    MW->>M: user()->signature_path
    
    alt Jika signature_path NULL
        MW-->>V: Redirect to '/signature/create'
        V-->>U: Tampilkan Form Tanda Tangan Onboarding
    else Jika signature_path Ada
        MW-->>V: Teruskan Request ke Controller Tujuan
        V-->>U: Tampilkan Halaman Tujuan
    end
```

---

### 2.2 Proses Pemasukan Barang (*Inbound Transaction*)
Proses pencatatan barang masuk oleh Admin Gudang.

```mermaid
sequenceDiagram
    autonumber
    actor A as Admin Gudang
    participant V as View (Inbound/Form)
    participant C as InboundController
    participant S as InboundService
    participant MI as InboundTransaction Model
    participant ML as StockLedger Model
    participant MItem as Item Model

    A->>V: Input Data Referensi & Daftar Barang
    A->>V: Klik "Simpan"
    V->>C: store(StoreInboundRequest)
    
    C->>S: createTransaction(validatedData)
    
    S->>MI: create(transactionData)
    MI-->>S: transaction
    
    loop Setiap Item
        S->>MI: create details
        S->>ML: recordMutation(in)
        S->>MItem: increment('current_stock', qty)
    end
    
    S-->>C: void
    C-->>V: Redirect ke index with success
    V-->>A: Tampilkan Flash Message Sukses
```

---

### 2.3 Proses Pengajuan Barang Normal (*Outbound Transaction - Request & Approval*)
Tahap pengajuan (*Pending*), persetujuan oleh Kepala Divisi (*Approved*), dan penyiapan oleh Admin Gudang (*Issued*).

```mermaid
sequenceDiagram
    autonumber
    actor R as Staff
    participant V as View (Outbound/Form)
    participant C as OutboundController
    participant S as OutboundService
    participant MO as OutboundTransaction Model
    actor KD as Kepala Divisi
    actor AG as Admin Gudang

    R->>V: Input Daftar Permintaan Barang
    R->>V: Klik "Submit Pengajuan"
    V->>C: store(StoreOutboundRequest)
    C->>S: createRequest(data)
    S->>MO: create(status: 'PENDING')
    S-->>C: transaction
    C-->>V: Redirect success
    
    %% Persetujuan
    KD->>V: Buka Detail Pengajuan (PENDING)
    KD->>V: Klik "Setujui"
    V->>C: approve(outbound_id)
    C->>S: approveRequest(outbound, user_id)
    S->>MO: update(status: 'APPROVED')
    S-->>C: void
    C-->>V: Redirect success
    
    %% Issue (Penyiapan)
    AG->>V: Buka Detail Pengajuan (APPROVED)
    AG->>V: Klik "Proses Penyiapan Barang"
    V->>C: issue(outbound_id)
    C->>S: issueItems(outbound, user_id)
    S->>MO: update(status: 'ISSUED')
    S-->>C: void
```

---

### 2.4 Proses Penyerahan & Konfirmasi Barang (*Outbound - Handover & Pickup*)
Tahap akhir di mana Admin Gudang menyerahkan fisik barang (*Handed Over*) dan Peminta mengonfirmasi penerimaan secara sistem (*Completed*).

```mermaid
sequenceDiagram
    autonumber
    actor AG as Admin Gudang
    participant V as View (Inertia React)
    participant C as OutboundController
    participant S as OutboundService
    participant MO as OutboundTransaction Model
    participant ML as StockLedger Model
    participant MItem as Item Model
    actor R as Staff (Peminta)

    %% Handover
    AG->>V: Buka Pengajuan (ISSUED)
    AG->>V: Klik "Serahkan Barang"
    V->>C: handover(outbound_id)
    C->>S: handoverItems(outbound, user_id)
    S->>MO: update(status: 'HANDED_OVER', handed_over_by)
    C-->>V: Redirect success
    V-->>AG: Tampilkan Status "Menunggu Konfirmasi"
    
    AG->>R: Serahkan Fisik Barang
    
    %% Pickup
    R->>V: Buka Pengajuan (HANDED_OVER)
    R->>V: Klik "Konfirmasi Penerimaan"
    V->>C: pickup(outbound_id)
    C->>S: pickupItems(outbound, user_id)
    
    S->>MO: update(status: 'COMPLETED', picked_up_by)
    
    loop Setiap Item
        S->>ML: recordMutation(out)
        S->>MItem: decrement('current_stock', qty)
        S->>MItem: checkLowStock()
    end
    
    S-->>C: void
    C-->>V: Redirect success
    V-->>R: Status Transaksi Selesai
```

---

### 2.5 Pembuatan & Unduh Laporan (*Reporting & BAST PDF*)
Menampilkan interaksi pembuatan laporan (PDF/Excel) menggunakan *DomPDF* / *Excel Exporter* via *Controller* dan *Service*.

```mermaid
sequenceDiagram
    autonumber
    actor U as User
    participant V as View (Inertia React)
    participant C as ReportController / OutboundController
    participant PDF as DomPDF / Excel Facade
    participant DB as Database

    U->>V: Klik "Unduh BAST" atau "Export Laporan Mutasi"
    
    alt Download BAST
        V->>C: downloadBast(outbound_id)
        C->>DB: getOutboundData(id)
        C->>PDF: loadView('pdf.bast', data)
    else Export Laporan
        V->>C: exportMutationPdf(filters)
        C->>DB: queryMutationData(filters)
        C->>PDF: loadView('pdf.mutation', data)
    end
    
    PDF-->>C: pdf_stream
    C-->>V: return response()->stream()
    V-->>U: File Berhasil Diunduh
```

---

### 2.6 Proses Rekonsiliasi Stok (*Stock Reconciliation*)
Rekonsiliasi ditangani langsung oleh `ReportController` untuk mengecek stok awal, input fisik aktual, dan melakukan penyesuaian (adjustment).

```mermaid
sequenceDiagram
    autonumber
    actor A as Admin Gudang
    participant V as View (Reconciliation Page)
    participant C as ReportController
    participant MR as StockReconciliation Model
    participant ML as StockLedger Model
    participant MItem as Item Model

    A->>V: Buka Halaman Rekonsiliasi
    V->>C: reconciliation(Request)
    C-->>V: Render Data Stok Sistem Saat Ini
    
    A->>V: Input Qty Fisik per Item, Klik "Submit"
    V->>C: storeReconciliation(Request)
    
    C->>MR: create(reconciliationData)
    
    loop Setiap Item yang Diinput
        C->>C: qty_diff = qty_fisik - qty_sistem
        alt Jika qty_diff != 0
            C->>ML: recordMutation(type: adjustment, qty_diff)
            C->>MItem: update(['current_stock' => qty_fisik])
        end
    end
    
    C-->>V: Redirect with success
    V-->>A: Laporan Rekonsiliasi Berhasil Disimpan
```

---

### 2.7 Proses Pengaturan Profil & Tanda Tangan (*Profile Update*)
Bagaimana pengguna menyimpan tanda tangan digital (*signature*) untuk kebutuhan cetak BAST, yang akan ditangani oleh `SignatureController` atau `ProfileController`.

```mermaid
sequenceDiagram
    autonumber
    actor U as Pengguna
    participant V as View (Profile/Edit)
    participant C as ProfileController
    participant S as ProfileService / Storage
    participant M as User Model

    U->>V: Gambar Tanda Tangan (Canvas), Klik "Simpan"
    V->>C: updateSignature(Request)
    
    C->>C: validateBase64()
    C->>S: processAndSaveImage(base64Data)
    S-->>C: signature_path (file_url)
    
    C->>M: update(['signature_path' => signature_path])
    
    C-->>V: Redirect back with success
    V-->>U: Tanda Tangan Disimpan
```

---

### 2.8 Pengelolaan Data Master (*Master Data Management*)
Pola interaksi konvensional untuk *CRUD* Master Data (Barang, Kategori, Departemen) via *Controller*.

```mermaid
sequenceDiagram
    autonumber
    actor A as Admin Gudang
    participant V as View (Inertia React)
    participant C as MasterController (Item/Category/Dept)
    participant M as Model (Item/Category/Dept)

    A->>V: Isi Form Tambah / Edit / Hapus
    A->>V: Klik "Submit / Delete"
    
    alt Create
        V->>C: store(Request)
        C->>C: validate()
        C->>M: create(data)
    else Update
        V->>C: update(Request, id)
        C->>C: validate()
        C->>M: update(data)
    else Delete
        V->>C: destroy(id)
        C->>M: delete()
    end
    
    C-->>V: Redirect with flash message
    V-->>A: Tampilkan Notifikasi Keberhasilan
```

---

## 3. Penjelasan Arsitektur Interaksi

Berdasarkan *Sequence Diagram* di atas, arsitektur SIMPATIK menggunakan pola **Inertia.js - Laravel MVC-S**:

1.  **Actor (Pengguna):** Berinteraksi langsung dengan *browser*.
2.  **View (Inertia React):** Dibangun dengan *React.js* yang di-render oleh Inertia. Bertugas menampilkan UI, menangani *state* lokal, dan mengirimkan *HTTP Request* tanpa *page reload* penuh (SPA).
3.  **Controller:** Berfungsi sebagai gerbang masuk dari *View* (melalui *Route*), melakukan validasi dasar via *FormRequest*, mengecek otorisasi pengguna (`Gate::authorize`), dan memanggil *Service* atau *Model*.
4.  **Service:** Kelas (*Service Class* seperti `OutboundService`) yang menampung logika bisnis kompleks, transaksi *database* banyak tabel, dan penanganan kalkulasi stok, agar *Controller* tetap *clean* dan mudah diuji.
5.  **Model (Eloquent):** Bertanggung jawab atas kueri data ke *database*, mutasi struktur, relasi, dan pengelolaan riwayat.
