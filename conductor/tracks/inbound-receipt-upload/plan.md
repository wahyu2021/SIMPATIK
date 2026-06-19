# Track: Upload Bukti Transaksi / Nota pada Barang Masuk

## Metadata
- **Track ID**: `inbound-receipt-upload`
- **Status**: ✅ Completed
- **Prioritas**: Sedang
- **Deskripsi**: Menambahkan fitur upload foto/scan bukti transaksi (nota/faktur/surat jalan) pada saat input Barang Masuk (Inbound), agar setiap transaksi penerimaan barang memiliki dokumen pendukung digital.

---

## Latar Belakang

### Kondisi Saat Ini
- Formulir Barang Masuk hanya menerima data teks/angka: `reference_number`, `transaction_date`, `notes`, dan array `details` (item + qty + harga).
- Tidak ada kolom untuk menyimpan file bukti transaksi di database (`inbound_transactions`).
- Submission form menggunakan Inertia `post()`/`put()` standar (JSON), **bukan** multipart/form-data.
- Satu-satunya pola upload file di proyek ini adalah trait `HasSignature` pada model User (base64 → decode → `Storage::disk('public')`).

### Kebutuhan
- Bagian Umum yang menginput barang masuk dapat melampirkan **foto/scan nota** sebagai bukti transaksi.
- File yang di-upload bisa berupa gambar (JPG, PNG) atau dokumen PDF.
- Bukti bisa dilihat/diunduh dari halaman detail transaksi (Show page).
- Upload bersifat **wajib** — setiap transaksi barang masuk harus disertai bukti.

---

## Tahap 1: Migrasi Database & Update Model
> **Tujuan**: Menambahkan kolom penyimpanan path file bukti di tabel `inbound_transactions`.
> **Risiko**: Rendah — hanya menambahkan kolom baru yang nullable.

### Task 1.1 — Buat migrasi baru
- [x] Buat migrasi `add_receipt_image_path_to_inbound_transactions_table`
- [x] Tambahkan kolom `receipt_image_path` (string, **not nullable**) setelah kolom `notes`
- **File baru**: `database/migrations/xxxx_xx_xx_xxxxxx_add_receipt_image_path_to_inbound_transactions_table.php`

### Task 1.2 — Update Model `InboundTransaction`
- [x] Tambahkan `receipt_image_path` ke array `$fillable`
- [x] Tambahkan accessor `receipt_image_url` yang mengembalikan URL publik file via `Storage::disk('public')`
- **File**: `app/Models/InboundTransaction.php`

### Task 1.3 — Jalankan migrasi
- [x] Jalankan `php artisan migrate`
- [x] Verifikasi kolom baru sudah ada di database

### Checkpoint Tahap 1
- [x] Kolom `receipt_image_path` ada di tabel `inbound_transactions` (nullable)
- [x] Model sudah mengenali kolom baru dan accessor berfungsi

---

## Tahap 2: Backend — Validasi, Service, & Controller
> **Tujuan**: Menangani upload file di sisi backend mengikuti pola Repository-Service yang sudah ada.
> **Risiko**: Sedang — perlu memastikan upload file tidak mengganggu alur transaksi stok yang sudah ada (DB transaction + pessimistic locking).

### Task 2.1 — Update Form Request validasi
- [x] Tambahkan rule `receipt_image` di `StoreInboundRequest`:
  ```
  'receipt_image' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048'
  ```
- [x] Tambahkan rule di `UpdateInboundRequest` (nullable saat edit, karena file lama masih tersimpan jika tidak diganti):
  ```
  'receipt_image' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048'
  ```
- [x] Tambahkan pesan validasi Bahasa Indonesia
- **File**: `app/Http/Requests/StoreInboundRequest.php`, `app/Http/Requests/UpdateInboundRequest.php`

### Task 2.2 — Update `InboundService`
- [x] Pada method `createInbound()`:
  - Setelah transaksi DB berhasil, jika ada file `receipt_image`, simpan ke `Storage::disk('public')->putFile('inbound-receipts', $file)`
  - Update `receipt_image_path` pada record yang baru dibuat
- [x] Pada method `updateInbound()`:
  - Jika ada file baru, hapus file lama (jika ada) lalu simpan file baru
  - Jika tidak ada file baru, pertahankan path yang lama
- [x] Pada method `deleteInbound()`:
  - Hapus file dari storage sebelum menghapus record
- [x] Buat private helper method `storeReceiptImage($file): string` dan `deleteReceiptImage($path): void`
- **File**: `app/Services/InboundService.php`

### Task 2.3 — Update `InboundController`
- [x] Pada method `store()`: Teruskan file `receipt_image` dari request ke service
- [x] Pada method `update()`: Teruskan file `receipt_image` dari request ke service
- [x] Pada method `show()`: Pastikan `receipt_image_url` di-append saat mengirim data ke frontend
- [x] Pada method `edit()`: Pastikan `receipt_image_url` tersedia di props agar frontend bisa menampilkan preview file yang sudah ada
- **File**: `app/Http/Controllers/InboundController.php`

### Checkpoint Tahap 2
- [x] Upload file via Postman/cURL berhasil tersimpan di `storage/app/public/inbound-receipts/`
- [x] File lama terhapus saat update dengan file baru
- [x] File terhapus saat transaksi di-delete
- [x] Validasi gagal jika file > 2MB atau format salah

---

