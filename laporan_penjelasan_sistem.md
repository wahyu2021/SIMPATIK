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
4. **Digitalisasi Dokumen dan Tanda Tangan Elektronik**
   Seluruh formulir kertas ditiadakan dan diganti menjadi format PDF dengan *QR Code* dan tanda tangan elektronik.

### 4.3.3 Tata Cara Pemakaian Sistem
Tata cara atau alur kerja umum yang diterapkan dalam penggunaan aplikasi SIMPATIK adalah:
1. **Proses Autentikasi (Login) dan Onboarding** (Signature Onboarding).
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
| **Kelayakan Teknis** | Proses otorisasi ATK bergantung pada perpindahan formulir fisik secara berjenjang. Harus mencari keberadaan pimpinan untuk mendapatkan tanda tangan basah. | Dengan sistem baru, seluruh proses didigitalisasi menggunakan tanda tangan elektronik. Sistem dihubungkan dengan integrasi WhatsApp untuk memberikan *push notification* instan. |
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
   Perangkat keras yang digunakan untuk pengembangan adalah Komputer jinjing (Laptop) dengan spesifikasi:
   - Processor: AMD Ryzen 5.
   - RAM: 16 GB.
   - Penyimpanan: 512 GB SSD NVMe.
   - Kartu Grafis: NVIDIA RTX 3050.

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

Secara spesifik, sistem yang bekerja dan aktor yang diperlukan terhadap *use case* dapat dideskripsikan sebagai berikut:

**Definisi Aktor**
1. **Admin Gudang:** Memasukkan Inbound, Kelola Master Data, Issue Barang, Laporan.
2. **Penyelia:** Memberikan Approval pengajuan dari bawahannya.
3. **Staff Unit Kerja:** Menyusun permintaan Outbound, tanda tangan terima.
4. **Bagian Umum:** Mengakses menu laporan menyeluruh.

**Skenario Use Case**
- **Skenario Login & Onboarding:** Memvalidasi kredensial. Jika tidak ada tanda tangan, paksa pengguna menuju rute Onboarding untuk menggambar di kanvas.
- **Skenario Mengajukan Permintaan ATK (Staff):** Memilih item, mengisi jumlah, memvalidasi limit stok, dan menyimpan data pengajuan dengan status `Pending`. Notifikasi WhatsApp dikirim ke Penyelia.
- **Skenario Persetujuan Pengajuan (Penyelia):** Membuka daftar pengajuan, menyetujui kuantitas (*Approve*). Status berubah menjadi `Approved` dan Admin Gudang menerima notifikasi.
- **Skenario Pemotongan Stok dan Serah Terima:** Admin Gudang menekan "Issue" (*Pessimistic Lock* aktif, stok terpotong), kemudian Admin menekan "Handover". Staf yang mengambil barang menekan tombol "Konfirmasi Terima". Transaksi berstatus `Completed` dan SPB/BAST siap cetak PDF.

### 4.7.2 Activity Diagram
Activity Diagram membedah proses bisnis menjadi kotak alur berkelanjutan berdasar *swimlane* para aktor.

**(Gambar 4.2 Activity Diagram terlampir di lembar desain sistem)**

1. **Activity Diagram Outbound:** Menggambarkan aliran pengajuan. Mulai dari Staf menyusun pesanan → Pemeriksaan jumlah → Persetujuan/Penolakan oleh Penyelia → Pemrosesan Pemotongan Fisik oleh Admin → Konfirmasi Serah Terima.
2. **Activity Diagram Inbound:** Menggambarkan Admin mencatatkan stok masuk vendor yang berakumulasi pada angka *current_stock*.

### 4.7.3 Sequence Diagram
Sequence Diagram memodelkan urutan interaksi antar objek dan pemanggilan *method* dari *View* ke *Controller*, *Service*, hingga ke *Model*.

**(Gambar 4.3 Sequence Diagram terlampir di lembar desain sistem)**

