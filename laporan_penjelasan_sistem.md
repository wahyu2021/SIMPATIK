# Bab 4 Hasil dan Pembahasan

## 4.1 Penyelidikan Awal

Pada penyelidikan awal, penulis mengamati tentang apa yang dibutuhkan dan diharapkan dari sistem pengelolaan persediaan Alat Tulis Kantor (ATK) ini. Oleh karena itu penulis bermaksud untuk Rancang Bangun **Sistem Manajemen Persediaan Terpadu (SIMPATIK)** yang berbasis website dengan ketentuan yang tertera di bawah ini:

1. Sistem informasi ini dirancang sebagai sebuah sistem berbasis website. Sistem ini dirancang dan dibangun untuk mendukung tujuan utama yaitu memfasilitasi pengelolaan administrasi barang masuk (inbound) dan permintaan barang keluar (outbound) secara digital pada lingkungan PT. Bank Pembangunan Daerah Sumatera Selatan dan Bangka Belitung (Bank Sumsel Babel) Cabang Utama Kapten A. Rivai. Melalui sistem informasi ini, diharapkan proses distribusi ATK, mutasi stok, persetujuan berjenjang, hingga pelaporan menjadi lebih efisien, terstruktur, dan transparan serta meminimalisir penggunaan kertas (*paperless*).
2. Sistem informasi ini dirancang untuk dapat diakses oleh empat jenis pengguna (user) yang memiliki peran (role) berbeda sesuai dengan otoritasnya:
   1. Pertama, **Admin Gudang**, yaitu peran yang bertugas mengelola sistem secara keseluruhan, mencatat barang masuk dari vendor, memproses pengeluaran barang fisik, menyerahkan barang ke staf, serta mengelola data master (Barang, Kategori, Departemen).
   2. Kedua, **Penyelia (Division Head)**, yaitu peran pimpinan unit kerja yang memiliki wewenang untuk memberikan persetujuan (approval) atau penolakan (rejection) terhadap pengajuan ATK yang dilakukan oleh staf di unit kerjanya.
   3. Ketiga, **Staff Unit Kerja**, yaitu peran peminta yang bertugas membuat formulir permintaan ATK secara digital dan melakukan konfirmasi tanda terima barang di akhir alur operasional.
   4. Keempat, **Bagian Umum (GA)**, yaitu peran manajemen yang bertugas melakukan fungsi *monitoring* serta mengekspor laporan mutasi (*Stock Ledger*) ke dalam wujud dokumen fisik/digital.
3. Sistem informasi ini juga dilengkapi dengan integrasi **WhatsApp Gateway** yang berfungsi untuk memberikan pemberitahuan secara *real-time* ke ponsel cerdas pengguna. Fitur ini akan aktif ketika ada pengajuan baru yang membutuhkan persetujuan penyelia, atau saat barang sudah siap diambil oleh staf di gudang. Hal ini dirancang agar pimpinan dan staf dapat segera mengetahui adanya pembaruan tugas tanpa harus mengecek sistem secara manual terus-menerus.

### 4.1.1 Analisis Masalah pada Sistem Lama

Berdasarkan pengamatan terhadap alur kerja yang berjalan, pengelolaan persediaan ATK saat ini menghadapi kendala dikarenakan belum terintegrasi secara digital. Beberapa permasalahan utama yang teridentifikasi pada sistem lama meliputi:

1. **Proses Permintaan dan Persetujuan Manual yang Lambat**
   Permintaan ATK masih menggunakan formulir kertas yang harus dicetak, diisi manual, lalu dibawa ke meja pimpinan unit kerja untuk ditandatangani basah. Proses ini sangat memakan waktu, terutama jika pimpinan sedang dinas luar atau tidak berada di tempat, sehingga distribusi ATK tertunda.
2. **Tidak Akuratnya Data Kartu Stok (Ledger)**
   Pencatatan keluar-masuk barang oleh admin gudang masih menggunakan kartu stok fisik di dalam lemari atau *spreadsheet* dasar. Hal ini rentan terhadap kesalahan manusia (*human error*) saat perekapan, yang mengakibatkan sering terjadinya selisih antara data catatan dengan fisik asli yang berada di rak gudang.
3. **Tidak Adanya Notifikasi dan Kejelasan Status**
   Pada sistem manual, staf yang mengajukan permintaan sering kali tidak mengetahui apakah barang mereka sedang disiapkan, sudah disetujui, atau ditolak. Mereka terpaksa harus mendatangi gudang secara langsung sekadar untuk bertanya progresnya, yang mana memperlambat alur koordinasi antar bagian.

### 4.1.2 Usulan Pemecahan Masalah

