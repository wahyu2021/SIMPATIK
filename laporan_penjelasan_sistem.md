# Bab 4 Hasil dan Pembahasan

## 4.1 Tinjauan Umum Instansi
*(Catatan: Bab 4.1 dibiarkan sesuai struktur jika sebelumnya ada pembahasan mengenai Tinjauan Umum Instansi, jika tidak, langsung masuk ke 4.2)*

## 4.2 Pelaksanaan Kegiatan Kerja Praktik

Kegiatan penelitian dan pengembangan sistem (Kerja Praktik) ini dilaksanakan di Kantor PT. Bank Pembangunan Daerah Sumatera Selatan dan Bangka Belitung (Bank Sumsel Babel) Cabang Utama Kapten A. Rivai. Kegiatan ini berlangsung selama kurang lebih lima bulan, terhitung mulai dari bulan Februari 2026 sampai dengan bulan Juni 2026. Selama kerja praktik, penulis melakukan observasi langsung, merancang, hingga mengimplementasikan Sistem Manajemen Persediaan Terpadu (SIMPATIK).

## 4.3 Tahap Penyelidikan Awal

Pada penyelidikan awal, penulis mengamati tentang apa yang dibutuhkan dan diharapkan dari sistem pengelolaan persediaan Alat Tulis Kantor (ATK) ini. Oleh karena itu penulis bermaksud untuk Rancang Bangun **Sistem Manajemen Persediaan Terpadu (SIMPATIK)** yang berbasis website dengan ketentuan yang tertera di bawah ini:

1. Sistem informasi ini dirancang sebagai sebuah sistem berbasis website. Sistem ini dirancang dan dibangun untuk mendukung tujuan utama yaitu memfasilitasi pengelolaan administrasi barang masuk (inbound) dan permintaan barang keluar (outbound) secara digital pada lingkungan PT. Bank Pembangunan Daerah Sumatera Selatan dan Bangka Belitung (Bank Sumsel Babel) Cabang Utama Kapten A. Rivai. Melalui sistem informasi ini, diharapkan proses distribusi ATK, mutasi stok, persetujuan berjenjang, hingga pelaporan menjadi lebih efisien, terstruktur, dan transparan serta meminimalisir penggunaan kertas (*paperless*).
2. Sistem informasi ini dirancang untuk dapat diakses oleh empat jenis pengguna (user) yang memiliki peran (role) berbeda sesuai dengan otoritasnya:
   1. Pertama, **Admin Gudang**, yaitu peran yang bertugas mengelola sistem secara keseluruhan, mencatat barang masuk dari vendor, memproses pengeluaran barang fisik, menyerahkan barang ke staf, serta mengelola data master (Barang, Kategori, Departemen).
   2. Kedua, **Penyelia (Division Head)**, yaitu peran pimpinan unit kerja yang memiliki wewenang untuk memberikan persetujuan (approval) atau penolakan (rejection) terhadap pengajuan ATK yang dilakukan oleh staf di unit kerjanya.
   3. Ketiga, **Staff Unit Kerja**, yaitu peran peminta yang bertugas membuat formulir permintaan ATK secara digital dan melakukan konfirmasi tanda terima barang di akhir alur operasional.
   4. Keempat, **Bagian Umum (GA)**, yaitu peran manajemen yang bertugas melakukan fungsi *monitoring* serta mengekspor laporan mutasi (*Stock Ledger*) ke dalam wujud dokumen fisik/digital.
3. Sistem informasi ini juga dilengkapi dengan integrasi **WhatsApp Gateway** yang berfungsi untuk memberikan pemberitahuan secara *real-time* ke ponsel cerdas pengguna.

### 4.3.1 Analisis Masalah pada Sistem Lama

Berdasarkan pengamatan terhadap alur kerja yang berjalan, pengelolaan persediaan ATK saat ini menghadapi kendala dikarenakan belum terintegrasi secara digital. Beberapa permasalahan utama yang teridentifikasi pada sistem lama meliputi:

1. **Proses Permintaan dan Persetujuan Manual yang Lambat**
   Permintaan ATK masih menggunakan formulir kertas yang harus dicetak, diisi manual, lalu dibawa ke meja pimpinan unit kerja untuk ditandatangani basah. 
2. **Tidak Akuratnya Data Kartu Stok (Ledger)**
   Pencatatan keluar-masuk barang oleh admin gudang masih menggunakan kartu stok fisik. Hal ini rentan terhadap kesalahan manusia (*human error*).
3. **Tidak Adanya Notifikasi dan Kejelasan Status**
   Pada sistem manual, staf yang mengajukan permintaan sering kali tidak mengetahui progres pesanan mereka.

### 4.3.2 Usulan Pemecahan Masalah

Untuk mengatasi permasalahan tersebut, penulis mengusulkan Rancang Bangun Sistem Informasi SIMPATIK berbasis website. Solusi ini dirancang untuk melakukan transformasi digital pada manajemen persediaan dengan rincian sebagai berikut:

1. **Sistem Berbasis Website untuk Aksesibilitas**
   Sistem dirancang menggunakan arsitektur *Single Page Application* (SPA).