1. **Sequence Diagram Autentikasi:** Proses validasi kredensial *login* dan pemeriksaan *Middleware* tanda tangan digital.
2. **Sequence Diagram Inbound:** Aliran pencatatan barang masuk dan penambahan tabel `stock_ledgers`.
3. **Sequence Diagram Outbound:** Proses dari form (*Pending*) hingga izin Penyelia (*Approved*).
4. **Sequence Diagram Serah Terima (Handover):** Pertukaran status dari *Handed_Over* hingga *Completed*.

### 4.7.4 Class Diagram
Class diagram SIMPATIK memvisualisasikan arsitektur keterikatan logis tabel, seperti relasi entitas `User` yang bernaung di bawah `Department`, hubungannya dengan `Role`, entitas `Item`, hingga tabel transaksional pergudangan.

**(Gambar 4.4 Class Diagram terlampir di lembar desain sistem)**

## 4.8 Dasar Logika

### 4.8.1 Kamus Data dan Tabel Desain

Kamus data digunakan untuk menjabarkan karakteristik tipe data *field* yang terdapat di dalam tabel penyimpanan utama.

**1. Tabel `users`**
Menampung profil staf dan hash keamanan.
Kamus Data: `id + name + email + phone_number + password + signature_path + is_active + department_id + created_at + updated_at`

| No | Nama Field | Tipe Data | Ukuran | Keterangan |
| -- | --- | --- | --- | --- |
| 1 | id | Bigint | 20 | Primary Key, Auto_Increment |
| 2 | name | Varchar | 255 | Nama Lengkap Pengguna |
| 3 | email | Varchar | 255 | Alamat Email (Unique) |
| 4 | phone_number | Varchar | 50 | Kontak WhatsApp |
| 5 | password | Varchar | 255 | Kata sandi terenkripsi (Hash) |
| 6 | signature_path| Varchar | 255 | Lokasi URI file *png* Tanda Tangan |
| 7 | department_id | Bigint | 20 | Foreign Key -> tabel departments |

**2. Tabel `items`**
Kamus Data: `id + item_code + name + unit_of_measure + current_stock + minimum_stock_level + category_id + created_at + updated_at`

| No | Nama Field | Tipe Data | Ukuran | Keterangan |
| -- | --- | --- | --- | --- |
| 1 | id | Bigint | 20 | Primary Key, Auto_Increment |
| 2 | item_code | Varchar | 50 | Kode barisan identifikasi unik |
| 3 | name | Varchar | 255 | Label nama barang |
| 4 | unit_of_measure| Varchar | 50 | Kotak/Rim/Buah/Lusin |
| 5 | current_stock | Int | 11 | Persediaan Faktual Saat Ini |
| 6 | minimum_stock_level| Int | 11 | Ambang batas terendah (*alert*) |
| 7 | category_id | Bigint | 20 | Foreign Key -> tabel categories |

**3. Tabel `outbound_transactions`**
Kamus Data: `id + document_number + transaction_date + status + is_direct_request + requester_id + approver_id + created_at + updated_at`

| No | Nama Field | Tipe Data | Ukuran | Keterangan |
| -- | --- | --- | --- | --- |
| 1 | id | Bigint | 20 | Primary Key, Auto_Increment |
| 2 | document_number| Varchar | 100 | Format nomor SPB dinamis |
| 3 | transaction_date| Date | - | Tanggal dokumen disahkan |
| 4 | status | Varchar | 50 | Indikator tahap birokrasi |
| 5 | is_direct_request| Boolean| 1 | *Bypass Approval* flag |
| 6 | requester_id | Bigint | 20 | Foreign Key (Pemohon) |
| 7 | approver_id | Bigint | 20 | Foreign Key (Pemberi izin) |

**4. Tabel `stock_ledgers`**
Kamus Data: `id + item_id + movement_type + qty_in + qty_out + ending_balance + transaction_date + document_reference`

