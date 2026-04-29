# Modul Sistem — SIMPATIK

> **PT. Bank Pembangunan Daerah Sumatera Selatan dan Bangka Belitung**
> Cabang Utama Kapten A. Rivai, Jl. Kapten A. Rivai No. 21 Palembang 30129

---

## Alur Kerja Operasional (Berdasarkan Wawancara Lapangan)

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Staff Unit   │    │  Penyelia    │    │ Admin Gudang │    │ Bagian Umum  │
│ (Pemohon)    │───▶│  (Approver)  │───▶│ (Mba Ajeng)  │    │ (Kak Redho)  │
│              │    │              │    │              │    │              │
│ Isi formulir │    │ Approve/     │    │ Serahkan     │    │ Cek stok     │
│ permintaan   │    │ Tolak        │    │ barang       │    │ bulanan      │
│ ATK          │    │ permintaan   │    │ + catat stok │    │ + laporan    │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
```

**Catatan penting dari lapangan:**
- Barang dipesan melalui **vendor** lalu dikirim ke gudang (di bawah Bagian Umum)
- Pencocokan data dilakukan antara **Excel** dengan **formulir fisik** (akan didigitalkan)
- Barang yang dipesan **selalu sama setiap bulan**, kecuali ada pesanan khusus
- Surat permintaan barang **dipisahkan per unit/kas** dan disetujui oleh penyelia masing-masing
- Saldo = **harga per satuan** barang
- Mutasi bulanan dicocokkan dengan **ketersediaan barang riil** di gudang
- Belum ada berita acara kerusakan (barang ATK belum pernah rusak)

---

### 1. Modul Keamanan & Manajemen Akses (*Security & Access*)

*Modul ini mengatur keamanan pintu masuk dan rekam jejak digital aplikasi.*

* **Autentikasi Multi-Peran:** Akses masuk sistem terbagi untuk 4 role:
  - **Admin Gudang** (`warehouse_admin`) — pengelola tunggal gudang, full control: kelola barang, stok, transaksi, user & settings *(mapping: Mba Ajeng)*
  - **Penyelia / Kepala Unit Kerja** (`division_head`) — approve pengajuan staf di unit kerjanya
  - **Staff Bagian Umum** (`general_affairs`) — monitoring, cek laporan, audit stok bulanan *(mapping: Kak Redho)*
  - **Staf Unit Kerja** (`staff`) — ajukan barang per unit, lihat pengajuan divisi sendiri
* **Mandatory Signature Onboarding:** Setiap pengguna yang baru pertama kali *login* diwajibkan menggambar dan menyimpan tanda tangan digital sebelum bisa menggunakan fitur lain. Menggunakan plugin `saade/filament-autograph`.
* **Digital Audit Trail:** Sistem mencatat IP Address, nama user, dan timestamp setiap aktivitas pengajuan atau persetujuan barang.

### 2. Modul Data Induk (*Master Data*)

*Pusat informasi barang dan struktur organisasi.*

* **Kelola Data Barang & Kategori:** Nama Barang, Kode Barang, Harga Satuan (Rp), Kategori, Satuan (Pcs/Box/Ream/Book), Stok Saat Ini, dan Stok Minimum.
* **Kelola Data Unit Kerja:** Daftar unit di kantor cabang A. Rivai (Unit KSG, Teller, CS, Pelayanan Jasa & Informasi, UPJI BPKAD, dll).
* **Kelola Pengguna (User Management):** Admin mengelola semua akun pegawai, mengatur role, dan memantau status tanda tangan digital.

### 3. Modul Transaksi Gudang (*Warehouse Transaction & Approval*)

*Alur kerja digitalisasi "Daftar Permintaan ATK" dan "Daftar Pengeluaran Barang" sesuai formulir Bank BSB.*

#### 3a. Penerimaan Barang (Inbound)
Admin Gudang (Mba Ajeng) mencatat stok masuk dari **vendor** beserta nomor surat jalan dan harga per satuan. Saat disimpan:
- `current_stock` item otomatis **bertambah**
- Record `StockLedger` otomatis tercatat (movement_type: `IN`)

#### 3b. Pengajuan Barang — Workflow 3 Tanda Tangan

Digitalisasi formulir **"Daftar Permintaan ATK"** dengan flow 4 status:

```
[Pending]  ──── Staff unit membuat permintaan (per unit/kas)
    │            ↳ Kolom: Nama Barang, Jumlah, Keterangan
    ▼
[Approved] ──── Penyelia unit menandatangani (approve/reject)
    │            ↳ TTD 1: Mengetahui (Penyelia)
    │            ↳ Jika ditolak → [Rejected] + alasan penolakan
    ▼