2. **Manajemen Pengguna Berdasarkan Otoritas (Role-Based)**
   Sistem membagi hak akses menjadi empat peran utama.
3. **Fitur Notifikasi WhatsApp Real-Time**
   Notifikasi dikirimkan instan agar koordinasi berjalan cepat.
4. **Digitalisasi Dokumen dan Persetujuan Berlapis**
   Seluruh formulir kertas ditiadakan dan diganti menjadi format digital berbasis PDF yang dicetak sistem.

### 4.3.3 Tata Cara Pemakaian Sistem
Tata cara atau alur kerja umum yang diterapkan dalam penggunaan aplikasi SIMPATIK adalah:
1. **Proses Autentikasi (Login)**.
2. **Pengajuan Barang** (Staff Unit Kerja).
3. **Proses Disposisi/Persetujuan** (Penyelia).
4. **Penyiapan dan Pemotongan Stok** (Admin Gudang).
5. **Konfirmasi Penerimaan** (Staff Unit Kerja).
6. **Pelaporan dan Rekonsiliasi** (Bagian Umum/Admin).

## 4.4 Studi Kelayakan

Dalam penulisan rancang bangun ini, penulis mempertimbangkan beberapa faktor studi kelayakan untuk memastikan bahwa sistem baru jauh lebih unggul dan efisien dibandingkan sistem lama.

**Tabel 4.1 Perbandingan Studi Kelayakan**
| Faktor Kelayakan | Sistem Lama (Manual) | Sistem Baru (SIMPATIK) |
| --- | --- | --- |
| **Kelayakan Teknis** | Proses otorisasi ATK bergantung pada perpindahan formulir fisik secara berjenjang. Harus mencari keberadaan pimpinan untuk mendapatkan tanda tangan basah. | Dengan sistem baru, seluruh proses didigitalisasi dengan sistem persetujuan digital berlapis berbasis peran (*Role-Based Access*). Sistem dihubungkan dengan integrasi WhatsApp untuk memberikan *push notification* instan. |
| **Kelayakan Operasi** | Admin gudang mencatat mutasi barang keluar-masuk di buku besar (*Kartu Stok*) dan menghitung persediaan akhir satu-persatu secara berkala. | Sistem secara terpusat dan otomatis merekam setiap perpindahan barang ke dalam tabel *Stock Ledger*. Saldo diperbarui secara *real-time*. Pelaporan operasional dapat diunduh (eksport) oleh manajemen kapan saja. |
| **Kelayakan Ekonomi** | Biaya operasional tinggi karena penggunaan kertas (formulir, kartu stok) dan efisiensi waktu pegawai yang rendah. | Pengurangan biaya cetak kertas dan peningkatan efisiensi waktu, mempercepat proses operasional perusahaan. |

## 4.5 Alat dan Bahan

Untuk dapat menghasilkan aplikasi ini dibutuhkan komponen-komponen komputer yang menjadi alat bantu. Adapun alat dan bahan yang dibutuhkan dalam pembuatan sistem informasi ini, sebagai berikut:

### 4.5.1 Alat
1. **Perangkat Lunak (Software):**
   - Sistem Operasi: Microsoft Windows 11.
   - Database Management System: MySQL (via Laragon).
   - Text Editor: Antigravity IDE / Visual Studio Code.
   - Web Server: Nginx / Artisan Serve.
   - Backend Framework: Laravel (PHP).
   - Frontend Framework: React.js (TypeScript) melalui *bundler* Vite.
   - Microservice: Node.js (Library Baileys) untuk pemrosesan pesan masuk-keluar *WhatsApp Gateway*.
2. **Perangkat Keras (Hardware):**
   Perangkat keras yang digunakan untuk pengembangan adalah Komputer jinjing (Laptop) Acer Nitro V15 dengan spesifikasi:
   - Processor: AMD Ryzen 5 6600H with Radeon Graphics (3.30 GHz).
   - RAM: 16 GB.
   - Penyimpanan: 512 GB SSD.
   - Kartu Grafis: NVIDIA GeForce RTX 3050 6GB Laptop GPU.

### 4.5.2 Bahan
Adapun bahan yang digunakan dalam menyusun laporan dan sistem ini adalah:
1. Data sampel/simulasi (dummy) mengenai nama-nama master ATK bank beserta batas stok minimum peringatannya.
2. Struktur organisasi (Departemen) Bank Sumsel Babel untuk pengaturan hierarki relasi Penyelia dan Staf Unit Kerja.
3. Contoh format fisik form pengajuan Surat Permintaan Barang (SPB) dan Berita Acara Serah Terima (BAST) untuk dikonversi menjadi berkas *template* PDF dinamis.

## 4.6 Perancangan Sistem

Dalam perancangan sistem dilakukan pemodelan berorientasi objek dengan menggunakan UML (*Unified Modeling Language*), yang terdiri dari *Use Case Diagram*, *Activity Diagram*, *Sequence Diagram*, dan *Class Diagram* yang akan menggambarkan perilaku dari sistem, serta menggunakan pemodelan ERD yang akan menggambarkan struktur data dalam sistem.

