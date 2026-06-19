# Workflow & Status Proyek: SIMPATIK (Aktual)

## Status Implementasi Modul
Berdasarkan peninjauan kode terbaru pada branch `dev`:

| Modul | Status | Keterangan |
|-------|--------|------------|
| **Auth & Signature** | ✅ Selesai | Login, Onboarding TTD, Middleware signature. |
| **Dashboard** | ✅ Selesai | Statistik terintegrasi per role. |
| **User Management** | ✅ Selesai | CRUD User + Role + Toggle Status. |
| **Kategori** | ✅ Selesai | CRUD Kategori dengan hitung barang. |
| **Unit Kerja** | ✅ Selesai | CRUD Department dengan hitung user. |
| **Barang (Items)** | ✅ Selesai | CRUD, Auto-code, Filter Stok Rendah. |
| **Barang Masuk** | ✅ Selesai | Form transaksi masuk & update stok. |
| **Pengajuan Keluar** | ✅ Selesai | Workflow Approval, Issue, Handover, Pickup. |
| **Laporan (Reports)** | 🟡 Finishing | Stock Ledger, Reconciliation, Breakdown. |
| **Pengaturan** | ✅ Selesai | Update parameter sistem (ML URL, dll). |
| **PDF Generator** | 🔲 Direncanakan | Integrasi DomPDF untuk dokumen resmi. |

## Alur Pengembangan
1. **Research**: Menganalisis kebutuhan formulir fisik Bank BSB.
2. **Strategy**: Membangun skema DB dan pola Repository/Service.
3. **Execution**:
   - Backend: Migrasi -> Repository -> Service -> Controller.
   - Frontend: Page -> Features -> UI Components.
4. **Validation**: Testing alur transaksi dari sisi Staff, Penyelia, hingga Admin Gudang.

## Catatan Kolaborasi
- **Restrukturisasi Role**: Sesuai revisi, Admin Gudang difokuskan murni untuk pengeluaran barang (outbound). Bagian Umum mengambil alih tanggung jawab penuh atas data master (Kategori, Barang, Unit Kerja), manajemen user, pengaturan sistem, dan barang masuk (inbound).
- **Penyederhanaan Laporan**: Sesuai arahan dosen, seluruh elemen harga/nilai (Rp) telah dihapus dari modul laporan dan dashboard untuk fokus pada kuantitas stok. Input harga pada barang dan transaksi masuk kini bersifat opsional.
- Struktur kode sudah sangat konsisten mengikuti pola Repository-Service.
- Penambahan fitur baru harus selalu mengikuti pola ini:
  1. Definisikan Interface di `Contracts`.
  2. Implementasikan di `Eloquent` Repository.
  3. Daftarkan di `RepositoryServiceProvider`.
  4. Tambahkan logika di `Service`.
  5. Panggil melalui `Controller`.