[Issued]   ──── Admin Gudang (Mba Ajeng) menyerahkan barang fisik
    │            ↳ TTD 2: Yang Mengeluarkan (Admin Gudang)
    │            ↳ TTD 3: Yang Menerima (Staff unit)
    │            ↳ Stok otomatis berkurang
    │            ↳ StockLedger otomatis tercatat (movement_type: OUT)
    ▼
[Selesai]  ──── Siap cetak PDF "Daftar Pengeluaran Barang"
```

**Detail per status:**

| Status | Pelaku | Aksi |
|--------|--------|------|
| `Pending` | Staff unit | Buat permintaan, pilih barang & jumlah |
| `Approved` | Penyelia unit | Klik "Setujui" atau "Tolak" + alasan |
| `Issued` | Admin Gudang (Mba Ajeng) | Klik "Serahkan Barang" → stok berkurang otomatis |
| `Rejected` | Penyelia | Permintaan ditolak, wajib isi alasan |

**Pesanan Khusus:**
- Toggle `is_special_request` untuk permintaan di luar barang rutin bulanan
- Jika aktif, wajib mengisi catatan/alasan khusus

#### 3c. Cetak Dokumen (Automated PDF Generator)

Dua template PDF sesuai dokumen fisik Bank BSB:

##### PDF 1: "Daftar Permintaan ATK"
- Kop surat: PT. Bank Pembangunan Daerah Sumatera Selatan dan Bangka Belitung
- Unit kerja pengaju
- Tabel: No | Nama Barang | Jumlah Barang | Keterangan
- Tanda tangan digital: **Mengetahui** (Penyelia) + **Yang Meminta** (Staff)
- Tanggal & tempat (Palembang)

##### PDF 2: "Daftar Pengeluaran Barang"
- Kop surat sama
- Tabel: No | Nama Barang | Jumlah Barang | Harga Barang (Satuan) | Total Harga Barang
- Tanda tangan digital 3 pihak:
  - **Yang Menerima** (Staff unit pemohon)
  - **Menyetujui** (Penyelia)
  - **Yang Mengeluarkan** (Admin Gudang, Palembang)
- QR Code validasi: *"Dokumen ini telah diotorisasi secara elektronik oleh sistem SIMPATIK"*

### 4. Modul Pelaporan & Mutasi (*Reporting*)

*Menggantikan rekapitulasi manual di akhir bulan — yang sebelumnya dilakukan Kak Redho via Excel.*

* **Kartu Mutasi Stok (Ledger):** Kartu stok digital otomatis terisi dari setiap transaksi:
  - Saldo Awal + Masuk − Keluar = Saldo Akhir
  - Termasuk document reference (nomor surat jalan / nomor dokumen)
  - Filter per barang, per periode, per jenis mutasi (IN/OUT)
* **Rekonsiliasi Bulanan:** Fitur untuk mencocokkan saldo sistem vs stok fisik aktual di gudang
* **Export Laporan Berstandar:** Unduh laporan ke format Excel atau PDF sesuai standar pelaporan internal Bank Sumsel Babel

### 5. Modul Peramalan Cerdas (*Intelligent Forecasting — XGBoost*)

*Fitur unggulan berbasis kecerdasan buatan. Menggunakan microservice Python terpisah.*

* **Dashboard Prediksi Kebutuhan:** Model XGBoost via API Python memprediksi jumlah ATK/Formulir yang harus dipesan bulan depan berdasarkan data historis mutasi.
* **Saran Pemesanan Otomatis:** Sistem menghitung (Prediksi XGBoost − Sisa Stok Saat Ini) untuk merekomendasikan jumlah pengadaan.
* **Model Metrics:** Menampilkan MAE Score dan versi model untuk transparansi akurasi prediksi.

### 6. Modul Dashboard Analitik & Peringatan (*Analytics & Alerts*)

* **Visualisasi Tren:** Grafik batang/garis menampilkan barang paling sering diminta dan unit kerja paling konsumtif.
* **Widget Stok Kritis:** Tabel barang dengan stok di bawah minimum — ditandai warna merah.
* **Widget Pengajuan Menunggu:** Jumlah permintaan berstatus `Pending` dan `Approved` yang belum diserahkan.
* **Widget Nilai Gudang:** Total nilai stok gudang (∑ harga satuan × stok saat ini).
* **Notifikasi WhatsApp Stok Tipis:** Ketika stok menyentuh batas minimum, sistem mengirim alert otomatis ke WhatsApp Admin Gudang melalui API (Fonnte/WATool/Meta Cloud API).
* **Low Stock Alert Panel:** Notifikasi real-time di dashboard Admin Gudang.