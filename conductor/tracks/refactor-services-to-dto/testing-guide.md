# Panduan Pengujian Keseluruhan (User Acceptance Testing - UAT)

Dokumen UAT ini disusun dengan format langkah-demi-langkah (Step-by-Step) yang sangat rinci untuk menjamin keandalan *Service Layer* dan **Data Transfer Object (DTO)** setelah proses refaktor. Pengujian ini wajib dilakukan untuk mendeteksi *bugs*, *fatal error (500)*, atau ketidaksesuaian logika (*logical error*).

---

## 1. Modul Master Kategori & Departemen
**Tujuan:** Memastikan pengiriman form teks biasa via DTO bekerja sempurna.
**Login Sebagai:** Super Admin / Admin Gudang

### Test Case 1.1: Pembuatan Kategori Baru (Positive)
1. **Navigasi:** Buka menu **Data Master -> Kategori**.
2. **Aksi:** Klik tombol **"Tambah Kategori"**.
3. **Input:** 
   - Nama Kategori: `Bahan Kimia`
   - Deskripsi: `Bahan kimia untuk laboratorium`
4. **Eksekusi:** Klik **"Simpan"**.
5. **Ekspektasi:** 
   - Muncul notifikasi "Kategori berhasil ditambahkan".
   - Kategori `Bahan Kimia` muncul di tabel.

### Test Case 1.2: Pembuatan Kategori Tanpa Nama (Negative)
1. **Navigasi:** Buka menu **Data Master -> Kategori** -> **Tambah Kategori**.
2. **Input:** Kosongkan semua kolom.
3. **Eksekusi:** Klik **"Simpan"**.
4. **Ekspektasi:** 
   - Sistem **tidak boleh** memunculkan halaman error 500 (merah).
   - Muncul peringatan di bawah kolom Nama: *"Nama kategori wajib diisi"*.

### Test Case 1.3: Update Departemen Tanpa Mengubah Data (Edge Case)
1. **Navigasi:** Buka menu **Data Master -> Unit Kerja (Departemen)**.
2. **Aksi:** Klik tombol **"Edit"** pada departemen `Umum`.
3. **Input:** Jangan ubah teks apa pun di dalam form.
4. **Eksekusi:** Klik **"Simpan"**.
5. **Ekspektasi:** Data tersimpan tanpa error `Unique Constraint Violation` pada database.

---

## 2. Modul Master Barang (Item)
**Tujuan:** Memastikan *File Upload* (Gambar) dan relasi tertangani oleh DTO tanpa error.
**Login Sebagai:** Admin Gudang

### Test Case 2.1: Pembuatan Barang Lengkap dengan Foto (Positive)
1. **Navigasi:** Buka menu **Data Master -> Barang**.
2. **Aksi:** Klik **"Tambah Barang"**.
3. **Input:**
   - Kategori: Pilih `Bahan Kimia` (yang dibuat di Test Case 1.1)
   - Kode Barang: `KIM-001`
   - Nama Barang: `Alkohol 70%`
   - Satuan: `Botol`
   - Minimum Stok: `5`
   - Gambar: **Pilih file `.jpg` atau `.png`** (Maks 2MB).
4. **Eksekusi:** Klik **"Simpan"**.
5. **Ekspektasi:** 
   - Barang berhasil tersimpan dan gambar alkohol muncul di *thumbnail* tabel barang.

### Test Case 2.2: Update Barang Tanpa Upload Ulang Foto (Edge Case)
1. **Navigasi:** Buka menu **Data Master -> Barang**.
2. **Aksi:** Klik tombol **"Edit"** pada barang `Alkohol 70%`.
3. **Input:** 
   - Ubah Nama Barang menjadi: `Alkohol 70% 500ml`
   - **Biarkan kolom gambar KOSONG (jangan pilih file apa-apa)**.
4. **Eksekusi:** Klik **"Simpan"**.
5. **Ekspektasi:** 
   - Nama berubah menjadi `Alkohol 70% 500ml`.
   - **Gambar yang lama (di Test Case 2.1) TETAP ADA dan tidak hilang/menjadi broken image.** (Membuktikan `null` pada form tidak menimpa *path* database).

---

## 3. Modul Transaksi Inbound (Barang Masuk)
**Tujuan:** Memastikan tipe data kompleks (*Array of Arrays*) berhasil diproses oleh *TransactionDetailDTO* secara aman.
**Login Sebagai:** Admin Gudang

### Test Case 3.1: Penerimaan Multi-Barang (Positive)
1. **Navigasi:** Buka menu **Transaksi -> Barang Masuk**.
2. **Aksi:** Klik **"Tambah Barang Masuk"**.
3. **Input Header:**
   - Nomor Referensi: `INV-2023-1001`
   - Tanggal: Pilih tanggal hari ini.
4. **Input Detail:**
   - Klik **"Tambah Barang"**. Pilih `Alkohol 70%`, Qty: `20`, Harga Satuan: `15000`.
   - Klik **"Tambah Barang"** lagi. Pilih barang lain (misal: `Kertas A4`), Qty: `50`, Harga Satuan: `45000`.
5. **Eksekusi:** Klik **"Simpan"**.
6. **Ekspektasi:** 
   - Transaksi berhasil disimpan.
   - Pergi ke menu **Master -> Barang**. Cek stok `Alkohol 70%` pasti bertambah `20`, dan `Kertas A4` bertambah `50`.

