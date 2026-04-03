### **1. Modul Keamanan & Manajemen Akses (*Security & Access*)**

*Modul ini mengatur keamanan pintu masuk dan rekam jejak digital aplikasi.*

* **Autentikasi Multi-Peran:** Akses masuk sistem tidak lagi hanya untuk Admin Gudang, melainkan terbagi untuk **Admin Gudang**, **Pimpinan**, dan **Staf Unit Kerja** (sebagai peminta barang).
* **Mandatory Signature Onboarding:** Fitur pemaksaan (intersepsi) di mana setiap pengguna yang baru pertama kali *login* diwajibkan untuk menggambar dan menyimpan tanda tangan digital mereka di profil sebelum bisa menggunakan fitur lain.
* **Digital Audit Trail:** Sistem secara permanen mencatat IP *Address*, nama *user*, dan *timestamp* (waktu spesifik) setiap kali ada aktivitas pengajuan atau persetujuan barang.

### **2. Modul Data Induk (*Master Data*)**

*Pusat informasi barang dan struktur organisasi.*

* **Kelola Data Barang & Kategori:** Mencakup Nama Barang (seperti Form KSG R-2), Harga Satuan, Kategori Barang, dan Stok Minimum.
* **Kelola Data Unit Kerja:** Daftar unit di kantor cabang A. Rivai (Unit KSG, Teller, CS, dll).
* **Kelola Pengguna (User Management):** Menggantikan manajemen "Penjaga Gudang". Admin mengelola semua akun pegawai yang berhak menggunakan sistem, mengatur *role* (hak akses), dan memantau status tanda tangan digital masing-masing akun.

### **3. Modul Transaksi Gudang (*Warehouse Transaction & Approval*)**

*(Catatan: Ini adalah modul yang paling banyak berubah dari draf awal. Alurnya tidak lagi Admin yang menginput semuanya, melainkan Staf yang meminta).*

* **Penerimaan Barang (Inbound):** Admin mencatat stok masuk dari vendor atau pusat beserta nomor surat jalannya.
* **Portal Pengajuan Barang (Self-Service Request):** Staf dari divisi lain *login* ke sistem dan memilih barang yang ingin diambil menggunakan fitur keranjang/repeater. Pengajuan ini akan masuk ke antrean Admin dengan status *"Pending"*.
* **Sistem Persetujuan (Approval By System):** Admin Gudang mengecek ketersediaan stok di layar, lalu cukup menekan tombol **"Setujui"**. Otomatis status berubah dan stok berkurang.
* **Cetak Berita Acara (Automated SPB/BAST Generator):** Tombol "Cetak" akan menghasilkan dokumen PDF yang sah, berisi:
    * Daftar barang dan jumlahnya.
    * Tanda tangan digital si Peminta dan Admin (yang ditarik otomatis dari *database* profil).
    * **QR Code & Pernyataan Sistem:** Teks validasi di bawah dokumen yang menyatakan bahwa *"Dokumen ini telah diotorisasi secara elektronik oleh sistem"*, menghilangkan kebutuhan tanda tangan basah manual.

### **4. Modul Pelaporan & Mutasi (*Reporting*)**

*Menggantikan rekapitulasi manual di akhir bulan.*

* **Laporan Mutasi Barang (Ledger):** Mengolah data persetujuan menjadi kartu stok (Saldo Awal + Masuk - Keluar = Saldo Akhir).
* **Export Laporan Berstandar:** Fitur untuk mengunduh laporan ke format Excel atau PDF sesuai dengan standar pelaporan internal Bank Sumsel Babel.

### **5. Modul Peramalan Cerdas (*Intelligent Forecasting - XGBoost*)**

*Fitur unggulan berbasis kecerdasan buatan.*

* **Dashboard Prediksi Kebutuhan:** Menggunakan model *Machine Learning* XGBoost via API Python untuk memprediksi jumlah ATK/Formulir yang harus dipesan bulan depan berdasarkan data historis mutasi barang.
* **Saran Pemesanan Otomatis:** Sistem secara pintar akan menghitung (Angka Prediksi XGBoost - Sisa Stok Saat Ini) untuk merekomendasikan jumlah pengadaan barang secara akurat dan efisien.

### **6. Modul Dashboard Analitik & Peringatan (*Analytics & Alerts*)**

* **Visualisasi Tren:** Grafik batang/garis yang menampilkan barang apa yang paling sering diminta dan divisi mana yang paling konsumtif.
* **Low Stock Alert:** Notifikasi *real-time* di panel admin jika ada barang cetakan yang stoknya menyentuh batas minimum, mencegah kehabisan stok kritis di tengah operasional bank.