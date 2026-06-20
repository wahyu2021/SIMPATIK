# Track: Fitur Export Rekonsiliasi (PDF & Excel)

## Metadata
- **Track ID**: `reconciliation-export`
- **Status**: ✅ Completed
- **Prioritas**: Menengah
- **Deskripsi**: Menambahkan fitur ekspor dokumen pada modul Rekonsiliasi (Stock Opname). Fitur ini mencakup *Export Worksheet* (Excel) untuk mempermudah pengecekan fisik di lapangan, dan *Export Berita Acara* (PDF) sebagai bukti formal penyesuaian stok yang ditandatangani.

---

## Latar Belakang
Rekonsiliasi stok adalah proses krusial yang memerlukan dokumentasi fisik (Berita Acara) untuk keperluan audit. Saat ini, sistem dapat menyesuaikan stok dan menyimpannya, tetapi tidak mencetak Berita Acara resmi. Selain itu, staf gudang membutuhkan form cetak (Worksheet) saat berkeliling gudang untuk menghitung stok aktual.

---

## Tahap 1: Export Worksheet (Excel)
> **Tujuan**: Membuat fitur unduh file Excel berisi daftar seluruh barang dan stok sistemnya, disertai kolom kosong untuk dicetak dan diisi secara manual (tulisan tangan) oleh petugas gudang.

### Task 1.1 — Membuat Class Export Excel
- [ ] Buat file `app/Exports/ReconciliationWorksheetExport.php`.
- [ ] Implementasikan interface `FromCollection`, `WithHeadings`, `WithMapping`, `WithStyles`, dan `ShouldAutoSize`.
- [ ] *Logic Data*: Ambil semua barang yang aktif.
- [ ] *Headings*: `No`, `Kode Barang`, `Nama Barang`, `Kategori`, `Stok Sistem`, `Stok Fisik Aktual (Isi Manual)`, `Keterangan (Isi Manual)`.

### Task 1.2 — Routing & Controller
- [ ] Buka `app/Http/Controllers/ReportController.php`.
- [ ] Tambahkan method `exportReconciliationWorksheet(Request $request)` yang akan memanggil `Excel::download()`.
- [ ] Buka `routes/web.php` dan daftarkan route `GET /reports/reconciliation/export/worksheet`.

---

## Tahap 2: Export Berita Acara (PDF)
> **Tujuan**: Membuat laporan akhir hasil rekonsiliasi ke dalam format PDF yang dilengkapi kolom tanda tangan untuk *segregation of duties*.

### Task 2.1 — Routing & Controller (PDF)
- [ ] Buka `app/Http/Controllers/ReportController.php`.
- [ ] Tambahkan method `exportReconciliationPdf(Request $request)` yang akan menerima argumen `month` dan `year`.
- [ ] *Logic*: Ambil data `Reconciliation` beserta `details`-nya pada bulan & tahun tersebut menggunakan `ReportService`.
- [ ] Buka `routes/web.php` dan daftarkan route `GET /reports/reconciliation/export/pdf`.

### Task 2.2 — Membuat View PDF Berita Acara
- [ ] Buat file view baru: `resources/views/pdf/reconciliation_report.blade.php`.
- [ ] Desain kop surat / judul: **BERITA ACARA REKONSILIASI STOK**.
- [ ] Buat tabel yang berisi rincian barang yang disesuaikan: `Kode`, `Nama`, `Stok Sistem`, `Stok Fisik`, `Selisih`, dan `Catatan/Alasan`.
- [ ] Di bagian *footer* halaman terakhir, tambahkan dua kolom tanda tangan:
  - **Kiri Bawah**: Diketahui / Disetujui Oleh (Kepala Bagian Umum) — *Nama bisa diambil dari Penanda Tangan Default atau dibiarkan garis bawah kosong*.
  - **Kanan Bawah**: Dibuat / Dihitung Oleh (Admin Gudang) — *Ambil dari relasi User pembuat*.

---

## Tahap 3: Frontend Integration (React)
> **Tujuan**: Memunculkan tombol "Download Worksheet" dan "Download Berita Acara" di antarmuka halaman Rekonsiliasi.

### Task 3.1 — Update UI Halaman Rekonsiliasi
- [ ] Buka `resources/js/Pages/Reports/Reconciliation.tsx`.
- [ ] Di bagian atas halaman (Header Action), tambahkan *dropdown* atau *group button* untuk tombol-tombol ekspor.
- [ ] Tombol 1: **"Worksheet Excel"** (berwarna hijau, icon file-spreadsheet).
- [ ] Tombol 2: **"Berita Acara PDF"** (berwarna merah, icon file-text, hanya aktif / bisa diklik jika rekonsiliasi pada bulan tersebut sudah pernah di-*submit*).
- [ ] Pastikan link menuju ke masing-masing *route* yang sudah dibuat di Tahap 1 dan 2.