Untuk mengatasi permasalahan tersebut, penulis mengusulkan Rancang Bangun Sistem Informasi SIMPATIK berbasis website. Solusi ini dirancang untuk melakukan transformasi digital pada manajemen persediaan dengan rincian sebagai berikut:

1. **Sistem Berbasis Website untuk Aksesibilitas**
   Sistem dirancang menggunakan arsitektur *Single Page Application* (SPA) agar dapat diakses secara dinamis melalui jaringan internet dari berbagai perangkat (komputer maupun ponsel). Hal ini memungkinkan staf membuat pengajuan dari mejanya masing-masing, dan pimpinan dapat memberikan *approval* di mana saja.
2. **Manajemen Pengguna Berdasarkan Otoritas (Role-Based)**
   Sistem membagi hak akses menjadi empat peran utama (Admin Gudang, Penyelia, Staff, GA). Wewenang dibatasi secara ketat, contohnya fitur *Approval* yang hanya dapat dilakukan oleh Penyelia sesuai dengan unit kerjanya masing-masing.
3. **Fitur Notifikasi WhatsApp Real-Time**
   Sebagai solusi atas lambatnya penyampaian informasi, sistem ini dilengkapi dengan *WhatsApp Gateway*. Notifikasi dikirimkan instan (misalnya ke Penyelia saat ada pengajuan baru, atau ke Staf saat barang siap dijemput). Respons terhadap tugas dapat dilakukan segera tanpa penundaan.
4. **Digitalisasi Dokumen dan Tanda Tangan Elektronik**
   Seluruh formulir permintaan kertas ditiadakan. Sebagai gantinya, pengguna diwajibkan menggambar tanda tangan digital di dalam sistem (*Signature Onboarding*). Sistem secara otomatis akan menghasilkan Surat Permintaan Barang (SPB) dan Berita Acara Serah Terima (BAST) berformat PDF yang telah dibubuhi tanda tangan elektronik dan *QR Code* pelacakan.

## 4.2 Tata Cara Pemakaian Sistem

Tata cara atau alur kerja umum yang diterapkan dalam penggunaan aplikasi SIMPATIK di lingkungan Bank Sumsel Babel adalah sebagai berikut:

1. **Proses Autentikasi (Login) dan Onboarding**
   Seluruh pengguna diwajibkan melakukan *login* dengan memasukkan Email dan Password yang telah terdaftar. Jika pengguna baru masuk untuk pertama kalinya, sistem akan menahan akses fitur utama dan memaksa pengguna untuk menggambar tanda tangan digital di kanvas layar (*Signature Onboarding*) untuk keperluan validasi dokumen.
2. **Pengajuan Barang (Staff Unit Kerja)**
   Staff masuk ke menu "Pengajuan Baru" untuk mendaftar barang ATK. Staf mencari nama barang, menginput jumlah kuantitas, lalu menekan tombol kirim. Sistem akan menyimpan data ke *database* dan otomatis mengatur status dokumen menjadi *Pending*.
3. **Proses Disposisi/Persetujuan (Penyelia)**
   Penyelia menerima notifikasi WhatsApp, lalu membuka aplikasi. Penyelia meninjau rincian permintaan stafnya pada panel *Approval*. Jika sesuai, Penyelia menekan tombol "Setujui" (*Approve*). Sistem kemudian menyimpan persetujuan tersebut dan memberitahukan ke Admin Gudang.
4. **Penyiapan dan Pemotongan Stok (Admin Gudang)**
   Admin Gudang memproses permintaan yang sudah berstatus *Approved*. Admin menekan tombol "Keluarkan" (*Issue*), yang mana sistem secara internal akan memotong ketersediaan stok fisik (*pessimistic locking*). Setelah barang fisik disiapkan, Admin menekan tombol "Serahkan" (*Handover*).
5. **Konfirmasi Penerimaan (Staff Unit Kerja)**
   Staf mendatangi gudang untuk mengambil barangnya. Sebagai validasi keamanan, staf diwajibkan menekan tombol "Konfirmasi Terima" menggunakan akunnya sendiri (*Dual Confirmation*). Status transaksi berubah menjadi *Completed* dan dokumen BAST PDF otomatis terbit.
6. **Pelaporan dan Rekonsiliasi (Bagian Umum/Admin)**
   Admin atau Bagian Umum (GA) dapat mengakses menu Laporan untuk menarik rekapitulasi mutasi bulanan (*Stock Ledger*) ke format Excel/PDF. Mereka juga dapat secara rutin melakukan input Rekonsiliasi (*Stock Opname*) untuk mencocokkan perhitungan fisik di gudang dengan catatan sistem.

## 4.3 Studi Kelayakan

Dalam penulisan rancang bangun ini, penulis mempertimbangkan beberapa faktor studi kelayakan untuk memastikan bahwa sistem baru jauh lebih unggul dan efisien dibandingkan sistem lama.