Metode yang digunakan dalam membangun aplikasi ini adalah metode **Agile**. Metode ini dipilih karena sifatnya yang iteratif, fleksibel, dan adaptif terhadap perubahan kebutuhan. Tahapan yang dilaksanakan dalam siklus Agile pada penelitian ini meliputi:
1. **Perencanaan (Planning & Requirement):** Mengumpulkan *Product Backlog* melalui observasi.
2. **Perancangan (Design):** Mendesain purwarupa antarmuka dan basis data logis.
3. **Pengembangan (Development):** Menulis baris kode program secara menyeluruh.
4. **Pengujian (Testing):** Melakukan pengujian fungsionalitas (*Black Box Testing*).
5. **Evaluasi dan Peninjauan (Review & Retrospective):** Mempresentasikan purwarupa untuk mendapat umpan balik.

Untuk mencapai suatu tujuan yang diinginkan dalam perancangan yang baru, maka diperlukan suatu rancangan dengan langkah-langkah sebagai berikut:
1. Menentukan masalah yang ada dan menentukan apa saja fitur-fitur yang dibutuhkan (seperti Autentikasi, Manajemen Stok, Persetujuan Berjenjang, Notifikasi WhatsApp).
2. Merancang struktur data dengan menggunakan pemodelan UML.

## 4.7 Perancangan Diagram

Perancangan diagram UML sistem ini dijabarkan sebagai berikut:

### 4.7.1 Use Case Diagram
Use Case Diagram menggambarkan fungsionalitas sistem dari perspektif aktor dan bentuk interaksinya dengan lingkungan SIMPATIK.

**(Gambar 4.1 Use Case Diagram terlampir di lembar desain sistem)**

Secara spesifik, sistem yang bekerja dan Aktor yang diperlukan terhadap *use case* dapat dideskripsikan sebagai berikut:

a. Definisi Aktor

Tabel 4.3 Definisi Aktor
| No. | Aktor | Keterangan |
| --- | --- | --- |
| 1. | Bagian Umum | Bertugas mengelola pengaturan sistem, data master, akun pengguna, memonitoring laporan, serta log audit (audit trail). |
| 2. | Admin Gudang | Bertugas melakukan operasional gudang seperti menyetujui penyiapan barang, menyerahkan barang, mencetak dokumen, dan membuat permintaan langsung. |
| 3. | Penyelia (Division Head) | Memiliki seluruh hak akses Staff dengan tambahan fitur untuk memverifikasi (approve/reject) pengajuan permintaan barang staf. |
| 4. | Staff Unit Kerja | Bertugas login untuk mengajukan permintaan barang, melakukan konfirmasi serah terima barang, dan mencetak dokumen. |

b. Definisi Use Case

Tabel 4.4 Definisi Use Case
| No. | Use Case | Keterangan |
| --- | --- | --- |
| 1. | Login | Autentikasi untuk membedakan hak akses (*role*) setiap aktor setelah berhasil masuk. |
| 2. | Mengelola Data Master | Mengelola data utama (Barang, Kategori, Departemen) dengan penandaan hapus sementara (*soft delete*). |
| 3. | Menginput Barang Masuk | Mencatat barang dari vendor beserta lampiran bukti transaksi. |
| 4. | Mengelola Pengguna | Mengelola akun; hapus dicegah bila pengguna memiliki riwayat transaksi. |
| 5. | Melihat Audit Trail Digital| Meninjau log aktivitas (sebelum dan sesudah) perubahan data. |
| 6. | Mengelola Pengaturan Sistem | Menyimpan konfigurasi dasar atau nilai (*value*) pengaturan aplikasi saat ini. |
| 7. | Melihat Laporan & Rekonsiliasi| Membuat laporan umum PDF/Excel dan input penyesuaian stok (rekonsiliasi fisik vs sistem). |
| 8. | Mengajukan Permintaan Barang | Proses permintaan barang oleh pemohon (Staff menjadi Pending, Penyelia otomatis Approved). |
| 9. | Mengonfirmasi Serah Terima Barang | Admin menyerahkan fisik barang, lalu pemohon mengonfirmasi penerimaan secara sistem. |
| 10. | Cetak Dokumen Transaksi | Cetak PDF Surat SPB dan BAST (BAST hanya setelah barang diserah-terimakan). |
| 11. | Verifikasi Permintaan Barang | Peninjauan (Approve/Reject) oleh Penyelia atas permintaan Staff. |
| 12. | Membuat Permintaan Langsung | Admin Gudang mengeluarkan barang secara langsung tanpa verifikasi Penyelia. |
| 13. | Menyetujui Permintaan Barang | Admin Gudang mengesahkan dokumen status *Approved* untuk proses penyiapan pemotongan fisik. |
| 14. | Melihat Data Barang | Memantau daftar sisa data stok beserta notifikasi jika status stok kritis (minim). |

