### **1. Keamanan & Hak Akses (*Security & Access*)**

**Tabel users** (Tabel Pengguna Utama)

* id (Primary Key, BigInt)  
* name (String)  
* email / username (String, Unique)  
* password (String)  
* Tambahkan: signature_path (String, Nullable)  
* Tambahkan: is_active (Boolean, Default: true)  
* timestamps  
* softDeletes

**Tabel roles & permissions** *(Di-generate otomatis oleh Spatie)*

* roles (Menyimpan nama role: *warehouse_admin*, *general_affairs*, dll)  
* permissions (Menyimpan hak akses spesifik: *create_outbound*, *view_reports*, dll)  
* model_has_roles (Tabel Pivot penghubung User dan Role)  
* role_has_permissions (Tabel Pivot penghubung Role dan Permission)

### **2. Data Induk (*Master Data*)**

**Tabel departments** (Daftar Unit Kerja Peminta)

* id (Primary Key, BigInt)  
* name (String) -> *Contoh: KSG Unit, Teller, Customer Service.*  
* timestamps  
* softDeletes

**Tabel categories** (Kelompok Barang)

* id (Primary Key, BigInt)  
* name (String) -> *Contoh: Printed Forms, Envelopes, General Office Supplies.*  
* timestamps  
* softDeletes

**Tabel items** (Katalog Barang & Saldo Utama)

* id (Primary Key, BigInt)  
* category_id (Foreign Key -> categories.id)  
* item_code (String, Nullable, Unique) -> *Opsional jika ada kode khusus.*  
* name (String) -> *Contoh: KSG R-2 Form.*  
* unit_of_measure (String) -> *Contoh: Pcs, Box, Ream, Book.*  
* unit_price (Decimal/Integer) -> *Harga satuan untuk audit nilai aset.*  
* current_stock (Integer) -> *Saldo aktual di gudang.*  
* minimum_stock_level (Integer) -> *Batas untuk notifikasi peringatan.*  
* timestamps  
* softDeletes

### **3. Modul Transaksi (*Warehouse Operations*)**

**Tabel inbound_transactions** (Riwayat Barang Masuk dari Vendor/Pusat)

* id (Primary Key, BigInt)  
* user_id (Foreign Key -> users.id) -> *Admin gudang yang mencatat.*  
* reference_number (String) -> *Nomor Surat Jalan/Faktur dari vendor.*  
* transaction_date (Date)  
* notes (String, Nullable) -> *Keterangan tambahan.*  
* timestamps

**Tabel inbound_transaction_details** (Rincian Keranjang Barang Masuk)

* id (Primary Key, BigInt)  
* inbound_transaction_id (Foreign Key -> inbound_transactions.id)  
* item_id (Foreign Key -> items.id)  
* quantity (Integer) -> *Jumlah barang yang masuk.*

**Tabel outbound_transactions** (Riwayat Distribusi / Penghasil Formulir SPB)

