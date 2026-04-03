# Modul Sistem — SIMPATIK

### 1. Modul Keamanan & Manajemen Akses (*Security & Access*)

*Modul ini mengatur keamanan pintu masuk dan rekam jejak digital aplikasi.*

* **Autentikasi Multi-Peran:** Akses masuk sistem terbagi untuk 4 role:
  - **Admin Gudang** (`warehouse_admin`) — full access, superadmin sistem
  - **Staff Bagian Umum** (`general_affairs`) — audit & approve pengajuan, kelola transaksi gudang
  - **Pimpinan** (`division_head`) — view dashboard, laporan, & forecasting
  - **Staf Unit Kerja** (`staff`) — ajukan barang, lihat pengajuan per divisi sendiri
* **Mandatory Signature Onboarding:** Setiap pengguna yang baru pertama kali *login* diwajibkan menggambar dan menyimpan tanda tangan digital di profil sebelum bisa menggunakan fitur lain. Menggunakan plugin `saade/filament-autograph`.
* **Digital Audit Trail:** Sistem secara permanen mencatat IP Address, nama user, dan timestamp setiap kali ada aktivitas pengajuan atau persetujuan barang.

### 2. Modul Data Induk (*Master Data*)

*Pusat informasi barang dan struktur organisasi.*

* **Kelola Data Barang & Kategori:** Nama Barang, Harga Satuan, Kategori, dan Stok Minimum.
* **Kelola Data Unit Kerja:** Daftar unit di kantor cabang A. Rivai (Unit KSG, Teller, CS, dll).
* **Kelola Pengguna (User Management):** Admin mengelola semua akun pegawai, mengatur role, dan memantau status tanda tangan digital.

### 3. Modul Transaksi Gudang (*Warehouse Transaction & Approval*)

*Alur kerja: Staf mengajukan → Staff Bagian Umum / Admin Gudang meng-approve.*

* **Penerimaan Barang (Inbound):** Admin/Staff Bagian Umum mencatat stok masuk dari vendor atau pusat beserta nomor surat jalannya.
* **Portal Pengajuan Barang (Self-Service Request):** Staf dari divisi lain login ke sistem, memilih barang via keranjang/repeater. Pengajuan masuk ke antrean dengan status *"Pending"*.
* **Sistem Persetujuan (Approval By System):** Staff Bagian Umum / Admin Gudang mengecek ketersediaan stok, lalu menekan tombol **"Setujui"**. Status berubah otomatis dan stok berkurang.
* **Cetak Berita Acara (Automated SPB/BAST Generator):** Tombol "Cetak" menghasilkan dokumen PDF berisi:
    * Daftar barang dan jumlahnya.
    * Tanda tangan digital si Peminta dan Approver (ditarik otomatis dari database profil).
    * **QR Code & Pernyataan Sistem:** Teks validasi *"Dokumen ini telah diotorisasi secara elektronik oleh sistem"*.

### 4. Modul Pelaporan & Mutasi (*Reporting*)

*Menggantikan rekapitulasi manual di akhir bulan.*

* **Laporan Mutasi Barang (Ledger):** Kartu stok digital (Saldo Awal + Masuk - Keluar = Saldo Akhir).
* **Export Laporan Berstandar:** Unduh laporan ke format Excel atau PDF sesuai standar pelaporan internal Bank Sumsel Babel.

### 5. Modul Peramalan Cerdas (*Intelligent Forecasting - XGBoost*)

*Fitur unggulan berbasis kecerdasan buatan. Menggunakan microservice Python terpisah.*

* **Dashboard Prediksi Kebutuhan:** Model XGBoost via API Python memprediksi jumlah ATK/Formulir yang harus dipesan bulan depan berdasarkan data historis mutasi.
* **Saran Pemesanan Otomatis:** Sistem menghitung (Prediksi XGBoost - Sisa Stok Saat Ini) untuk merekomendasikan jumlah pengadaan.

### 6. Modul Dashboard Analitik & Peringatan (*Analytics & Alerts*)

* **Visualisasi Tren:** Grafik batang/garis menampilkan barang paling sering diminta dan divisi paling konsumtif.
* **Low Stock Alert:** Notifikasi real-time di panel admin jika stok menyentuh batas minimum.