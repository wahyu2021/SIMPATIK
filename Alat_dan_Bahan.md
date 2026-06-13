### 4.5.1 Alat dan Bahan

**a. Alat**  
Dalam proses pengerjaan dan perancangan Sistem Manajemen Persediaan ATK (SIMPATIK) berbasis website pada PT. Bank Pembangunan Daerah Sumatera Selatan dan Bangka Belitung Cabang Utama Kapten A. Rivai, diperlukan alat bantu berupa komputer/laptop yang terdiri dari perangkat keras (*hardware*) dan perangkat lunak (*software*).

**1. Perangkat Keras (*Hardware*)**  
Perangkat keras mencakup peralatan komputasi lokal untuk tahap *development* dan infrastruktur *cloud* untuk tahap *production* (publikasi/hosting). Adapun spesifikasi yang digunakan adalah:
*   **Perangkat Lokal (Development):**
    1. Laptop Windows 64-bit
    2. Processor AMD Ryzen 5 6600H with Radeon Graphics (3.30 GHz)
    3. RAM 16.0 GB 
    4. GPU NVIDIA GeForce RTX 3050 (6 GB)
    5. Penyimpanan SSD 512 GB
*   **Perangkat Server (Production):**
    6. Virtual Private Server (VPS) Cloud Hosting
    7. Spesifikasi VPS: `[Isi dengan spesifikasi VPS Anda, misal: 1 vCPU, 2 GB RAM, 25 GB NVMe SSD]`

**2. Perangkat Lunak (*Software*)**  
Perangkat lunak mencakup program untuk perancangan, penulisan kode, hingga pengelolaan server di lingkungan *production*. Adapun perangkat lunak yang digunakan, yaitu:
*   **Perangkat Lunak Lokal (Development):**
    1. Sistem Operasi Windows 10/11 64-bit Original
    2. Antigravity IDE *(sebagai Code Editor)*
    3. Laragon *(sebagai Web Server lokal dan Database Server)*
    4. Google Chrome *(sebagai Web Browser untuk pengujian)*
    5. SSH Client / Terminal *(untuk akses *remote* dan deploy ke server VPS)*
    6. Mermaid / Draw.io *(untuk merancang diagram UML)*
    7. Microsoft Word *(untuk penyusunan laporan)*
*   **Lingkungan Server & Framework (Production):**
    8. Sistem Operasi Server: `[Isi dengan OS VPS Anda, misal: Ubuntu 22.04 LTS]`
    9. Web Server Production: `[Isi dengan Web Server VPS, misal: Nginx / Apache]`
    10. PHP & Laravel Framework *(sebagai bahasa dan kerangka kerja Backend)*
    11. Node.js & ReactJS *(sebagai kerangka kerja Frontend)*
    12. Node.js & Library Baileys (`@whiskeysockets/baileys`) *(sebagai service WhatsApp Gateway API)*
    13. Python *(untuk API Machine Learning / Forecasting)*
    14. MySQL *(sebagai sistem manajemen basis data)*

---

### 4.5.2 Bahan

Bahan yang digunakan dalam perancangan Sistem Manajemen Persediaan ATK (SIMPATIK) berbasis website pada PT. Bank Pembangunan Daerah Sumatera Selatan dan Bangka Belitung Cabang Utama Kapten A. Rivai, di antaranya sebagai berikut:

1. **Data Profil Instansi Bank Sumsel Babel Cabang Utama Kapten A. Rivai**  
   Meliputi sejarah singkat instansi, logo perusahaan, visi dan misi, struktur organisasi, serta pembagian peran dan divisi yang ada di dalam instansi.
2. **Data dan Informasi Operasional Persediaan ATK (*Inventory*)**  
   Meliputi *Standard Operating Procedure* (SOP) alur permohonan ATK, struktur persetujuan (*approval*) berjenjang oleh Kepala Divisi, data master barang/kategori, serta mekanisme rekonsiliasi dan pencatatan mutasi barang di gudang.
3. **Format Dokumen Serah Terima**  
   Meliputi format fisik formulir Surat Permintaan Barang (SPB) dan Berita Acara Serah Terima (BAST) yang nantinya didigitalisasi ke dalam format cetak PDF pada sistem.
4. **Data Akun dan Nomor WhatsApp Notifikasi**  
   Meliputi akun atau nomor telepon WhatsApp aktif yang akan dihubungkan (*pairing* melalui QR Code) dengan sistem gateway sebagai pengirim pesan notifikasi otomatis (persetujuan, peringatan stok, dll) ke *user*.