Tabel 4.1 Perbandingan Studi Kelayakan
| Faktor Kelayakan | Sistem Lama (Manual) | Sistem Baru (SIMPATIK) |
| --- | --- | --- |
| **Kelayakan Teknis** | Proses otorisasi ATK bergantung pada perpindahan formulir fisik secara berjenjang. Harus mencari keberadaan pimpinan untuk mendapatkan tanda tangan basah, sehingga risiko berkas terselip dan penundaan menjadi sangat tinggi. | Dengan sistem baru, seluruh proses didigitalisasi menggunakan tanda tangan elektronik. Sistem dihubungkan dengan integrasi WhatsApp untuk memberikan *push notification* instan, sehingga persetujuan dapat dieksekusi secara teknis hanya dalam hitungan detik. |
| **Kelayakan Operasi** | Admin gudang mencatat mutasi barang keluar-masuk di buku besar (*Kartu Stok*) dan menghitung persediaan akhir satu-persatu secara berkala. Pembuatan laporan bulanan memakan waktu berhari-hari. | Sistem secara terpusat dan otomatis merekam setiap perpindahan barang ke dalam tabel *Stock Ledger*. Saldo diperbarui secara *real-time*. Pelaporan operasional dapat diunduh (eksport) oleh manajemen kapan saja tanpa perlu menyusun ulang data. |

## 4.4 Tempat dan Waktu Penelitian

Penelitian dan pengembangan sistem ini dilaksanakan di Kantor PT. Bank Pembangunan Daerah Sumatera Selatan dan Bangka Belitung (Bank Sumsel Babel) Cabang Utama Kapten A. Rivai. Kegiatan penelitian berlangsung selama kurang lebih lima bulan, terhitung mulai dari bulan Februari 2026 sampai dengan bulan Juni 2026.

## 4.5 Alat dan Bahan

Untuk dapat menghasilkan aplikasi ini dibutuhkan komponen-komponen komputer yang menjadi alat bantu. Adapun alat dan bahan yang dibutuhkan dalam pembuatan sistem informasi ini, sebagai berikut:

### 4.5.1 Alat
1. **Perangkat Lunak (Software):**
   - Sistem Operasi: Microsoft Windows 11.
   - Database Management System: MySQL (via Laragon) untuk mengelola basis data.
   - Text Editor: Antigravity IDE / Visual Studio Code untuk penulisan kode program.
   - Web Server: Nginx (untuk server production) / Artisan Serve (lokal).
   - Backend Framework: Laravel (PHP) untuk kerangka kerja logika bisnis dan API.
   - Frontend Framework: React.js (TypeScript) melalui *bundler* Vite untuk merender UI (SPA).
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

## 4.6 Metode Pengembangan Sistem

Metode yang digunakan dalam membangun aplikasi ini adalah metode **Agile**. Metode ini dipilih karena sifatnya yang iteratif, fleksibel, dan adaptif terhadap perubahan kebutuhan selama proses pembangunan perangkat lunak. Tahapan yang dilaksanakan dalam siklus Agile pada penelitian ini meliputi:
1. **Perencanaan (Planning & Requirement):** Mengumpulkan *Product Backlog* melalui observasi alur pengeluaran ATK di gudang dan wawancara dengan staf operasional, sehingga terbentuk prioritas fitur utama seperti persetujuan berjenjang dan integrasi notifikasi WhatsApp.
2. **Perancangan (Design):** Mendesain purwarupa antarmuka pengguna (UI), menyusun arsitektur basis data logis (ERD), dan merancang pemodelan aliran sistem (UML) untuk iterasi (*Sprint*) yang sedang berjalan.
3. **Pengembangan (Development):** Menulis baris kode program (*coding*) secara menyeluruh menggunakan PHP (Laravel) di sisi *backend* dan TypeScript (React) di sisi *frontend* dalam rentang waktu yang terukur.
4. **Pengujian (Testing):** Melakukan pengujian fungsionalitas secara kontinu pada setiap akhir iterasi menggunakan metode *Black Box Testing* untuk memastikan bahwa modul yang dikembangkan berjalan dengan sempurna, seperti memvalidasi berfungsinya fitur *Pessimistic Locking* pada stok barang.
5. **Evaluasi dan Peninjauan (Review & Retrospective):** Mempresentasikan purwarupa aplikasi (*increment*) kepada pengguna guna mendapatkan *feedback* langsung, kemudian mengevaluasi kekurangan untuk segera diperbaiki pada iterasi pengembangan berikutnya.

### 4.6.1 Kebutuhan Fungsional
1. **Manajemen Akses & Autentikasi**
   - Sistem harus memiliki fitur login gembok digital.
   - Sistem memaksa pengguna untuk merampungkan pengaturan awal tanda tangan digital (Signature Onboarding) ke dalam sistem kanvas gambar.
   - Hak akses menu harus disesuaikan secara dinamis mengikuti *role* masing-masing (Ketua, Sekretaris, dll).