## Tahap 3: Frontend — Form Upload & Preview
> **Tujuan**: Menambahkan input file di form Barang Masuk dan preview gambar/PDF di halaman detail.
> **Risiko**: Sedang — perlu mengubah cara form submit dari JSON biasa menjadi multipart/form-data agar file bisa dikirim.

### Task 3.1 — Update TypeScript Types
- [x] Tambahkan field `receipt_image_path?: string` dan `receipt_image_url?: string` di interface `InboundTransaction`
- **File**: `resources/js/Types/index.ts`

### Task 3.2 — Update Form.tsx (Halaman Create/Edit)
- [x] Tambahkan field `receipt_image` (File | null) ke form data
- [x] Tambahkan komponen input file dengan:
  - Label: "Bukti Transaksi / Nota" **(Wajib)**
  - Placeholder/hint: "Upload foto atau scan nota (JPG, PNG, PDF, maks 2MB)"
  - Validasi: form tidak bisa disubmit tanpa file (mode create)
  - Preview gambar jika file dipilih (atau jika mode edit dan sudah ada file)
  - Tombol hapus preview
- [x] Ubah method submit agar menggunakan `router.post()` dengan `forceFormData: true` (Inertia otomatis mengkonversi ke multipart/form-data)
- [x] Untuk mode edit, gunakan `_method: 'PUT'` di body agar Laravel mengenali sebagai PUT request (method spoofing)
- **File**: `resources/js/Pages/Inbound/Form.tsx`

### Task 3.3 — Update Show.tsx (Halaman Detail)
- [x] Tambahkan section "Bukti Transaksi" di halaman detail
- [x] Jika file adalah gambar (JPG/PNG): tampilkan preview gambar dengan opsi klik untuk memperbesar (lightbox/modal)
- [x] Jika file adalah PDF: tampilkan link download
- [x] Jika tidak ada file: tampilkan teks "Tidak ada bukti transaksi"
- **File**: `resources/js/Pages/Inbound/Show.tsx`

### Checkpoint Tahap 3
- [x] Form Create: wajib memilih file, submit gagal jika tanpa file, preview tampil, submit berhasil, file tersimpan
- [x] Form Edit: file lama tampil sebagai preview, bisa diganti dengan file baru
- [x] Halaman Detail: gambar/PDF tampil dengan benar
- [x] Validasi frontend: pesan error tampil jika file tidak diisi (create), terlalu besar, atau format salah

---

## Tahap 4: Polish & Dokumentasi
> **Tujuan**: Penyempurnaan UI dan update dokumentasi Conductor.
> **Risiko**: Tidak ada.

### Task 4.1 — Tambahkan indikator bukti di tabel Index
- [x] Pada halaman daftar Barang Masuk (Index), tambahkan ikon/badge kecil yang menandakan apakah transaksi sudah memiliki bukti atau belum (misal: ikon paperclip atau badge "Ada Bukti")
- **File**: `resources/js/Components/Features/Inbound/InboundTable.tsx`

### Task 4.2 — Update dokumentasi Conductor
- [x] Update `conductor/workflow.md` jika ada status modul yang berubah
- [x] Tandai track ini sebagai ✅ Completed di `conductor/tracks.md`
- **File**: `conductor/tracks.md`, `conductor/workflow.md`

### Checkpoint Tahap 4
- [x] Alur end-to-end berfungsi: create (dengan & tanpa bukti) → view detail → edit (ganti bukti) → delete (bukti ikut terhapus)
- [x] Semua file dokumentasi sudah ter-updateus)
- [ ] Semua file dokumentasi sudah ter-update

---

## File yang Terdampak (Ringkasan)

| File | Tahap | Jenis Perubahan |
|---|---|---|
| `database/migrations/xxxx_add_receipt_image_path_to_inbound_transactions_table.php` | 1 | File baru (migrasi) |
| `app/Models/InboundTransaction.php` | 1 | Update fillable + accessor |
| `app/Http/Requests/StoreInboundRequest.php` | 2 | Tambah rule validasi file |
| `app/Http/Requests/UpdateInboundRequest.php` | 2 | Tambah rule validasi file |
| `app/Services/InboundService.php` | 2 | Handle upload/delete file |
| `app/Http/Controllers/InboundController.php` | 2 | Teruskan file ke service + append URL |
| `resources/js/Types/index.ts` | 3 | Tambah field di interface |
| `resources/js/Pages/Inbound/Form.tsx` | 3 | Input file + preview + multipart submit |
| `resources/js/Pages/Inbound/Show.tsx` | 3 | Tampilkan preview bukti |
| `resources/js/Components/Features/Inbound/InboundTable.tsx` | 4 | Indikator bukti |
| `conductor/tracks.md` | 4 | Daftarkan track |
| `conductor/workflow.md` | 4 | Update catatan |

---

## Referensi Teknis

### Pola Upload di Inertia.js (React)
```tsx
// Menggunakan router.post dengan forceFormData untuk multipart upload
router.post('/inbound', {
    ...formData,
    receipt_image: selectedFile,  // File object
}, {
    forceFormData: true,  // Inertia otomatis buat FormData
});

// Untuk update (PUT) via method spoofing:
router.post(`/inbound/${id}`, {
    _method: 'PUT',
    ...formData,
    receipt_image: selectedFile,
}, {
    forceFormData: true,
});
```

### Pola Storage di Laravel
```php
// Simpan file
$path = Storage::disk('public')->putFile('inbound-receipts', $request->file('receipt_image'));

// Ambil URL publik
$url = Storage::disk('public')->url($path);

// Hapus file
Storage::disk('public')->delete($path);
```