### 4.7.2 Activity Diagram
Activity Diagram membedah proses bisnis menjadi kotak alur berkelanjutan berdasar *swimlane* para aktor. Pada sistem SIMPATIK, aktivitas operasional dirincikan ke dalam empat belas proses utama sesuai dengan *Use Case* yang ada:

a. Activity Diagram Login
Activity Diagram Login merupakan proses autentikasi yang membedakan hak akses (*role*) setiap aktor setelah berhasil login.

Gambar 4.2 Activity Diagram Login

b. Activity Diagram Mengelola Data Master
Activity Diagram Mengelola Data Master merupakan proses pengelolaan data master oleh Bagian Umum, termasuk penandaan penghapusan sementara (*soft delete*).

Gambar 4.3 Activity Diagram Mengelola Data Master

c. Activity Diagram Menginput Barang Masuk
Activity Diagram Menginput Barang Masuk merupakan proses pencatatan barang dari vendor, dengan kewajiban melampirkan bukti transaksi.

Gambar 4.4 Activity Diagram Menginput Barang Masuk

d. Activity Diagram Mengelola Pengguna
Activity Diagram Mengelola Pengguna merupakan proses pengelolaan akun pengguna. Penghapusan akan dicegah jika pengguna sudah memiliki riwayat transaksi.

Gambar 4.5 Activity Diagram Mengelola Pengguna

e. Activity Diagram Melihat Audit Trail Digital
Activity Diagram Melihat Audit Trail Digital merupakan proses melihat log aktivitas beserta detail perubahan data sebelum dan sesudahnya.

Gambar 4.6 Activity Diagram Melihat Audit Trail Digital

f. Activity Diagram Mengelola Pengaturan Sistem
Activity Diagram Mengelola Pengaturan Sistem merupakan proses menyimpan konfigurasi dasar yang menampilkan nilai (*value*) pengaturan saat ini.

Gambar 4.7 Activity Diagram Mengelola Pengaturan Sistem

g. Activity Diagram Melihat Laporan & Rekonsiliasi
Activity Diagram Melihat Laporan & Rekonsiliasi merupakan proses membuat laporan umum dan melakukan input rekonsiliasi stok fisik versus sistem.

Gambar 4.8 Activity Diagram Melihat Laporan & Rekonsiliasi

h. Activity Diagram Mengajukan Permintaan Barang
Activity Diagram Mengajukan Permintaan Barang merupakan proses permintaan barang dari Staff (butuh persetujuan) berbeda dengan Penyelia (otomatis disetujui).

Gambar 4.9 Activity Diagram Mengajukan Permintaan Barang

i. Activity Diagram Mengonfirmasi Serah Terima Barang
Activity Diagram Mengonfirmasi Serah Terima Barang merupakan proses dua arah: Admin Gudang menyerahkan, kemudian Pemohon mengonfirmasi penerimaan secara fisik.

Gambar 4.10 Activity Diagram Mengonfirmasi Serah Terima Barang

j. Activity Diagram Cetak Dokumen Transaksi
Activity Diagram Cetak Dokumen Transaksi merupakan proses pencetakan di mana Surat Permintaan Barang (SPB) dapat dicetak di awal, tetapi Berita Acara Serah Terima (BAST) baru bisa dicetak setelah serah terima selesai.

Gambar 4.11 Activity Diagram Cetak Dokumen Transaksi

k. Activity Diagram Verifikasi Permintaan Barang
Activity Diagram Verifikasi Permintaan Barang merupakan proses peninjauan oleh Penyelia terhadap pengajuan dari Staff. Bisa disesuaikan jumlah atau ditolak dengan alasan.

Gambar 4.12 Activity Diagram Verifikasi Permintaan Barang

l. Activity Diagram Membuat Permintaan Langsung
Activity Diagram Membuat Permintaan Langsung merupakan aktivitas admin gudang mengeluarkan barang tanpa melalui alur verifikasi penyelia (potong stok langsung).

Gambar 4.13 Activity Diagram Membuat Permintaan Langsung

m. Activity Diagram Menyetujui Permintaan Barang
Activity Diagram Menyetujui Permintaan Barang merupakan tindakan Admin Gudang untuk benar-benar mengeluarkan stok dari pengajuan yang sudah disetujui (*Approved*).

Gambar 4.14 Activity Diagram Menyetujui Permintaan Barang

n. Activity Diagram Melihat Data Barang
Activity Diagram Melihat Data Barang merupakan aktivitas pemantauan data stok oleh Admin Gudang dengan ketersediaan fitur filter khusus peringatan stok minim.

Gambar 4.15 Activity Diagram Melihat Data Barang

### 4.7.3 Sequence Diagram
Sequence Diagram memodelkan urutan interaksi antar objek dan pemanggilan *method* dari *View* (Inertia.js), ke *Controller*, *Service*, hingga ke *Model* (MVC-S). 

a) Sequence Diagram Login
Sequence Diagram Login merupakan proses autentikasi dasar untuk membedakan hak akses (*role*) setiap aktor setelah berhasil login.

b) Sequence Diagram Mengelola Data Master
Sequence Diagram Mengelola Data Master merupakan proses pengelolaan data master oleh Bagian Umum, termasuk penandaan penghapusan sementara (*soft delete*).

