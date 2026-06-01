# Implementation Plan: Laporan per Unit Kerja

Sesuai masukan dari dosen, sistem harus memiliki laporan yang menjabarkan penggunaan/pengeluaran barang secara spesifik untuk setiap unit kerja dalam periode tertentu.

## Goals
- Menyediakan tab "Laporan Unit Kerja" di menu Laporan.
- Menampilkan rincian daftar barang dan total kuantitas yang diambil oleh satu unit kerja spesifik dalam satu bulan.
- Memungkinkan Admin untuk mengekspor atau mencetak laporan ini sebagai bahan evaluasi penggunaan anggaran/stok tiap departemen.

## Task List
- [x] **Backend - Repository & Service**:
    - [x] Tambahkan method `getReportByDepartment` di `ReportRepositoryInterface` dan `ReportRepository` untuk melakukan agregasi `SUM(quantity_approved)` dari `outbound_transactions` berdasarkan `department_id`.
    - [x] Tambahkan method pemrosesan di `ReportService`.
- [x] **Backend - Controller**:
    - [x] Tambahkan method `departmentReport` di `ReportController`.
    - [x] Daftarkan route baru (misal: `/reports/department`).
- [x] **Frontend - Navigation & Layout**:
    - [x] Tambahkan tab "Laporan Unit" ke dalam komponen `ReportTabs.tsx`.
- [x] **Frontend - Page Component**:
    - [x] Buat `resources/js/Pages/Reports/Department.tsx`.
    - [x] Tampilkan filter (Bulan, Tahun, Unit Kerja).
    - [x] Buat tabel laporan yang memuat: No, Kode Barang, Nama Barang, Satuan, Jumlah Diambil.

## Definition of Done
- Admin (dan Penyelia, untuk unitnya sendiri) dapat melihat rincian barang apa saja yang dihabiskan oleh Unit Kerja tertentu pada bulan tertentu.
- Laporan murni berfokus pada kuantitas tanpa menyinggung nilai/harga (Rupiah).
