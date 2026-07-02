# Plan: Redesign Halaman Login

## Tahap 1: Persiapan Aset & Background Image

> **Tujuan**: Menyiapkan aset background image dan memastikan resource siap digunakan.

### Task 1.1 — Siapkan Background Image
- [ ] Dapatkan atau generate foto/gambar gedung Bank Sumsel Babel
- [ ] Simpan gambar dalam format WebP ke `public/images/login-bg.webp`
- [ ] Pastikan ukuran gambar optimal (resolusi cukup untuk full-screen tanpa terlalu besar, target < 500KB)
- **File**: `public/images/login-bg.webp`

### Task 1.2 — Verifikasi Aset yang Sudah Ada
- [ ] Pastikan `public/images/logo.webp` masih ada dan dapat digunakan
- [ ] Periksa apakah ada CSS/styling global yang bisa mempengaruhi halaman login

## Tahap 2: Redesign Komponen Login Page

> **Tujuan**: Implementasi redesign halaman login sesuai spesifikasi.

### Task 2.1 — Redesign `Login.tsx` (Halaman Utama)
- [ ] Hapus import `DemoCredentials` dan `FeatureCard`
- [ ] Hapus seluruh panel kanan (5 feature cards)
- [ ] Hapus link "Hubungi IT Support" di mobile view
- [ ] Ubah layout menjadi single-column centered
- [ ] Tambahkan background image full-screen dengan dark overlay
- [ ] Implementasi fallback gradient biru (#003366) jika gambar gagal dimuat
- [ ] Pertahankan elemen: logo, nama "SIMPATIK", subtitle, nama institusi, LoginForm, footer copyright
- [ ] Pastikan card form login memiliki styling clean dan profesional (bukan glassmorphism/glow)
- **File**: `resources/js/Pages/Auth/Login.tsx`

### Task 2.2 — Tambahkan Entrance Animation
- [ ] Buat CSS keyframes untuk animasi fade-in + slide-up
- [ ] Terapkan animasi pada card form login saat halaman dimuat
- [ ] Durasi animasi 300-500ms dengan easing yang halus
- [ ] Animasi menggunakan CSS murni (tanpa library tambahan)
- **File**: `resources/js/Pages/Auth/Login.tsx` (inline styles atau CSS module)

### Task 2.3 — Responsiveness & Cross-Device Testing
- [ ] Pastikan card form login terlihat baik di mobile (< 640px)
- [ ] Pastikan card form login terlihat baik di tablet (640px - 1024px)
- [ ] Pastikan card form login terlihat baik di desktop (> 1024px)
- [ ] Verifikasi background image ditampilkan dengan `object-cover` agar proporsional
- [ ] Pastikan overlay cukup gelap agar teks form tetap terbaca (contrast ratio WCAG AA)
- **File**: `resources/js/Pages/Auth/Login.tsx`

## Tahap 3: Cleanup & Verifikasi

> **Tujuan**: Membersihkan kode yang tidak terpakai dan verifikasi akhir.

### Task 3.1 — Cleanup Komponen yang Tidak Terpakai
- [ ] Periksa apakah `DemoCredentials` component masih digunakan di tempat lain
- [ ] Jika tidak digunakan di tempat lain, tandai sebagai deprecated atau hapus file-nya
- [ ] Periksa apakah `FeatureCard` component masih digunakan di tempat lain
- [ ] Jika tidak digunakan di tempat lain, tandai sebagai deprecated atau hapus file-nya
- **File**: `resources/js/Components/Features/Auth/DemoCredentials.tsx`, `resources/js/Components/Fragments/FeatureCard.tsx`

### Task 3.2 — Verifikasi Akhir
- [ ] Jalankan `npm run build` untuk memastikan tidak ada error kompilasi
- [ ] Verifikasi visual halaman login di browser
- [ ] Pastikan semua acceptance criteria terpenuhi:
  - Card form login centered dengan background image full-screen
  - Tidak ada feature cards atau DemoCredentials
  - Animasi entrance berjalan
  - Responsif di semua device
  - Desain clean dan profesional
  - Fallback gradient biru bekerja

## Tahap 4: Dokumentasi & Finalisasi

> **Tujuan**: Update dokumentasi Conductor dan finalisasi track.

### Task 4.1 — Update Dokumentasi Conductor
- [ ] Update `conductor/workflow.md` jika ada status modul yang berubah
- [ ] Tandai track ini sebagai ✅ Completed di `conductor/tracks.md`
- **File**: `conductor/tracks.md`, `conductor/workflow.md`

## Ringkasan File yang Dimodifikasi

| File | Tahap | Aksi |
|------|-------|------|
| `public/images/login-bg.webp` | 1 | Aset baru (background image) |
| `resources/js/Pages/Auth/Login.tsx` | 2 | Redesign total layout & styling |
| `resources/js/Components/Features/Auth/DemoCredentials.tsx` | 3 | Potensi hapus/deprecated |
| `resources/js/Components/Fragments/FeatureCard.tsx` | 3 | Potensi hapus/deprecated |
| `conductor/tracks.md` | 4 | Update track registry |
| `conductor/workflow.md` | 4 | Update status (jika perlu) |