2. **Pengelolaan Stok & Data Master**
   - Admin Gudang dapat mencatatkan barang pasokan masuk (*Inbound*) dari pihak rekanan (Vendor), yang berdampak pada penambahan langsung angka di basis data sistem.
   - Admin dapat menambah atau memodifikasi atribut barang, kategori, dan daftar departemen.
3. **Persetujuan Berjenjang (Workflow Outbound)**
   - Sistem mengizinkan Staf menyusun keranjang pesanan.
   - Sistem mewajibkan persetujuan kuantitas (Approval) dari Penyelia sebelum eksekusi dilanjutkan.
   - Sistem menyediakan opsi "Direct Request" untuk keadaan darurat yang langsung menembus batas persetujuan jika dioperasikan oleh Admin.
4. **Pelaporan & Notifikasi Terpadu**
   - Sistem secara konsisten mengirim peringatan ke *WhatsApp* pengguna ketika terdapat transisi status dari Pending ke Approved, dan Approved ke Issued.
   - Sistem memiliki modul *Generate* Dokumen PDF untuk menghasilkan BAST.
   - Terdapat dasbor *Stock Ledger* dan Laporan Mutasi bulanan.

### 4.6.2 Kebutuhan Non Fungsional
1. **Keamanan Data (Security)**
   - Penerapan mekanisme *Pessimistic Locking* (Penguncian Basis Data Sementara). Ketika admin memproses pengeluaran barang, baris database barang terkait dikunci selama proses transaksi agar tidak ada angka ganda (Race Condition).
   - Akses API dilindungi menggunakan token enkripsi (Sanctum).
2. **Kinerja (Performance)**
   - Aplikasi menggunakan konsep *Single Page Application* (SPA) dengan bantuan *framework* React, menjadikan waktu transisi perpindahan halaman di *browser* terjadi secara kilat tanpa memuat ulang layar penuh (zero reload).
3. **Antarmuka Pengguna (Usability)**
   - Tata letak layar didesain ramah pengguna dan menyesuaikan otomatis (*responsive web design*) mulai dari tampilan lebar di komputer Desktop hingga tampilan kecil di telepon pintar saat staf memencet tombol konfirmasi gudang.

## 4.7 Rancangan Sistem

Perancangan sistem digambarkan menggunakan diagram UML (*Unified Modeling Language*) yang terdiri dari *Use Case Diagram*, *Class Diagram*, *Activity Diagram*, dan *Sequence Diagram*.

### 4.7.1 Use Case Diagram
Use Case Diagram menggambarkan fungsionalitas sistem dari perspektif aktor dan bentuk interaksinya dengan lingkungan SIMPATIK.
(Gambar 4.1 Use Case Diagram terlampir di lembar desain sistem)

Aktor yang terlibat:
1. **Admin Gudang:** Memasukkan Inbound, Kelola Master Data, Issue Barang, Laporan.
2. **Penyelia:** Memberikan Approval pengajuan dari bawahannya.
3. **Staff Unit Kerja:** Menyusun permintaan Outbound, tanda tangan terima.
4. **Bagian Umum:** Mengakses menu laporan menyeluruh.

#### 4.7.1.1 Skenario Use Case

Nama Use Case : Login & Onboarding<br>
Aktor : Seluruh Pengguna<br>
Deskripsi : Proses autentikasi pengguna dan pengecekan kelengkapan tanda tangan digital.

**Tabel 4.2 Skenario: Login & Onboarding**
| Aksi Aktor | Reaksi Aplikasi |
| --- | --- |
| 1. Memasukkan Email dan Kata Sandi. | 2. Melakukan validasi kredensial (Hash Password). |
| 3. Menekan tombol Login. | 4. Mengevaluasi kolom `signature_path`. Jika belum ada, paksa pengguna menuju rute Onboarding. |
| 5. Menggambar guratan di kanvas. | 6. Menyimpan hasil *base64* ke gambar *PNG*. Memberikan hak akses penuh ke *Dashboard*. |
| **Kondisi Akhir** | **: Pengguna berhasil masuk ke dalam sistem dan memiliki tanda tangan digital yang tersimpan.** |

Nama Use Case : Mengajukan Permintaan ATK<br>
Aktor : Staff Unit Kerja<br>
Deskripsi : Proses pembuatan formulir permintaan barang (outbound) oleh staf.