c) Sequence Diagram Menginput Barang Masuk
Sequence Diagram Menginput Barang Masuk merupakan proses pencatatan barang dari vendor, dengan kewajiban melampirkan bukti transaksi.

d) Sequence Diagram Mengelola Pengguna
Sequence Diagram Mengelola Pengguna merupakan proses pengelolaan akun pengguna, di mana penghapusan akan dicegah jika pengguna sudah memiliki riwayat transaksi.

e) Sequence Diagram Melihat Audit Trail Digital
Sequence Diagram Melihat Audit Trail Digital merupakan proses pemanggilan data log aktivitas beserta detail perubahan data sebelum dan sesudahnya.

f) Sequence Diagram Mengelola Pengaturan Sistem
Sequence Diagram Mengelola Pengaturan Sistem merupakan proses memvalidasi dan menyimpan konfigurasi nilai pengaturan aplikasi saat ini.

g) Sequence Diagram Melihat Laporan & Rekonsiliasi
Sequence Diagram Melihat Laporan & Rekonsiliasi merupakan proses membuat laporan umum serta perhitungan selisih input rekonsiliasi stok fisik versus sistem.

h) Sequence Diagram Mengajukan Permintaan Barang
Sequence Diagram Mengajukan Permintaan Barang merupakan proses permintaan barang yang membedakan rute otomatis bagi staf dan penyelia.

i) Sequence Diagram Mengonfirmasi Serah Terima Barang
Sequence Diagram Mengonfirmasi Serah Terima Barang merupakan proses dua arah ketika Admin Gudang menyerahkan fisik barang lalu pemohon mengonfirmasi penerimaan secara sistem.

j) Sequence Diagram Cetak Dokumen Transaksi
Sequence Diagram Cetak Dokumen Transaksi merupakan proses pencetakan luaran (*output*) berupa PDF Surat Permintaan Barang (SPB) dan Berita Acara (BAST).

k) Sequence Diagram Verifikasi Permintaan Barang
Sequence Diagram Verifikasi Permintaan Barang merupakan proses peninjauan oleh Penyelia terhadap pengajuan dari staf untuk disesuaikan atau ditolak.

l) Sequence Diagram Membuat Permintaan Langsung
Sequence Diagram Membuat Permintaan Langsung merupakan aktivitas pemotongan ketersediaan stok riil secara *bypass* oleh Admin Gudang tanpa verifikasi penyelia.

m) Sequence Diagram Menyetujui Permintaan Barang
Sequence Diagram Menyetujui Permintaan Barang merupakan tindakan verifikasi akhir ketersediaan stok fisik barang berstatus disetujui (*Approved*) untuk dieksekusi potong stok oleh Admin Gudang.

n) Sequence Diagram Melihat Data Barang
Sequence Diagram Melihat Data Barang merupakan proses pemanggilan kueri dari pangkalan data barang beserta penerapan filter khusus batas peringatan stok kritis.

### 4.7.4 Class Diagram
Class diagram SIMPATIK memvisualisasikan arsitektur keterikatan logis dan relasi kardinalitas (seperti *1-to-Many* atau *Pivot*) antar entitas (*Model*). 

**(Gambar 4.4 Class Diagram terlampir di lembar desain sistem)**

Entitas yang digambarkan mencakup:
- **Pengguna & Akses:** `User`, `Role`, `Permission`, dan `ActivityLog`.
- **Katalog:** `Category`, `Item`, `Department`.
- **Transaksional:** `InboundTransaction`, `InboundTransactionDetail`, `OutboundTransaction`, `OutboundTransactionDetail`, `StockLedger`, `DemandForecast`.
- **Laporan & Lainnya:** `StockReconciliation`, `StockReconciliationDetail`, dan `Setting`.

## 4.8 Dasar Logika

### 4.8.1 Kamus Data dan Tabel Desain

Kamus data digunakan untuk menjabarkan karakteristik tipe data *field* yang terdapat di dalam tabel penyimpanan utama (*Core Business Tables*) sistem SIMPATIK.

**1. Tabel `users`**
Menampung profil pengguna, kredensial, dan otorisasi.

| No | Nama Field | Tipe Data | Ukuran | Keterangan |
| -- | --- | --- | --- | --- |
| 1 | id | Bigint | 20 | Primary Key, Auto_Increment |
| 2 | name | Varchar | 255 | Nama Lengkap Pengguna |
| 3 | email | Varchar | 255 | Alamat Email (Unique) |
| 4 | phone_number | Varchar | 50 | Kontak WhatsApp |
| 5 | password | Varchar | 255 | Kata sandi terenkripsi (Hash) |
| 6 | signature_path| Varchar | 255 | Lokasi file *png* Tanda Tangan |
| 7 | department_id | Bigint | 20 | Foreign Key -> tabel departments |

**2. Tabel `departments`**
Menampung data unit kerja atau cabang.

