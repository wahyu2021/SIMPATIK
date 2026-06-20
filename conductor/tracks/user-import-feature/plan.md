# Track: Fitur Import User massal via Excel/CSV

## Metadata
- **Track ID**: `user-import-feature`
- **Status**: ✅ Completed
- **Prioritas**: Menengah
- **Deskripsi**: Menambahkan fitur agar Bagian Umum dapat mengimpor data karyawan secara massal menggunakan file Excel (.xlsx) atau CSV (misalnya hasil *export* dari Google Forms).

---

## Latar Belakang
Bagian Umum (General Affairs) saat ini harus menginput data karyawan satu per satu ketika mendaftarkan akun baru. Jika ada *batch* karyawan baru atau transisi sistem, proses ini sangat tidak efisien. Memanfaatkan *package* `maatwebsite/excel` yang sudah terpasang, kita bisa membuat fitur impor otomatis lengkap dengan validasi.

---

## Tahap 1: Backend Logic (Import Class & Controller)
> **Tujuan**: Membuat penangkap file Excel hasil ekspor Google Forms, melakukan *parsing*, dan menyimpan ke tabel users dengan relasi *role* dan *department* yang tepat.

### Task 1.1 — Membuat Class Import (`UsersImport.php`)
- [ ] Buat file `app/Imports/UsersImport.php`.
- [ ] Implementasikan antarmuka `ToCollection` dan `WithHeadingRow` dari Laravel Excel.
- [ ] *Logic Mapping*:
  - Baca judul kolom (header) yang biasa dihasilkan Google Forms (contoh: *slug* dari "Nama Lengkap" menjadi `nama_lengkap`, "Email" menjadi `email`, "Role" menjadi `role`, "Unit Kerja" menjadi `unit_kerja`).
  - Lakukan pencarian `department_id` di database yang namanya mirip dengan isian kolom Unit Kerja.
  - Buat *User* baru dengan *password default* (misal: `Simpatik123!`).
  - *Assign Role* menggunakan Spatie Permission.

### Task 1.2 — Update Controller & Route
- [ ] Buka `app/Http/Controllers/UserController.php`.
- [ ] Tambahkan *method* `import(Request $request)` yang memvalidasi ekstensi file (hanya menerima `csv`, `xlsx`, `xls`).
- [ ] Eksekusi `Excel::import(new UsersImport, $request->file('file'))` di dalam *method* tersebut.
- [ ] Buka `routes/web.php` dan tambahkan *route* `POST /users/import`.

---

## Tahap 2: Frontend & UI Integration
> **Tujuan**: Menyediakan antarmuka bagi Bagian Umum untuk mengunggah file hasil *download* dari Google Sheets/Forms langsung ke sistem.

### Task 2.1 — Membuat Komponen Modal Import
- [ ] Buat file komponen baru `resources/js/Components/Features/Users/ImportUserModal.tsx`.
- [ ] Buat *form* dengan elemen *File Input* (hanya menerima file Excel/CSV).
- [ ] Integrasikan `useForm` dari Inertia.js untuk menampilkan *progress bar* saat proses *upload* berjalan.

### Task 2.2 — Update Halaman User Index
- [ ] Buka `resources/js/Pages/Users/Index.tsx`.
- [ ] Tambahkan tombol "Import dari GForm" dengan *icon upload* (diletakkan bersebelahan dengan tombol "+ Tambah User").
- [ ] Pasang *state* manajemen modal untuk membuka/menutup `ImportUserModal`.
- [ ] Pastikan notifikasi (*flash message*) sukses atau gagal (misal jika ada baris dengan email duplikat) muncul di layar pengguna.