### Test Case 3.2: Penerimaan Barang dengan Qty Minus (Negative)
1. **Navigasi:** Buka form **Barang Masuk**.
2. **Input:** Isi detail barang, lalu masukkan Qty: `-5` atau `0`.
3. **Eksekusi:** Klik **"Simpan"**.
4. **Ekspektasi:** Validasi form akan menolak aksi tersebut (Kuantitas minimal harus 1).

---

## 4. Modul Transaksi Outbound (Barang Keluar)
**Tujuan:** Menguji Pessimistic Locking (Pencegahan bentrok stok) dan DTO khusus persetujuan.

### Test Case 4.1: Alur Permintaan Normal (Staff -> Penyelia -> Admin)
1. **Login sebagai Staff:** Buka **Transaksi -> Pengajuan Barang**. Buat permintaan `Alkohol 70%` sebanyak `5`. Status awal adalah `Pending`.
2. **Login sebagai Penyelia:** Buka pengajuan tersebut. Klik **"Setujui (Approve)"**. Status berubah menjadi `Approved`.
3. **Login sebagai Admin Gudang:** Buka pengajuan yang di-approve. Klik **"Keluarkan Barang (Issue)"**.
   - *Cek Stok:* Sebelum diklik, stok adalah `20`. Setelah klik *Issue*, status menjadi `Siap Diambil`, stok `Alkohol 70%` di menu barang berubah menjadi `15` (berkurang 5).
4. **Sebagai Admin Gudang:** Klik **"Serahkan (Handover)"**.
5. **Login sebagai Staff:** Buka pengajuan, klik **"Konfirmasi Terima (Pickup)"**. Status menjadi `Completed`.

### Test Case 4.2: Pemotongan Stok Melebihi Ketersediaan (Negative)
1. **Login sebagai Admin Gudang.**
2. **Navigasi:** Buka menu **Transaksi -> Pengeluaran Langsung (Direct Request)**.
3. **Input:** 
   - Pemohon: Pilih sembarang staff.
   - Tambah barang `Alkohol 70%`. (Ingat: Stok sisa 15).
   - Masukkan Qty: `100`.
4. **Eksekusi:** Klik **"Simpan"**.
5. **Ekspektasi:** Sistem **wajib** memblokir proses ini dengan memunculkan error validasi warna merah: *"Stok Alkohol 70% tidak mencukupi. Tersedia: 15, dibutuhkan: 100"*. Sistem dilarang memberikan halaman error 500.

---

## 5. Modul Laporan Rekonsiliasi (Stock Opname)
**Tujuan:** Menguji logika `saveReconciliation` yang membandingkan qty sistem vs fisik.
**Login Sebagai:** Admin Gudang

### Test Case 5.1: Rekonsiliasi dengan Adjustment / Selisih (Positive/Edge)
1. **Navigasi:** Buka menu **Laporan -> Rekonsiliasi**.
2. **Input (Kondisi Gudang):** 
   - Pilih bulan berjalan.
   - Cari baris barang `Alkohol 70%`. Di kolom *System Qty* tertulis `15`. 
   - Ubah kolom *Physical Qty* menjadi `13` (karena 2 botol pecah di gudang).
   - Cari baris `Kertas A4`. *System Qty* `50`. Biarkan *Physical Qty* tetap `50`.
3. **Eksekusi:** Tulis catatan "2 Botol pecah", lalu klik **"Simpan Rekonsiliasi"**.
4. **Ekspektasi (Sangat Penting):**
   - **Tabel Barang:** Stok `Alkohol 70%` langsung ter-update menjadi `13` secara permanen. Stok `Kertas A4` tetap `50`.
   - **Kartu Stok:** Buka menu **Laporan -> Kartu Stok**, filter `Alkohol 70%`. Harus muncul 1 baris baru berjenis mutasi **"Adjustment"**, Referensi dokumen `RECON-...`, dengan nilai Qty Out = `2`, Ending Balance = `13`.
   - Pada Kartu Stok `Kertas A4`, **TIDAK BOLEH ADA** baris "Adjustment" dengan Qty 0.

---

## 6. Modul Profil Pengguna
**Tujuan:** Memastikan data pengguna ditangani aman oleh DTO khusus User.

### Test Case 6.1: Update Profil Standar (Positive)
1. **Navigasi:** Buka menu **Profil Saya**.
2. **Aksi:** Ubah nama Anda dari `Admin Gudang` menjadi `Admin Logistik Pusat`. Masukkan Nomor Telepon: `08123456789`.
3. **Eksekusi:** Klik **"Simpan"**.
4. **Ekspektasi:** Teks nama di pojok kanan atas layar seketika berubah menjadi `Admin Logistik Pusat`.

### Test Case 6.2: Kosongkan Data Opsional (Edge Case)
1. **Navigasi:** Di menu **Profil Saya**.
2. **Aksi:** Hapus isi dari kolom Nomor Telepon menjadi kosong melompong.
3. **Eksekusi:** Klik **"Simpan"**.
4. **Ekspektasi:** Data tersimpan tanpa error. DTO sukses mengonversi nilai kosong menjadi `null` di level database, memastikan tidak ada string `"null"` yang tercetak.

---

## Metodologi Penilaian Sukses (Acceptance Criteria)
Pengujian fase ini dianggap **SUKSES 100%** apabila:
1. Tidak ada satupun halaman yang berubah menjadi *halaman putih* atau memunculkan halaman error bawaan Laravel (*Whoops, something went wrong / Error 500*).
2. Segala bentuk kegagalan input tertangkap dengan *anggun* dalam bentuk **Pesan Error Validasi warna Merah** di bawah input form.
3. Seluruh Kartu Stok (*Stock Ledger*) merekam pergerakan In, Out, dan Adjustment secara matematis tanpa ada yang luput.