**Tabel 4.3 Skenario: Mengajukan Permintaan ATK**
| Aksi Aktor | Reaksi Aplikasi |
| --- | --- |
| 1. Staf memilih menu "Pengajuan Baru". | 2. Menampilkan formulir dengan fitur cari barang. |
| 3. Menentukan item, mengatur jumlah permintaan, dan menekan "Submit". | 4. Melakukan validasi limit *current_stock*. Jika valid, menyisipkan data transaksi dengan status `Pending`. |
| | 5. Secara *background*, mengirim notifikasi WhatsApp kepada Penyelia Departemen tersebut. |
| **Kondisi Akhir** | **: Data pengajuan tersimpan dengan status `Pending` dan notifikasi terkirim ke Penyelia.** |

Nama Use Case : Persetujuan Pengajuan (Approval)<br>
Aktor : Penyelia<br>
Deskripsi : Proses peninjauan dan pemberian persetujuan terhadap pengajuan ATK oleh staf.

**Tabel 4.4 Skenario: Persetujuan Pengajuan (Approval)**
| Aksi Aktor | Reaksi Aplikasi |
| --- | --- |
| 1. Penyelia membuka antrean "Pengajuan Masuk". | 2. Menyajikan daftar lengkap form staf miliknya. |
| 3. Menyetel penyesuaian di kolom *Quantity Approved* (jika perlu). | 4. Menekan fungsi Setuju. |
| 5. Konfirmasi persetujuan (*Approve*). | 6. Mengganti status transaksi dari `Pending` menjadi `Approved` dan menotifikasi Admin Gudang. |
| **Kondisi Akhir** | **: Status pengajuan berubah menjadi `Approved` dan Admin Gudang menerima notifikasi.** |

Nama Use Case : Pemotongan Stok dan Serah Terima<br>
Aktor : Admin Gudang, Staff Unit Kerja<br>
Deskripsi : Proses penyiapan barang fisik, penyerahan, hingga konfirmasi penerimaan.

**Tabel 4.5 Skenario: Pemotongan Stok dan Serah Terima**
| Aksi Aktor | Reaksi Aplikasi |
| --- | --- |
| 1. Admin Gudang membuka form berstatus `Approved` lalu klik "Issue" (Proses Keluarkan). | 2. Mengaktifkan *Pessimistic Lock*, memotong nilai dari parameter stok asli, dan menulis riwayat mutasi (*Stock Ledger*). |
| 3. Barang diberikan, Admin klik "Handover". | 4. Mengganti status menjadi `Handed_Over`. |
| 5. Staf yang mengambil barang menekan tombol "Konfirmasi Terima" di akunnya. | 6. Siklus tertutup (*Completed*) dan SPB/BAST siap cetak PDF. |
| **Kondisi Akhir** | **: Transaksi selesai, stok berkurang secara sistem, dan dokumen BAST PDF dapat dicetak.** |

### 4.7.2 Class Diagram
Class diagram SIMPATIK memvisualisasikan arsitektur cetak biru penyusunan kolom tabel logis, meliputi keterikatan relasional seperti entitas `User` yang bernaung di bawah `Department`, hubungannya dengan `Role`, entitas objek induk `Item`, dan percabangannya ke dua arah arus gudang, yaitu `InboundTransaction` dan `OutboundTransaction`.
(Gambar 4.2 Class Diagram terlampir di lembar desain sistem)

### 4.7.3 Activity Diagram
Activity Diagram membedah proses bisnis menjadi kotak alur berkelanjutan berdasar *swimlane* para aktor.
1. **Activity Diagram Outbound:** Menggambarkan aliran pengajuan. Mulai dari Staf menyusun pesanan → Pemeriksaan jumlah → Persetujuan/Penolakan oleh Penyelia → Pemrosesan Pemotongan Fisik oleh Admin → Konfirmasi Serah Terima.
2. **Activity Diagram Inbound:** Menggambarkan Admin mencatatkan stok masuk vendor yang berakumulasi pada angka *current_stock*.
(Gambar 4.3 Activity Diagram terlampir di lembar desain sistem)

### 4.7.4 Sequence Diagram
Sequence Diagram memodelkan urutan interaksi antar objek dan pemanggilan *method* dari *View* (Inertia.js), ke *Controller*, *Service*, hingga ke *Model* pada arsitektur SIMPATIK.
1. **Sequence Diagram Autentikasi:** Menggambarkan proses validasi kredensial *login* dan pemeriksaan *Middleware* terhadap ketersediaan tanda tangan digital (*signature_path*).
2. **Sequence Diagram Inbound:** Menggambarkan aliran proses ketika Admin Gudang menyimpan data barang masuk, yang berujung pada kalkulasi otomatis penambahan *current_stock* dan pencatatan histori *Stock Ledger*.
3. **Sequence Diagram Outbound (Normal):** Menggambarkan aliran proses panjang dari pembuatan formulir (*Pending*), pemberian izin oleh Penyelia (*Approved*), hingga persiapan barang oleh Admin Gudang (*Issued*).
4. **Sequence Diagram Serah Terima (Handover):** Menggambarkan pertukaran status transaksi menjadi *Handed_Over* oleh Admin Gudang dan konfirmasi penerimaan oleh Staf hingga berstatus *Completed*.
5. **Sequence Diagram Laporan & Ekspor:** Menggambarkan mekanisme kompilasi kueri data *Stock Ledger* menjadi format unduhan PDF/Excel melalui *Controller*.
6. **Sequence Diagram Rekonsiliasi:** Menggambarkan mekanisme pencocokan stok fisik di mana selisih (*qty_diff*) secara otomatis dicatat sebagai transaksi penyesuaian (*adjustment*) di dalam sistem.
(Gambar 4.4 Sequence Diagram terlampir di lembar desain sistem)

