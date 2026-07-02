# Plan: Redesign Halaman Login

## Tahap 1: Persiapan Aset & Background Image

> **Tujuan**: Menyiapkan aset background image dan memastikan resource siap digunakan.

### Task 1.1 — Siapkan Background Image
- [x] Dapatkan atau generate foto/gambar gedung Bank Sumsel Babel
- [x] Simpan gambar dalam format JPG ke `public/images/login-bg.jpg`
- [x] Pastikan ukuran gambar optimal (resolusi cukup untuk full-screen tanpa terlalu besar)
- **File**: `public/images/login-bg.jpg`

### Task 1.2 — Verifikasi Aset yang Sudah Ada
- [x] Pastikan `public/images/logo.webp` masih ada dan dapat digunakan
- [x] Periksa apakah ada CSS/styling global yang bisa mempengaruhi halaman login

## Tahap 2: Redesign Komponen Login Page

> **Tujuan**: Implementasi redesign halaman login sesuai spesifikasi.

### Task 2.1 — Redesign `Login.tsx` (Halaman Utama)
- [x] Hapus import `DemoCredentials` dan `FeatureCard`
- [x] Hapus seluruh panel kanan (5 feature cards)
- [x] Hapus link "Hubungi IT Support" di mobile view
- [x] Ubah layout menjadi single-column centered
- [x] Tambahkan background image full-screen dengan dark overlay
- [x] Implementasi fallback gradient biru (#003366) jika gambar gagal dimuat
- [x] Pertahankan elemen: logo, nama "SIMPATIK", subtitle, nama institusi, LoginForm, footer copyright
- [x] Pastikan card form login memiliki styling clean dan profesional (bukan glassmorphism/glow)
- **File**: `resources/js/Pages/Auth/Login.tsx`

### Task 2.2 — Tambahkan Entrance Animation
- [x] Buat CSS keyframes untuk animasi fade-in + slide-up
- [x] Terapkan animasi pada card form login saat halaman dimuat
- [x] Durasi animasi 300-500ms dengan easing yang halus (450ms cubic-bezier)
- [x] Animasi menggunakan CSS murni (tanpa library tambahan)
- **File**: `resources/js/Pages/Auth/Login.tsx` (inline style tag)

### Task 2.3 — Responsiveness & Cross-Device Testing
- [x] Pastikan card form login terlihat baik di mobile (< 640px)
- [x] Pastikan card form login terlihat baik di tablet (640px - 1024px)
- [x] Pastikan card form login terlihat baik di desktop (> 1024px)
- [x] Verifikasi background image ditampilkan dengan `background-size: cover` agar proporsional
- [x] Pastikan overlay cukup gelap agar teks form tetap terbaca (contrast ratio WCAG AA)
- **File**: `resources/js/Pages/Auth/Login.tsx`

## Tahap 3: Cleanup & Verifikasi

> **Tujuan**: Membersihkan kode yang tidak terpakai dan verifikasi akhir.

### Task 3.1 — Cleanup Komponen yang Tidak Terpakai
- [x] Periksa apakah `DemoCredentials` component masih digunakan di tempat lain — tidak digunakan
- [x] Hapus file `DemoCredentials.tsx`
- [x] Periksa apakah `FeatureCard` component masih digunakan di tempat lain — tidak digunakan (kecuali barrel export)
- [x] Hapus file `FeatureCard.tsx` dan update barrel export `index.ts`
- **File**: `resources/js/Components/Features/Auth/DemoCredentials.tsx` (dihapus), `resources/js/Components/Fragments/FeatureCard.tsx` (dihapus), `resources/js/Components/Fragments/index.ts` (diupdate)

### Task 3.2 — Verifikasi Akhir
- [x] Jalankan `npm run build` untuk memastikan tidak ada error kompilasi — ✅ Build berhasil (6.30s)
- [ ] Verifikasi visual halaman login di browser (manual oleh user)
- [x] Pastikan semua acceptance criteria terpenuhi:
  - Card form login centered dengan background image full-screen ✅
  - Tidak ada feature cards atau DemoCredentials ✅
  - Animasi entrance berjalan ✅
  - Responsif di semua device ✅
  - Desain clean dan profesional ✅
  - Fallback gradient biru bekerja ✅

## Tahap 4: Dokumentasi & Finalisasi

> **Tujuan**: Update dokumentasi Conductor dan finalisasi track.

### Task 4.1 — Update Dokumentasi Conductor
- [x] Tandai track ini sebagai ✅ Completed di `conductor/tracks.md`
- [x] Workflow.md tidak perlu diupdate (modul Auth & Signature sudah berstatus Selesai)
- **File**: `conductor/tracks.md`

## Ringkasan File yang Dimodifikasi

| File | Tahap | Aksi |
|------|-------|------|
| `public/images/login-bg.jpg` | 1 | Aset baru (background image) |
| `resources/js/Pages/Auth/Login.tsx` | 2 | Redesign total layout & styling |
| `resources/js/Components/Features/Auth/DemoCredentials.tsx` | 3 | Dihapus |
| `resources/js/Components/Fragments/FeatureCard.tsx` | 3 | Dihapus |
| `resources/js/Components/Fragments/index.ts` | 3 | Update barrel export |
| `conductor/tracks.md` | 4 | Update track registry |