* id (Primary Key, BigInt)  
* approver_id(Foreign Key -> [users.id](http://users.id), nullable) -> *Penjaga gudang yang menyerahkan.*  
* department_id (Foreign Key -> departments.id) -> *Unit kerja yang meminta.*  
* requester_id (Foreign Key -> users.id)  
* document_number (String, Unique) -> *Nomor seri formulir otomatis.*  
* transaction_date (Date)  
* status (enum /string: ‘Pending’, ‘Approved’, ‘Rejected’) -> status dokumen  
* approved_at(Timestamp, nullable) -> jejak digital waktu pasti tombol setuju ditekan oleh admin  
* timestamps

**Tabel outbound_transaction_details** (Rincian Keranjang Barang Keluar)

* id (Primary Key, BigInt)  
* outbound_transaction_id (Foreign Key -> outbound_transactions.id)  
* item_id (Foreign Key -> items.id)  
* quantity (Integer) -> *Jumlah barang yang diambil.*

### **4. Enterprise & AI (*Ledger & Forecasting*)**

**Tabel stock_ledgers** (Kartu Mutasi Stok / Jejak Digital Permanen)

* id (Primary Key, BigInt)  
* item_id (Foreign Key -> items.id)  
* transaction_date (Date)  
* movement_type (Enum: 'in', 'out', 'adjustment') -> *Jenis pergerakan.*  
* document_reference (String) -> *Berisi Document Number (Keluar) atau Reference Number (Masuk).*  
* qty_in (Integer) -> *Default 0.*  
* qty_out (Integer) -> *Default 0.*  
* ending_balance (Integer) -> *Saldo akhir persis setelah transaksi ini terjadi.*  
* timestamps

**Tabel demand_forecasts** (Penyimpanan Prediksi XGBoost)

* id (Primary Key, BigInt)  
* item_id (Foreign Key -> items.id)  
* target_period (String) -> *Format YYYY-MM (contoh: 2026-04).*  
* forecasted_demand (Integer) -> *Angka hasil tebakan API Hugging Face.*  
* suggested_order_qty (Integer) -> *Angka hasil kalkulasi (Prediksi - Stok Saat Ini).*  
* model_version (String, Default: 'v1.0') -> *Versi model XGBoost yang digunakan saat prediksi. Berguna agar data tidak tumpang tindih saat model di-retrain di masa depan.*  
* mae_score (Decimal, Nullable) -> *Nilai Mean Absolute Error dari prediksi saat itu sebagai metrik evaluasi Machine Learning.*  
* Timestamps

### **5. Konfigurasi Sistem (*System Configuration*)**

**Tabel settings** (Pengaturan Dinamis Aplikasi)

* id (Primary Key, BigInt)  
* key (String, Unique) -> *Kunci pengaturan, contoh: 'kepala_divisi_umum', 'ml_api_url'.*  
* value (Text) -> *Nilai pengaturan, contoh: 'Nama Bapak X', 'http://127.0.0.1:8000/predict'.*  
* timestamps

> *Contoh isian:*  
> `['key' => 'kepala_divisi_umum', 'value' => 'Nama Bapak X']` → Dicetak otomatis di ujung PDF BAST.  
> `['key' => 'ml_api_url', 'value' => 'http://127.0.0.1:8000/predict']` → Endpoint API prediksi.

---

**RELASI**

1. Relasi Data Induk (Master Data)

**Tabel categories (Model: Category)**

* **hasMany ke tabel items**: Satu kategori (misal: Amplop) bisa memiliki banyak jenis barang (Amplop Kaca, Amplop Coklat).

**Tabel items (Model: Item)**

* **belongsTo ke tabel categories**: Setiap satu barang pasti masuk ke dalam satu kategori.  
* **hasMany ke tabel inbound_transaction_details**: Satu barang bisa berulang kali masuk (dibeli/distok) di waktu yang berbeda.  
* **hasMany ke tabel outbound_transaction_details**: Satu barang bisa berulang kali diambil oleh berbagai divisi.  
* **hasMany ke tabel stock_ledgers**: Satu barang memiliki banyak riwayat mutasi (kartu stok).  
* **hasMany ke tabel demand_forecasts**: Satu barang memiliki banyak riwayat prediksi kebutuhan tiap bulannya.

**Tabel departments (Model: Department)**

* **hasMany ke tabel outbound_transactions**: Satu unit kerja (misal: Unit KSG) bisa melakukan permintaan formulir/barang berkali-kali ke gudang.

---

### **2. Relasi Transaksi (Warehouse Operations)**

**Tabel users (Model: User)**

* **hasMany ke tabel inbound_transactions**: Satu Admin Gudang bisa mencatat banyak transaksi barang masuk.  
* **hasMany ke tabel outbound_transactions (sebagai requester)**: Satu Staf/Pegawai bisa mengajukan banyak permintaan barang keluar.  
* **hasMany ke tabel outbound_transactions (sebagai approver)**: Satu Admin Gudang bisa menyetujui banyak formulir pengeluaran barang.

**Tabel inbound_transactions (Model: InboundTransaction)**

* **belongsTo ke tabel users**: Setiap bukti barang masuk dicatat oleh satu Admin spesifik.  
* **hasMany ke tabel inbound_transaction_details**: Satu nomor referensi surat jalan masuk bisa berisi daftar banyak barang (keranjang masuk).

**Tabel inbound_transaction_details (Model: InboundTransactionDetail)**

* **belongsTo ke tabel inbound_transactions**: Detail ini adalah bagian dari satu keranjang transaksi masuk.  
* **belongsTo ke tabel items**: Detail ini merujuk pada satu barang spesifik di master data.

**Tabel outbound_transactions (Model: OutboundTransaction)**

* **belongsTo ke tabel users (sebagai requester)**: Formulir ini diajukan oleh satu Staf/Pegawai yang *login* dan meminta barang.  
* **belongsTo ke tabel users (sebagai approver)**: Formulir ini disetujui oleh satu Admin Gudang. Nilainya *Null* saat status masih *Pending*.  
* **belongsTo ke tabel departments**: Formulir pengeluaran ini ditujukan untuk satu divisi peminta.  
* **hasMany ke tabel outbound_transaction_details**: Satu formulir SPB bisa berisi permintaan banyak jenis barang sekaligus (keranjang keluar).

**Tabel outbound_transaction_details (Model: OutboundTransactionDetail)**

* **belongsTo ke tabel outbound_transactions**: Detail ini menempel pada satu formulir pengeluaran spesifik.  
* **belongsTo ke tabel items**: Detail ini merujuk pada satu barang spesifik yang sedang diambil.

---

### **3. Relasi Enterprise & Machine Learning (Core System)**

**Tabel stock_ledgers (Model: StockLedger)**

* **belongsTo ke tabel items**: Setiap baris mutasi di buku besar ini adalah riwayat pergerakan milik satu barang spesifik.  
* *(Catatan: Tabel ini berdiri secara independen merekam jejak, sehingga tidak di-relasi-kan langsung secara hard-code ke tabel transaksi demi alasan keamanan agar mutasi tidak ikut terhapus kalau transaksi dibatalkan).*

**Tabel demand_forecasts (Model: DemandForecast)**

* **belongsTo ke tabel items**: Setiap hasil prediksi dari algoritma XGBoost ditujukan untuk satu barang spesifik.

