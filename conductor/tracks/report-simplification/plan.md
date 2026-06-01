# Implementation Plan: Penyederhanaan Laporan (Hapus Harga)

*Goal*: Menghapus seluruh elemen finansial (Harga, Nilai Aset, Rupiah) dari antarmuka dan laporan sistem untuk fokus pada manajemen kuantitas stok sesuai arahan dosen.

## Phase 1: Backend Refactoring
- [x] **ReportRepository.php**: Hapus query `SUM(quantity * unit_price)` pada method `getInboundTotals`.
- [x] **ReportService.php**: 
    - [x] Hapus properti `opening_value`, `inbound_value`, `outbound_value`, dan `closing_value` dari kalkulasi `getSaldistat`.
    - [x] Sederhanakan method `buildItemRow` untuk hanya memproses kuantitas (`qty`).
- [x] **DashboardController/Service**: Pastikan tidak ada pengiriman data "Total Nilai Aset" ke dashboard. (Sudah dikonfirmasi bersih).

## Phase 2: Frontend Refactoring
- [x] **MutationTable.tsx**:
    - [x] Ganti nama komponen dari SaldistatTable menjadi MutationTable.
    - [x] Hapus kolom "Harga Satuan".
    - [x] Hapus kolom "Nilai" pada setiap grup (Saldo Awal, Masuk, Keluar, Saldo Akhir).
    - [x] Sesuaikan footer/subtotal agar hanya menjumlahkan kuantitas barang.
- [x] **Index.tsx (Reports)**:
    - [x] Ganti terminologi "Saldistat" menjadi "Rekapitulasi Mutasi Barang".
    - [x] Sesuaikan Summary Cards untuk menampilkan kuantitas stok.
- [x] **Items/Form.tsx**: 
    - [x] Ubah input `unit_price` menjadi opsional untuk meminimalisir input manual yang tidak diperlukan.
- [x] **Inbound Requests**: Buat `unit_price` menjadi opsional pada transaksi masuk.

## Phase 3: Documentation Update
- [x] Update `conductor/product.md` untuk menghilangkan istilah "Nilai Aset".
- [x] Update `conductor/workflow.md` untuk mencatat perubahan scope.

## Definition of Done
- Seluruh halaman laporan (`Index`, `StockLedger`, `Reconciliation`) tidak lagi menampilkan simbol "Rp" atau kolom Harga/Nilai.
- Dashboard menampilkan statistik berbasis volume transaksi, bukan nilai uang.
- Tidak ada error "undefined property" di backend akibat penghapusan field tersebut.