| No | Nama Field | Tipe Data | Ukuran | Keterangan |
| -- | --- | --- | --- | --- |
| 1 | id | Bigint | 20 | Primary Key, Auto_Increment |
| 2 | name | Varchar | 255 | Nama Unit Kerja |

**3. Tabel `categories`**
Katalog pengelompokkan jenis barang.

| No | Nama Field | Tipe Data | Ukuran | Keterangan |
| -- | --- | --- | --- | --- |
| 1 | id | Bigint | 20 | Primary Key, Auto_Increment |
| 2 | name | Varchar | 255 | Nama Kategori (Cth: Kertas, Tinta) |

**4. Tabel `items`**
Katalog data barang ATK beserta ambang batas stok (*minimum_stock_level*).

| No | Nama Field | Tipe Data | Ukuran | Keterangan |
| -- | --- | --- | --- | --- |
| 1 | id | Bigint | 20 | Primary Key, Auto_Increment |
| 2 | item_code | Varchar | 50 | Kode identifikasi barang |
| 3 | name | Varchar | 255 | Label nama barang |
| 4 | unit_of_measure| Varchar | 50 | Kotak/Rim/Buah/Lusin |
| 5 | current_stock | Int | 11 | Persediaan faktual saat ini |
| 6 | minimum_stock_level| Int | 11 | Ambang batas peringatan stok |
| 7 | category_id | Bigint | 20 | Foreign Key -> tabel categories |

**5. Tabel `inbound_transactions`**
Pencatatan riwayat dokumen penerimaan barang masuk dari Vendor.

| No | Nama Field | Tipe Data | Ukuran | Keterangan |
| -- | --- | --- | --- | --- |
| 1 | id | Bigint | 20 | Primary Key, Auto_Increment |
| 2 | user_id | Bigint | 20 | Foreign Key -> tabel users (Admin) |
| 3 | reference_number| Varchar | 255 | Nomor Referensi/Faktur |
| 4 | transaction_date| Date | - | Tanggal Penerimaan |
| 5 | notes | Text | - | Catatan tambahan |

**6. Tabel `inbound_transaction_details`**
Rincian kuantitas item untuk setiap form barang masuk (Tabel Pivot).

| No | Nama Field | Tipe Data | Ukuran | Keterangan |
| -- | --- | --- | --- | --- |
| 1 | id | Bigint | 20 | Primary Key, Auto_Increment |
| 2 | inbound_transaction_id| Bigint | 20 | Foreign Key (Header Inbound) |
| 3 | item_id | Bigint | 20 | Foreign Key -> tabel items |
| 4 | quantity | Int | 11 | Jumlah Barang Masuk |

**7. Tabel `outbound_transactions`**
Dokumen form pengajuan pengeluaran barang (menyimpan status *State Machine*).

| No | Nama Field | Tipe Data | Ukuran | Keterangan |
| -- | --- | --- | --- | --- |
| 1 | id | Bigint | 20 | Primary Key, Auto_Increment |
| 2 | requester_id | Bigint | 20 | Foreign Key (Peminta) |
| 3 | approver_id | Bigint | 20 | Foreign Key (Pemberi izin) |
| 4 | issued_by | Bigint | 20 | Foreign Key (Penyiap Barang) |
| 5 | handed_over_by| Bigint | 20 | Foreign Key (Penyerah Barang) |
| 6 | picked_up_by | Bigint | 20 | Foreign Key (Penerima) |
| 7 | department_id | Bigint | 20 | Foreign Key -> tabel departments |
| 8 | document_number| Varchar | 100 | Format nomor SPB dinamis |
| 9 | transaction_date| Date | - | Tanggal dokumen disahkan |
| 10| status | Varchar | 50 | PENDING, APPROVED, ISSUED, dll |
| 11| is_direct_request| Boolean| 1 | *Bypass Approval* flag |

**8. Tabel `outbound_transaction_details`**
Rincian permintaan ATK yang merekam perbedaan jumlah diajukan vs disetujui.

| No | Nama Field | Tipe Data | Ukuran | Keterangan |
| -- | --- | --- | --- | --- |
| 1 | id | Bigint | 20 | Primary Key, Auto_Increment |
| 2 | outbound_transaction_id| Bigint| 20 | Foreign Key (Header Outbound) |
| 3 | item_id | Bigint | 20 | Foreign Key -> tabel items |
| 4 | quantity_requested| Int | 11 | Jumlah diajukan staf |
| 5 | quantity_approved| Int | 11 | Jumlah disetujui atasan |

**9. Tabel `stock_ledgers`**
Riwayat kartu stok mutasi akuntansi gudang secara *real-time*.

| No | Nama Field | Tipe Data | Ukuran | Keterangan |
| -- | --- | --- | --- | --- |
| 1 | id | Bigint | 20 | Primary Key, Auto_Increment |
| 2 | item_id | Bigint | 20 | Foreign Key -> tabel items |
| 3 | movement_type | Varchar | 50 | 'Inbound', 'Outbound', 'Adjust' |
| 4 | qty_in | Int | 11 | Volume penambahan stok |
| 5 | qty_out | Int | 11 | Volume pengurangan stok |
| 6 | ending_balance | Int | 11 | Titik sisa stok pasca-mutasi |