## 4.8 Kamus Data

Kamus data yang terdapat pada perancangan Sistem Informasi SIMPATIK digunakan untuk menjabarkan karakteristik tipe data *field* yang terdapat di dalam tabel penyimpanan utama. 

1. **Tabel users**
   Menampung profil staf dan *hash* keamanan.
   users = id + name + email + phone_number + password + signature_path + is_active + department_id + created_at + updated_at

2. **Tabel items**
   Menampung katalog data *master* fisik ATK gudang beserta kalkulasi persediaannya.
   items = id + item_code + name + unit_of_measure + current_stock + minimum_stock_level + unit_price + category_id + created_at + updated_at

3. **Tabel outbound_transactions**
   Menampung log *header* formulir pesanan pengeluaran barang.
   outbound_transactions = id + document_number + transaction_date + status + is_direct_request + requester_id + approver_id + issued_by + created_at + updated_at

4. **Tabel outbound_transaction_details**
   Menampung log *body* detail barang apa saja di dalam formulir pesanan (Tabel Pivot/Child).
   outbound_transaction_details = id + outbound_transaction_id + item_id + quantity_requested + quantity_approved

5. **Tabel stock_ledgers**
   Menampung rekaman sejarah riwayat akuntansi pergudangan. Mencatat debit dan kredit angka aset.
   stock_ledgers = id + item_id + movement_type + qty_in + qty_out + ending_balance + transaction_date + document_reference

## 4.9 Tabel Desain

Berikut adalah implementasi spesifikasi struktur dari desain basis data:

**1. Tabel departments**
Tabel ini digunakan untuk mengelompokkan referensi instansi atau divisi agar atasan (Penyelia) dan bawahan (Staf) berada dalam relasi yang sama.
Tabel 4.6 Tabel departments
| No | Nama Field | Tipe Data | Ukuran | Keterangan |
| -- | --- | --- | --- | --- |
| 1 | id | Bigint | 20 | Primary Key, Auto_Increment |
| 2 | name | Varchar | 255 | Nama Divisi/Unit Kerja |
| 3 | created_at | Timestamp | - | Waktu data dibuat |
| 4 | updated_at | Timestamp | - | Waktu data diubah |

**2. Tabel users**
Tabel profil yang terenkripsi dan terhubung dengan tanda tangan digital pengguna.
Tabel 4.7 Tabel users
| No | Nama Field | Tipe Data | Ukuran | Keterangan |
| -- | --- | --- | --- | --- |
| 1 | id | Bigint | 20 | Primary Key, Auto_Increment |
| 2 | name | Varchar | 255 | Nama Lengkap Pengguna |
| 3 | email | Varchar | 255 | Alamat Email (Unique) |
| 4 | phone_number | Varchar | 50 | Kontak WhatsApp |
| 5 | password | Varchar | 255 | Kata sandi terenkripsi (Hash) |
| 6 | signature_path| Varchar | 255 | Lokasi URI file *png* Tanda Tangan |
| 7 | department_id | Bigint | 20 | Foreign Key -> tabel departments |

**3. Tabel items**
Tabel penyimpanan katalog identitas ATK yang dikelola, lengkap dengan sistem deteksi stok kritis (*minimum_stock_level*).
Tabel 4.8 Tabel items
| No | Nama Field | Tipe Data | Ukuran | Keterangan |
| -- | --- | --- | --- | --- |
| 1 | id | Bigint | 20 | Primary Key, Auto_Increment |
| 2 | item_code | Varchar | 50 | Kode barisan identifikasi unik |
| 3 | name | Varchar | 255 | Label nama barang |
| 4 | unit_of_measure| Varchar | 50 | Kotak/Rim/Buah/Lusin |
| 5 | current_stock | Int | 11 | Persediaan Faktual Saat Ini |
| 6 | minimum_stock_level| Int | 11 | Ambang batas terendah (*alert*) |
| 7 | category_id | Bigint | 20 | Foreign Key -> tabel categories |

