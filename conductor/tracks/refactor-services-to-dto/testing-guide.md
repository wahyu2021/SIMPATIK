# Panduan Pengujian (Testing Guide) - Refaktor DTO

Dokumen ini disusun untuk menguji stabilitas aplikasi setelah proses transisi keseluruhan kode ke **Data Transfer Object (DTO)**. Oleh karena struktur yang menangkap input pengguna berubah secara fundamental, pengujian ini difokuskan pada pengujian interaksi pengguna terhadap *Controller* dan validasi *Service*.

Silakan ikuti langkah-langkah *test case* berikut secara berurutan.

---

## 1. Master Data Dasar (Kategori & Departemen)
Fokus: Menguji input teks biasa dan operasi CRUD paling mendasar.

### ✅ *Positive Cases* (Skenario Sukses)
- **Buat Data Baru:** Tambah kategori bernama `ATK Kantor` dan departemen `Keuangan`. Pastikan data tersimpan di tabel database.
- **Update Data:** Ubah nama kategori `ATK Kantor` menjadi `Alat Tulis Kantor`. Pastikan perubahannya tersimpan.

### ❌ *Negative & Edge Cases* (Skenario Gagal & Batas)
- **Kosongkan Input:** Klik "Simpan" tanpa mengisi nama kategori. Pastikan layar menampilkan pesan error dari *Form Request* (validasi Laravel).
- **Duplikasi Data:** Masukkan nama kategori yang sama persis jika aturan sistem menolaknya (jika *unique*).

---

## 2. Master Data Lanjutan (Pengguna & Barang/Item)
Fokus: Menguji penanganan relasi (Role, Department) dan *Upload* Berkas (Gambar).

### ✅ *Positive Cases*
- **Tambah User:** Buat *User* baru, assign ke departemen tertentu, dan berikan role (misal: *Staff*).
- **Tambah Barang:** Tambahkan barang baru (misal: "Kertas A4"), isi minimum stok, satuan, **dan upload foto barang**. Pastikan foto barang tersimpan di direktori (storage) dengan benar.

### ❌ *Negative & Edge Cases*
- **Update Tanpa Foto:** Edit barang "Kertas A4" dengan mengubah nama/deskripsi, tapi **biarkan form foto kosong**. Pastikan foto lama **tidak terhapus** dan nama berhasil diupdate (membuktikan DTO menghandle `null` file upload dengan benar).
- **Upload File Salah Tipe:** Saat tambah barang, unggah file `.pdf` ke kolom gambar barang. Sistem harus menolaknya.
- **Kosongkan Kolom Nullable:** Pada *User*, kosongkan field `Phone Number` (jika ada). Sistem harus berhasil menyimpannya sebagai `null` di database (bukan string `"null"`).

---

## 3. Transaksi Barang Masuk (Inbound)
Fokus: Menguji proses simpan transaksi *Master-Detail* (Banyak barang dalam 1 transaksi) dan perhitungan stok.

### ✅ *Positive Cases*
- **Multi-Item Input:** Buat 1 dokumen barang masuk yang memuat **3 barang berbeda** sekaligus. 
- **Cek Stok & Ledger:** Cek menu daftar barang, pastikan stok ketiga barang tersebut otomatis bertambah. Buka "Kartu Stok" untuk barang tersebut, pastikan tercatat ada *qty_in* dari nomor referensi yang baru dibuat.

### ❌ *Negative & Edge Cases*
- **Qty Nol/Minus:** Masukkan kuantitas `0` atau `-5` pada rincian barang masuk. Sistem harus menolaknya di level *Form Request*.
- **Tanpa Bukti Terima:** Buat barang masuk tanpa *upload receipt/bukti terima* (jika *nullable*). DTO harus bisa memprosesnya tanpa error *undefined index*.

---

## 4. Transaksi Barang Keluar (Outbound / Permintaan Barang)
Fokus: Menguji *Workflow* status pengajuan dan proteksi potong stok (Pessimistic Locking).

### ✅ *Positive Cases* (Alur Pengajuan Normal)
1. **(Login Staff):** Buat permintaan berisi "Buku Tulis" (Qty: 5). Status = `Pending`.
2. **(Login Penyelia):** Approve permintaan tersebut. Status = `Approved`.
3. **(Login Admin Gudang):** Lakukan proses *Issue* (Penyiapan) & *Handover* (Penyerahan). Pastikan stok "Buku Tulis" **berkurang 5**.
4. **(Login Staff):** Konfirmasi terima barang (*Pickup*). Status = `Completed`.

### ❌ *Negative & Edge Cases*
- **Minta Melebihi Stok:** Sebagai Staff, ajukan permintaan "Buku Tulis" sebanyak 10.000 (melebihi ketersediaan). Sistem tidak boleh error sistematis (500), tapi menolak dengan error validasi (422) "Stok tidak mencukupi".
- **Edit Pengajuan:** Sebagai Staff, ubah daftar barang pada pengajuan yang masih berstatus `Pending`. Pastikan daftar barang yang lama di-*replace* dengan yang baru secara akurat.
- **Pengeluaran Langsung (*Direct Issue*):** Sebagai Admin Gudang, buat "Pengeluaran Langsung". Transaksi ini mem-bypass persetujuan Penyelia. Pastikan stok langsung terpotong saat disubmit.

---

## 5. Laporan & Rekonsiliasi (Stock Opname)
Fokus: Menguji logika matematika dan DTO saat mengeksekusi sinkronisasi stok fisik vs sistem.

### ✅ *Positive Cases* (Ada Selisih)
- **Buat Rekonsiliasi:** Lakukan opname fisik untuk bulan berjalan. Misalkan stok sistem "Tinta Printer" adalah `10`, tapi fisik di gudang ternyata hanya `8`. Ubah physical qty menjadi `8`.
- **Eksekusi:** Simpan rekonsiliasi.
- **Cek Dampak:** 
  1. Stok "Tinta Printer" kini harus menjadi `8`.
  2. Buka Kartu Stok, harus ada mutasi tercatat sebagai "Adjustment" dengan *qty_out* sebesar `2`.

### ❌ *Negative & Edge Cases* (Tanpa Selisih)
- **Fisik = Sistem:** Lakukan rekonsiliasi bulan berikutnya. Biarkan nilai fisik = nilai sistem (tidak ada selisih).
- **Cek Dampak:** Simpan dokumen. Pastikan stok tetap, dan **tidak ada baris kosong "Adjustment"** dengan qty 0 di Kartu Stok.

---

## 6. Profil & Akun Pengguna
Fokus: Menguji proteksi session *Auth* dan DTO sederhana.

### ✅ *Positive Cases*
- **Ganti Nama/Email:** Ubah profil nama dan email Anda.
- **Ganti Password:** Lakukan pengubahan password, log-out, dan log-in kembali dengan password baru.

### ❌ *Negative & Edge Cases*
- **Email Duplikat:** Ubah email profil Anda menjadi email milik pengguna lain yang sudah ada di sistem. Validasi harus menolak.
- **Upload Signature (TTD):** Upload tanda tangan digital (berbasis base64 dari kanvas HTML). Pastikan TTD tersebut ter-update dan tampil saat meng-export dokumen PDF (BAST / SPB).