**10. Tabel `stock_reconciliations`**
Dokumen Laporan Stock Opname / Rekonsiliasi bulanan.

| No | Nama Field | Tipe Data | Ukuran | Keterangan |
| -- | --- | --- | --- | --- |
| 1 | id | Bigint | 20 | Primary Key, Auto_Increment |
| 2 | created_by | Bigint | 20 | Foreign Key (Pembuat Laporan) |
| 3 | month | Int | 11 | Bulan rekonsiliasi |
| 4 | year | Int | 11 | Tahun rekonsiliasi |

**11. Tabel `stock_reconciliation_details`**
Rincian pencatatan selisih antara angka pada stok sistem dibandingkan fisik per barang.

| No | Nama Field | Tipe Data | Ukuran | Keterangan |
| -- | --- | --- | --- | --- |
| 1 | id | Bigint | 20 | Primary Key, Auto_Increment |
| 2 | reconciliation_id | Bigint| 20 | Foreign Key (Header Laporan) |
| 3 | item_id | Bigint | 20 | Foreign Key -> tabel items |
| 4 | system_qty | Int | 11 | Stok catatan sistem |
| 5 | physical_qty | Int | 11 | Stok fisik gudang |
| 6 | difference | Int | 11 | Angka selisih/penyesuaian |

## 4.9 Event List

Event list merupakan suatu kejadian yang dapat terjadi pada lingkungan sistem dan mempunyai suatu hubungan dengan respon yang diberikan oleh sistem. Berikut adalah urutan dan interaksi yang terjadi di dalam perancangan website SIMPATIK, yang dibagi berdasarkan aktor utama:

**Tabel 4.5 Event List Staff Unit Kerja**
| Event List | Trigger/Actor | Respon Sistem |
| --- | --- | --- |
| Staff membuka portal website SIMPATIK. | Staff | Sistem menampilkan halaman login. |
| Staff mengisi email dan password, lalu klik login. | Staff | Sistem memvalidasi data kredensial login dan mengarahkan ke Dashboard. |
| Staff memilih menu "Pengajuan Baru". | Staff | Sistem menampilkan formulir pengajuan permintaan ATK. |
| Staff memilih barang, mengisi jumlah, dan klik "Submit". | Staff | Sistem memvalidasi ketersediaan limit stok di gudang. |
| Stok mencukupi dan data valid. | Sistem | Sistem menyimpan pengajuan (status `Pending`) dan otomatis mengirim notifikasi WhatsApp ke Division Head. |
| Staff membuka menu "Riwayat Pengajuan" lalu klik "Konfirmasi Terima". | Staff | Sistem mengubah status transaksi menjadi `Completed` dan men-*generate* dokumen BAST PDF. |

**Tabel 4.6 Event List Division Head (Penyelia)**
| Event List | Trigger/Actor | Respon Sistem |
| --- | --- | --- |
| Division Head membuka link dari notifikasi WhatsApp. | Division Head | Sistem menampilkan halaman login (atau langsung ke Dashboard jika sesi aktif). |
| Division Head memilih menu "Pengajuan Masuk". | Division Head | Sistem menampilkan daftar pengajuan ATK dari staf berstatus `Pending`. |
| Division Head melihat detail form dan menekan "Setujui". | Division Head | Sistem menampilkan jendela pop-up konfirmasi persetujuan. |
| Division Head mengonfirmasi persetujuan (*Approve*). | Division Head | Sistem menyimpan pembaruan, mengubah status menjadi `Approved`, dan mengirim notifikasi WhatsApp ke Admin Gudang. |

**Tabel 4.7 Event List Admin Gudang**
| Event List | Trigger/Actor | Respon Sistem |
| --- | --- | --- |
| Admin memilih menu "Data Master" lalu "Data Barang". | Admin Gudang | Sistem menampilkan daftar katalog persediaan ATK dari database. |
| Admin mengisi form barang baru dan klik "Simpan". | Admin Gudang | Sistem menyimpan data baru ke database dan menampilkan pesan berhasil. |
| Admin memilih menu "Permintaan Barang". | Admin Gudang | Sistem menampilkan antrean dokumen pengajuan berstatus `Approved`. |
| Admin mengklik "Proses Penyiapan Barang" (Issue). | Admin Gudang | Sistem memotong nilai stok fisik, membuat riwayat mutasi di tabel *Stock Ledger*, dan mengubah status menjadi `Issued`. |
| Admin menyerahkan barang ke staf dan klik "Serahkan". | Admin Gudang | Sistem memperbarui status menjadi `Handed_Over` (menunggu konfirmasi penerimaan staf). |

**Tabel 4.8 Event List Staff Bagian Umum**
| Event List | Trigger/Actor | Respon Sistem |
| --- | --- | --- |
| Staff Bagian Umum membuka menu "Laporan Mutasi". | Staff Bagian Umum | Sistem menampilkan halaman filter rentang waktu laporan mutasi stok. |
| Staff Bagian Umum menentukan tanggal dan klik "Tampilkan". | Staff Bagian Umum | Sistem memproses kueri rekapitulasi mutasi dan menampilkan preview data. |
| Staff Bagian Umum mengklik "Export PDF" atau "Export Excel". | Staff Bagian Umum | Sistem mengkompilasi data dan mengunduh file laporan berformat PDF/Excel ke perangkat. |