| No | Nama Field | Tipe Data | Ukuran | Keterangan |
| -- | --- | --- | --- | --- |
| 1 | id | Bigint | 20 | Primary Key, Auto_Increment |
| 2 | item_id | Bigint | 20 | Foreign Key -> tabel items |
| 3 | movement_type | Varchar | 50 | 'Inbound', 'Outbound', 'Adjust' |
| 4 | qty_in | Int | 11 | Volume nilai tambah |
| 5 | qty_out | Int | 11 | Volume nilai kurang |
| 6 | ending_balance | Int | 11 | Titik sisa stok pasca-mutasi |

## 4.9 Event List

Event list merupakan suatu kejadian yang dapat terjadi pada lingkungan sistem dan mempunyai suatu hubungan dengan respon yang diberikan oleh sistem. Berikut interaksi di dalam aplikasi SIMPATIK:

**Tabel 4.2 Event List (Staff Unit Kerja)**
| Event List | Trigger/Actor | Respon Sistem |
| --- | --- | --- |
| Staff membuka portal sistem SIMPATIK. | Staff | Menampilkan halaman Login. |
| Staff berhasil melakukan login dan akun belum memiliki *signature*. | Staff | Mengarahkan ke rute *Signature Onboarding*. |
| Staff membuat pengajuan ATK dan menekan "Submit". | Staff | Memvalidasi ketersediaan stok, merubah status pesanan menjadi `Pending`, dan mengirimkan notifikasi *WhatsApp* ke Penyelia. |
| Staff menekan tombol "Konfirmasi Terima" barang di gudang. | Staff | Merubah status transaksi menjadi `Completed` dan memicu fitur *generate* BAST PDF otomatis. |

**Tabel 4.3 Event List (Penyelia)**
| Event List | Trigger/Actor | Respon Sistem |
| --- | --- | --- |
| Penyelia membuka menu "Pengajuan Masuk". | Penyelia | Menampilkan daftar antrean pengajuan dari staf divisinya. |
| Penyelia menekan tombol "Setujui" (*Approve*). | Penyelia | Menyimpan persetujuan, mengubah status menjadi `Approved`, dan mengirim notifikasi *WhatsApp* ke Admin Gudang. |

**Tabel 4.4 Event List (Admin Gudang)**
| Event List | Trigger/Actor | Respon Sistem |
| --- | --- | --- |
| Admin Gudang memasukkan barang Inbound vendor baru. | Admin Gudang | Menambahkan angka *current_stock* item tersebut dan membuat baris mutasi `Inbound` di tabel *Stock Ledger*. |
| Admin Gudang menekan tombol "Issue" pada pesanan. | Admin Gudang | Mengaktifkan perlindungan *Pessimistic Lock*, memotong nilai stok fisik, dan merubah status transaksi. |
| Admin Gudang mengekspor data *Stock Ledger*. | Admin Gudang | Memproses kueri rekapitulasi data dan mengunduh format Excel/PDF. |

## 4.10 Perancangan Design Tampilan

Pada tahap ini, rancangan desain purwarupa aplikasi diimplementasikan menjadi antarmuka berbasis web. Berikut adalah hasil rancangan tampilan fungsionalitas SIMPATIK.

**1. Halaman Login dan Autentikasi**
Pintu gerbang awal aplikasi SIMPATIK bagi karyawan. Pengguna diminta menginput *Email* dan *Password*.
*(Gambar 4.5 Halaman Login terlampir)*

**2. Halaman Signature Onboarding**
Halaman wajib bagi pengguna baru. Antarmuka ini menampilkan blok kanvas putih di bagian tengah, tempat di mana pengguna harus menggambar tanda tangan digital.
*(Gambar 4.6 Halaman Signature Onboarding terlampir)*

**3. Halaman Dashboard Utama**
Halaman ini menampakkan kartu metrik visual yang menerangkan jumlah pengajuan bulan ini, lalu merinci sisa item dan peringatan bahaya warna merah "Stok Kritis".
*(Gambar 4.7 Halaman Dashboard Utama terlampir)*

