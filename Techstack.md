### 1. Core System (Backend & Frontend UI)
Karena kita membuang Inertia/React dan kembali ke ekosistem murni, ini adalah pondasi utamamu:
* **Framework Inti:** Laravel (Versi 10 atau 11) - *Sebagai penyedia struktur database, routing, dan API Client.*
* **Admin Panel & UI Framework:** Filament PHP (Versi 3) - *Berjalan di atas TALL stack bawaannya. Menangani seluruh antarmuka pengguna (baik Admin Gudang maupun Staf Divisi).*
* **Styling:** Tailwind CSS - *Bawaan Filament untuk merapikan desain form dan tabel.*

### 2. Database & Storage
* **Relational Database:** MySQL atau PostgreSQL - *Untuk menyimpan master data barang, data user, histori transaksi, dan *audit log*.*
* **File Storage:** Local Storage Laravel (`storage/app/public`) - *Untuk menyimpan file fisik gambar tanda tangan (`.png`) hasil *onboarding* user.*

### 3. Machine Learning Microservice (Otak Prediksi)
Ini berjalan sebagai *server* terpisah (API) yang akan dihubungi oleh Laravel:
* **Bahasa Pemrograman:** Python (Versi 3.9+)
* **Web Framework:** FastAPI - *Sangat ringan dan super cepat untuk membuat endpoint API.*
* **ML Algorithm:** XGBoost (`xgboost`) - *Algoritma utama untuk peramalan (forecasting) kebutuhan barang ATK.*
* **Data Processing:** Pandas (`pandas`) dan NumPy (`numpy`) - *Untuk mengolah data historis JSON dari Laravel sebelum dimasukkan ke model XGBoost.*

---

### 4. Daftar Plugin & Package Wajib (Composer)
Ini adalah "Cheat Code" yang wajib kamu *install* di Laravel agar fiturnya langsung berjalan tanpa koding manual berbulan-bulan:

* **`filament/filament`** (Bawaan)
  Paket utama untuk membuat CRUD Master Data dan Dashboard dengan sangat cepat.
* **`coolsam/signature-pad`** (Atau alternatifnya: `creagia/filament-signature-pad`)
  Ini adalah *plugin* kuncian untuk halaman "Mandatory Onboarding". Digunakan sekali oleh *user* saat melengkapi profil untuk menggambar tanda tangan mereka agar bisa disimpan di *database*.
* **`spatie/laravel-permission`**
  Karena semua *user* (Admin Gudang & Staf Divisi) login ke satu portal Filament yang sama, *plugin* ini wajib dipasang. Fungsinya untuk membatasi hak akses. (Contoh: Staf cuma bisa lihat menu "Pengajuan", Admin bisa lihat semua menu gudang).
* **`barryvdh/laravel-dompdf`**
  Digunakan untuk mengekspor data BAST (Berita Acara Serah Terima) dari HTML ke wujud file PDF. Di file PDF inilah kamu nanti akan menempelkan teks *"Approval by System"* dan menempelkan gambar tanda tangan otomatis dari *database*.
* **`simplesoftwareio/simple-qrcode`** *(Opsional tapi Sangat Disarankan)*
  Untuk men- *generate* QR Code di bagian bawah cetakan dokumen PDF sebagai bukti tambahan bahwa dokumen tersebut sah dikeluarkan oleh sistem bank, memperkuat konsep *"By System"* yang diminta dospem-mu.