## 4.10 Perancangan Design Tampilan

Pada tahap ini, rancangan desain purwarupa aplikasi diimplementasikan menjadi antarmuka berbasis web. Berikut adalah hasil rancangan tampilan fungsionalitas SIMPATIK.

**1. Halaman Login dan Autentikasi**
Pintu gerbang awal aplikasi SIMPATIK bagi karyawan. Pengguna diminta menginput *Email* dan *Password*.
*(Gambar 4.5 Halaman Login terlampir)*

**2. Halaman Dashboard Utama**
Halaman ini menampakkan kartu metrik visual yang menerangkan jumlah pengajuan bulan ini, lalu merinci sisa item dan peringatan bahaya warna merah "Stok Kritis".
*(Gambar 4.6 Halaman Dashboard Utama terlampir)*

**3. Halaman Tabel Pengajuan Barang (Outbound)**
Menampilkan *Data Table* status transaksi (*Pending*, *Approved*, *Completed*). Pengguna dapat menekan tombol "Buat Pengajuan Baru".
*(Gambar 4.7 Halaman Tabel Pengajuan Barang terlampir)*

**4. Halaman Modal Pengajuan (Buat Permintaan)**
Kotak interaktif (Pop-up Modal) pencarian barang untuk staf unit kerja menginput rincian item.
*(Gambar 4.8 Halaman Modal Form Permintaan terlampir)*

**5. Halaman Panel Persetujuan Penyelia (Approval Detail)**
Menyajikan ringkasan pemohon dan daftar barang. Terdapat tombol "Setujui" (Approve) dan "Tolak" (Reject).
*(Gambar 4.9 Halaman Panel Persetujuan Penyelia terlampir)*

**6. Halaman Data Master Inventaris Gudang**
Daftar katalog peralatan tulis yang dilengkapi gambar visual, kategori, dan batas stok sisa.
*(Gambar 4.10 Halaman Data Master Inventaris terlampir)*

**7. Halaman Laporan Mutasi Bulanan (Stock Ledger)**
Memuat *form* filter penarikan tanggal, menyajikan tabel komprehensif, dan tombol "*Export Excel/PDF*".
*(Gambar 4.11 Halaman Laporan Mutasi terlampir)*

## 4.11 Pengujian Sistem

Pengujian dilakukan secara ekstensif menggunakan metode *Black Box Testing*. Metode ini berfokus pada pengujian instrumen fungsional sesuai interaksi.

**Tabel 4.5 Tabel Pengujian Sistem (Black Box)**
| No | Skenario Pengujian | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| -- | --- | --- | --- | --- |
| 1 | **Autentikasi Hak Akses (Login Multi-Role)** | Akun staf, penyelia, maupun admin berhasil divalidasi dan langsung diarahkan ke Dashboard sesuai level otoritasnya. | Sesuai Harapan | Berhasil |
| 2 | **Validasi Limit Stok** | Staf mencoba mengajukan barang melebihi limit. Sistem menolak dan melontarkan *Error Validation*. | Sesuai Harapan | Berhasil |
| 3 | **Alur Notifikasi Pengajuan** | Staf menekan tombol *Submit*, sistem memicu *push notification* teks WhatsApp ke Penyelia. | Sesuai Harapan | Berhasil |
| 4 | **Pessimistic Locking Stok** | Admin menekan tombol "Issue". Sistem menahan eksekusi ganda dan memotong angka secara mutlak. | Sesuai Harapan | Berhasil |

## 4.12 Pembahasan

Sistem Manajemen Persediaan Terpadu (SIMPATIK) berbasis website pada PT. Bank Pembangunan Daerah Sumatera Selatan dan Bangka Belitung telah sukses digagas, dikembangkan, dan diuji fungsionalitasnya. Pembangunan platform terkomputerisasi ini menjadi wujud konkrit perbaikan atas metode konvensional manajemen pasokan logistik ATK.

Berdasarkan paparan hasil pengujian, arsitektur SIMPATIK mampu mentransformasi siklus alur permintaan kertas (manual) menjadi birokrasi tanpa kertas (*paperless*) dan terekam penuh rekam jejaknya. Inovasi penggunaan persetujuan sistem digital berlapis berbasis peran dipadukan dengan *WhatsApp Gateway* dan notifikasi instan terbukti andal dalam memperlancar jalur persetujuan (*Approval*). Mekanisme pembukuan log mutasi (*Stock Ledger*) otomatis mencegah risiko selisih perhitungan ganda. Hal ini sejalan dengan objektif awal perancangan sistem, yakni menghadirkan tata kelola inventori persediaan yang responsif, berkecepatan tinggi, termonitor lintas jenjang manajemen, dan meminimalisir celah kesalahan manusia secara signifikan.