**4. Tabel outbound_transactions**
Tabel pencatat laju alur pesanan dari tahap pembuatan formulir (Pending) hingga ke tahap Penyerahan (Completed).
Tabel 4.9 Tabel outbound_transactions
| No | Nama Field | Tipe Data | Ukuran | Keterangan |
| -- | --- | --- | --- | --- |
| 1 | id | Bigint | 20 | Primary Key, Auto_Increment |
| 2 | document_number| Varchar | 100 | Format nomor SPB dinamis |
| 3 | transaction_date| Date | - | Tanggal dokumen disahkan |
| 4 | status | Varchar | 50 | Indikator tahap birokrasi |
| 5 | is_direct_request| Boolean| 1 | *Bypass Approval* flag (1=Ya, 0=Tdk)|
| 6 | requester_id | Bigint | 20 | Foreign Key (Pemohon) |
| 7 | approver_id | Bigint | 20 | Foreign Key (Pemberi izin) |

**5. Tabel stock_ledgers**
Tabel mutasi yang menghitung pergerakan masuk (In) dan keluar (Out) demi menemukan kesesuaian nilai persediaan akhir.
Tabel 4.10 Tabel stock_ledgers
| No | Nama Field | Tipe Data | Ukuran | Keterangan |
| -- | --- | --- | --- | --- |
| 1 | id | Bigint | 20 | Primary Key, Auto_Increment |
| 2 | item_id | Bigint | 20 | Foreign Key -> tabel items |
| 3 | movement_type | Varchar | 50 | 'Inbound', 'Outbound', 'Adjust' |
| 4 | qty_in | Int | 11 | Volume nilai tambah |
| 5 | qty_out | Int | 11 | Volume nilai kurang |
| 6 | ending_balance | Int | 11 | Titik sisa stok pasca-mutasi |

## 4.10 Implementasi (Hasil Tampilan)

Pada tahap ini, rancangan desain purwarupa aplikasi telah berhasil diimplementasikan menjadi sistem terkomputerisasi melalui pemanfaatan bahasa PHP (Laravel) dan React.js. Berikut adalah hasil rekam jejak visual (*screenshot*) fungsionalitas SIMPATIK.

**1. Halaman Login dan Autentikasi**
Halaman ini adalah pintu gerbang awal aplikasi SIMPATIK bagi seluruh karyawan Bank Sumsel Babel Cabang Utama. Pengguna diminta menginput *Email* dan *Password*.
<br> *(Gambar 4.5 Halaman Login)*

**2. Halaman Signature Onboarding**
Halaman wajib bagi pengguna baru. Antarmuka ini menampilkan blok kanvas putih di bagian tengah, tempat di mana pengguna harus menggambar tanda tangan digital miliknya menggunakan kursor mouse atau sentuhan jari. Tanpa tanda tangan ini, dokumen Surat Permintaan Barang (SPB) tidak dapat disahkan.
<br> *(Gambar 4.6 Halaman Signature Onboarding)*

**3. Halaman Dashboard Utama**
Dasbor pangkalan ringkasan sistem. Halaman ini menampakkan kartu metrik visual yang menerangkan jumlah pengajuan bulan ini, lalu merinci sisa item dan peringatan bahaya warna merah "Stok Kritis". 
<br> *(Gambar 4.7 Halaman Dashboard Utama)*

**4. Halaman Tabel Pengajuan Barang (Outbound)**
Ruang antrean dokumen permintaan. Dihiasi fitur *Data Table* yang menampilkan *badge* status transaksi warna-warni (contoh: kuning untuk *Pending*, biru untuk *Approved*, dan hijau terang untuk *Completed*). Pengguna dapat menekan tombol biru "Buat Pengajuan Baru".
<br> *(Gambar 4.8 Halaman Tabel Pengajuan Barang)*

**5. Halaman Modal Pengajuan (Buat Permintaan)**
Kotak interaktif (Pop-up Modal) pencarian barang. Staf unit kerja dapat mencari kata kunci nama alat tulis, kemudian mengisi berapa jumlah yang dibutuhkan, dan langsung mengirimnya ke meja konfirmasi penyelia secara kilat.
<br> *(Gambar 4.9 Halaman Modal Form Permintaan)*

**6. Halaman Panel Persetujuan Penyelia (Approval Detail)**
Halaman eksklusif bagi pemegang peran kepemimpinan. Terbagi dalam tata letak (layout) dua lajur; ringkasan profil pemohon, disusul rincian daftar jumlah barang. Terdapat tuas penyesuai kuantitas yang sah disetujui, diapit oleh tombol agung berwarna biru 'Setujui' (Approve) dan merah 'Tolak' (Reject).
<br> *(Gambar 4.10 Halaman Panel Persetujuan Penyelia)*

