# Rencana Ulang: Relevansi Dashboard per Role

Masalah: Dashboard saat ini mencoba menggunakan "satu ukuran untuk semua", menampilkan 8 kartu statistik yang sebagian besar informasinya tidak relevan bagi Staff atau Penyelia.

## Desain Metrik Berdasarkan Role (Kebutuhan Nyata)

### 1. Admin Gudang (Fokus: Operasional & Ketersediaan Barang)
Admin adalah pengelola utama sistem. Metrik yang relevan:
*   **Permintaan Disetujui (Siap Proses)**: Berapa banyak barang yang harus dikeluarkan hari ini (Status: `Approved`).
*   **Stok Kritis**: Jumlah barang yang harus segera dipesan ke vendor.
*   **Total Barang Keluar (Bulan Ini)**: Volume barang yang meninggalkan gudang.
*   **Total Barang Masuk (Bulan Ini)**: Volume barang baru dari vendor.
*(Katalog Barang, Kategori, Unit Kerja bisa disatukan dalam satu card ringkasan master data, atau dihapus jika tidak perlu).*

### 2. Penyelia / Kepala Unit (Fokus: Pengawasan Internal Unit)
Penyelia tidak peduli dengan stok gudang secara umum, mereka peduli dengan efisiensi dan kegiatan anggotanya.
*   **Perlu Persetujuan Anda**: Berapa formulir dari anak buah yang menunggu tanda tangan (Status: `Pending`).
*   **Menunggu Gudang**: Permintaan unit yang sudah disetujui tapi belum dikeluarkan admin (Status: `Approved`).
*   **Barang Diterima Unit (Bulan Ini)**: Total barang yang berhasil masuk ke ruangan unit tersebut.
*   **Anggota Tim Aktif**: Jumlah staff di bawah unitnya.

### 3. Staff / Pemohon (Fokus: Permintaan Pribadi)
Staff hanya ingin tahu: "Barang saya sampai mana?"
*   **Draft / Menunggu Persetujuan**: Formulir yang masih tertahan di atasan (Status: `Pending`).
*   **Menunggu Gudang**: Formulir yang sedang disiapkan admin (Status: `Approved`).
*   **Siap Diambil**: Barang yang sudah bisa diambil di gudang dan menunggu staf klik terima (Status: `Handed Over`).
*   **Riwayat (Bulan Ini)**: Total barang yang berhasil ia terima bulan ini.

## Langkah Eksekusi (Backend & Frontend)
1.  **Backend (`DashboardRepository` & `DashboardService`)**:
    Ubah fungsi `getStats()` agar memanggil method yang berbeda berdasarkan tipe rolenya, sehingga JSON yang dihasilkan lebih dinamis.
2.  **Frontend (`StatsGrid.tsx`)**:
    Buat komponen terpisah untuk me-render *cards* (misal: `AdminStats`, `SupervisorStats`, `StaffStats`). Ini akan menghilangkan kompleksitas logika `if/else` yang berlebihan.
