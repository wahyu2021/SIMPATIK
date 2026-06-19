# Track: Penyesuaian Fitur & Hak Akses Penyelia

## Metadata
- **Track ID**: `penyelia-role-refinement`
- **Status**: ✅ Completed
- **Prioritas**: Menengah
- **Deskripsi**: Mencabut hak akses Master Data yang tidak diperlukan oleh Penyelia dan menambahkan hak agar Penyelia dapat membuat pengajuan barangnya sendiri layaknya staf.

---

## Latar Belakang
Berdasarkan evaluasi terhadap *User Experience* (UX) dan logika birokrasi:
1. **Menu Master Data (Katalog/Kategori) Mubazir**: Penyelia tidak membutuhkan akses ke halaman Master Data karena mereka cukup memilih barang dari *dropdown* saat pengajuan. Menampilkan menu ini hanya akan membingungkan.
2. **Keterbatasan Pengajuan Mandiri**: Saat ini Penyelia tidak memiliki izin `create-outbound-request`. Akibatnya, mereka tidak bisa membuat permintaan barang untuk diri mereka sendiri dan harus bergantung pada staf.

---

## Tahap 1: Backend Role Configuration
> **Tujuan**: Memperbaiki definisi izin (*permissions*) untuk *role* `division_head` di *source code* dan menyinkronkannya ke dalam database.

### Task 1.1 — Update Enum UserRole
- [ ] Buka `app/Enums/UserRole.php`.
- [ ] Pada *case* `DIVISION_HEAD`, **hapus** *permission* `view-items` dan `view-categories`.
- [ ] **Tambahkan** *permission* `create-outbound-request` dan `view-own-requests`.

### Task 1.2 — Database Sync (Seeder)
- [ ] Jalankan perintah sinkronisasi permission: `php artisan db:seed --class=RolePermissionSeeder`.
  *(Perintah ini akan secara otomatis memperbarui tabel `role_has_permissions` di database sesuai dengan file `UserRole.php` yang baru, berkat mekanisme sinkronisasi bawaan kita).*

---

## Tahap 2: Frontend Navigation Adjustment
> **Tujuan**: Menghilangkan menu yang tidak relevan dari layar Penyelia.

### Task 2.1 — Update Navigation Config
- [ ] Buka `resources/js/Config/navigation.ts`.
- [ ] Pada grup "Master Data", hapus `'division_head'` dari *array* `roles` pada *item* "Barang".
- [ ] Hapus `'division_head'` dari *array* `roles` pada *item* "Kategori".

---

## Tahap 3: Verifikasi Policy & UI Outbound
> **Tujuan**: Memastikan Penyelia melihat tombol "+ Buat Pengajuan" dan form berjalan mulus tanpa *error* otorisasi.

### Task 3.1 — Verifikasi Komponen UI
- [ ] Buka `resources/js/Pages/Outbound/Index.tsx` atau komponen tabel terkait.
- [ ] Pastikan tombol "Buat Pengajuan" bisa terlihat oleh Penyelia (biasanya sudah dinamis berdasarkan otorisasi dari Laravel Inertia `auth.user`, tapi perlu dicek visualisasinya).

### Task 3.2 — Testing
- [ ] Login menggunakan akun Penyelia.
- [ ] Pastikan menu "Master Data" benar-benar hilang dari *sidebar*.
- [ ] Klik menu "Pengajuan Barang" dan pastikan ada tombol untuk membuat pengajuan baru.
- [ ] Coba buat satu pengajuan uji coba untuk membuktikan Penyelia bisa beroperasi sebagai pemohon (*requester*).
- [ ] Tandai track sebagai ✅ Completed jika sukses.