**7. Halaman Data Master Inventaris Gudang**
Layar *inventory control* untuk Admin Gudang. Daftar lengkap katalog peralatan tulis yang diwadahi lengkap dengan representasi visual gambar, nama satuan, hingga angka mutlak sisa ketersediaan. Disertai fitur *filter* Kategori dan kontrol penambahan (*Create*) stok item yang baru.
<br> *(Gambar 4.11 Halaman Data Master Inventaris)*

**8. Halaman Laporan Mutasi Bulanan (Stock Ledger)**
Konsol perekaman jejak audit milik Bagian Umum (GA). Layar memuat *form* penarikan rentang tanggal dari Tanggal Awal hingga Akhir. Menyajikan tabel komprehensif debit-kredit gudang, serta ketersediaan opsi aksi penting "*Export Excel*" dan "*Export PDF*" di pojok bagian luar.
<br> *(Gambar 4.12 Halaman Laporan Mutasi & Ekspor)*

**9. Halaman Rekonsiliasi (Stock Opname)**
Lembar kalkulasi fisik versus sistem. Dirancang menyerupai lembar akuntansi memanjang yang membeberkan total angka sistem di layar bersebelahan dengan kotak kosong untuk diisi penghitungan fisik nyata oleh Admin Gudang. Kalkulator program mendeteksi angka "Selisih" secara seketika (*real-time*).
<br> *(Gambar 4.13 Halaman Fitur Rekonsiliasi)*

## 4.11 Pengujian Sistem

Pengujian dilakukan secara ekstensif menggunakan metode *Black Box Testing*. Metode ini berfokus pada pengujian instrumen fungsional sesuai dengan kebutuhan interaksi pengguna secara masif tanpa memikirkan susunan logika kodenya.

Tabel 4.11 Tabel Pengujian Sistem (Black Box)
| No | Skenario Pengujian | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| -- | --- | --- | --- | --- |
| 1 | **Autentikasi (Signature Lock)** | Akun baru tanpa `signature_path` memasukkan *password* yang benar, sistem memaksanya ter-*redirect* ke rute *Onboarding* untuk menggambar kanvas. | Sesuai Harapan | Berhasil |
| 2 | **Validasi Limit Stok** | Staf mencoba mengajukan Kertas HVS sebanyak 50 rim padahal *current_stock* di sistem tinggal 10 rim. Sistem menolak dan melontarkan *Error Validation*. | Sesuai Harapan | Berhasil |
| 3 | **Alur Notifikasi Pengajuan** | Staf menekan tombol *Submit*, transaksi sukses, lalu sistem secara mandiri membunyikan *push notification* teks WhatsApp ke gawai milik Penyelia departemen terkait. | Sesuai Harapan | Berhasil |
| 4 | **Pessimistic Locking Stok** | Admin Gudang menekan tombol "Issue". Sistem menahan eksekusi transaksi yang bersinggungan di baris stok yang sama, memotong angka secara mutlak, dan menulis mutasi baru di *Stock Ledger*. | Sesuai Harapan | Berhasil |
| 5 | **Fitur Cetak & PDF BAST** | Staf menekan "Konfirmasi Terima". Transaksi resmi ditutup (Completed). Admin kemudian dapat men-klik *Download BAST*, yang mana sistem mem-*build* PDF instan dengan injeksi Tanda Tangan elektronik pengguna. | Sesuai Harapan | Berhasil |

## 4.12 Pembahasan

Sistem Manajemen Persediaan Terpadu (SIMPATIK) berbasis website pada PT. Bank Pembangunan Daerah Sumatera Selatan dan Bangka Belitung (Cabang Utama Kapten A. Rivai) telah sukses digagas, dikembangkan, dan diuji fungsionalitasnya. Pembangunan platform terkomputerisasi ini menjadi wujud konkrit perbaikan atas metode konvensional manajemen pasokan logistik ATK.

Berdasarkan paparan hasil pengujian komprehensif, arsitektur SIMPATIK mampu mentransformasi siklus alur permintaan kertas (manual) menjadi suatu tata birokrasi tanpa kertas (*paperless*) bernilai otentik via fitur kanvas Tanda Tangan Digital. Inovasi penggunaan *WhatsApp Gateway* dan notifikasi instan terbukti andal dalam memperlancar jalur persetujuan (*Approval*) dari pimpinan unit kerja. Sementara pada skala operasional gudang, mekanisme pembukuan log mutasi (*Stock Ledger*) otomatis mencegah risiko selisih perhitungan ganda. Hal ini sejalan dengan objektif awal perancangan sistem, yakni menghadirkan tata kelola inventori persediaan yang responsif, berkecepatan tinggi, termonitor lintas jenjang manajemen, dan meminimalisir celah kesalahan manusia secara signifikan.