**4. Halaman Tabel Pengajuan Barang (Outbound)**
Menampilkan *Data Table* status transaksi (*Pending*, *Approved*, *Completed*). Pengguna dapat menekan tombol "Buat Pengajuan Baru".
*(Gambar 4.8 Halaman Tabel Pengajuan Barang terlampir)*

**5. Halaman Modal Pengajuan (Buat Permintaan)**
Kotak interaktif (Pop-up Modal) pencarian barang untuk staf unit kerja menginput rincian item.
*(Gambar 4.9 Halaman Modal Form Permintaan terlampir)*

**6. Halaman Panel Persetujuan Penyelia (Approval Detail)**
Menyajikan ringkasan pemohon dan daftar barang. Terdapat tombol "Setujui" (Approve) dan "Tolak" (Reject).
*(Gambar 4.10 Halaman Panel Persetujuan Penyelia terlampir)*

**7. Halaman Data Master Inventaris Gudang**
Daftar katalog peralatan tulis yang dilengkapi gambar visual, kategori, dan batas stok sisa.
*(Gambar 4.11 Halaman Data Master Inventaris terlampir)*

**8. Halaman Laporan Mutasi Bulanan (Stock Ledger)**
Memuat *form* filter penarikan tanggal, menyajikan tabel komprehensif, dan tombol "*Export Excel/PDF*".
*(Gambar 4.12 Halaman Laporan Mutasi terlampir)*

## 4.11 Pengujian Sistem

Pengujian dilakukan secara ekstensif menggunakan metode *Black Box Testing*. Metode ini berfokus pada pengujian instrumen fungsional sesuai interaksi.

**Tabel 4.5 Tabel Pengujian Sistem (Black Box)**
| No | Skenario Pengujian | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| -- | --- | --- | --- | --- |
| 1 | **Autentikasi (Signature Lock)** | Akun baru tanpa `signature_path` ter-*redirect* ke rute *Onboarding* untuk menggambar kanvas. | Sesuai Harapan | Berhasil |
| 2 | **Validasi Limit Stok** | Staf mencoba mengajukan barang melebihi limit. Sistem menolak dan melontarkan *Error Validation*. | Sesuai Harapan | Berhasil |
| 3 | **Alur Notifikasi Pengajuan** | Staf menekan tombol *Submit*, sistem memicu *push notification* teks WhatsApp ke Penyelia. | Sesuai Harapan | Berhasil |
| 4 | **Pessimistic Locking Stok** | Admin menekan tombol "Issue". Sistem menahan eksekusi ganda dan memotong angka secara mutlak. | Sesuai Harapan | Berhasil |

## 4.12 Pembahasan

Sistem Manajemen Persediaan Terpadu (SIMPATIK) berbasis website pada PT. Bank Pembangunan Daerah Sumatera Selatan dan Bangka Belitung telah sukses digagas, dikembangkan, dan diuji fungsionalitasnya. Pembangunan platform terkomputerisasi ini menjadi wujud konkrit perbaikan atas metode konvensional manajemen pasokan logistik ATK.

Berdasarkan paparan hasil pengujian, arsitektur SIMPATIK mampu mentransformasi siklus alur permintaan kertas (manual) menjadi birokrasi tanpa kertas (*paperless*) bernilai otentik via fitur Tanda Tangan Digital. Inovasi penggunaan *WhatsApp Gateway* dan notifikasi instan terbukti andal dalam memperlancar jalur persetujuan (*Approval*). Mekanisme pembukuan log mutasi (*Stock Ledger*) otomatis mencegah risiko selisih perhitungan ganda. Hal ini sejalan dengan objektif awal perancangan sistem, yakni menghadirkan tata kelola inventori persediaan yang responsif, berkecepatan tinggi, termonitor lintas jenjang manajemen, dan meminimalisir celah kesalahan manusia secara signifikan.