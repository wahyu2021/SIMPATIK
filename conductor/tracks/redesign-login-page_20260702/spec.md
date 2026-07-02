# Spec: Redesign Halaman Login

## Overview
Melakukan redesign total halaman login SIMPATIK untuk menghasilkan tampilan yang lebih modern, bersih, dan profesional. Desain saat ini dinilai terlalu ramai (5 feature cards di panel kanan, DemoCredentials, header besar) dan kurang mencerminkan kesan premium. Halaman login baru menggunakan pendekatan **single-column centered** dengan **full-screen background image** yang menampilkan foto gedung Bank Sumsel Babel.

## Functional Requirements

### FR-1: Layout Single Column Centered
- Form login ditampilkan dalam card yang di-center secara horizontal dan vertikal di layar.
- Tidak ada panel kanan / feature cards. Layout sepenuhnya single-column.
- Card form login harus responsif — tetap nyaman digunakan di mobile, tablet, dan desktop.

### FR-2: Full-Screen Background Image
- Background halaman menggunakan foto gedung/kantor Bank Sumsel Babel yang mengisi seluruh viewport.
- Overlay semi-transparan (dark overlay) di atas background image untuk memastikan readability form login.
- Gambar akan disediakan sebagai aset statis di `/public/images/`.
- Fallback: jika gambar gagal dimuat, gunakan warna solid gradient biru (#003366) sebagai background.

### FR-3: Form Login Card
- **Elemen yang dipertahankan:**
  - Logo SIMPATIK (`/images/logo.webp`)
  - Nama aplikasi "SIMPATIK"
  - Subtitle singkat ("Sistem Informasi Manajemen Persediaan ATK")
  - Nama institusi ("Bank Sumsel Babel")
  - LoginForm component (input NIP/username, password, tombol login)
  - Footer copyright
- **Elemen yang dihapus:**
  - Komponen `DemoCredentials` — dihapus sepenuhnya dari halaman login.
  - Panel kanan berisi 5 `FeatureCard` — dihapus sepenuhnya.
  - Link "Hubungi IT Support" di mobile — dihapus.

### FR-4: Entrance Animation
- Saat halaman pertama kali dimuat, card form login muncul dengan animasi **fade-in + slide-up** yang halus.
- Animasi menggunakan CSS transitions/keyframes (bukan library eksternal).
- Durasi animasi cukup pendek (300-500ms) agar tidak mengganggu UX.

### FR-5: Desain Bersih dan Bukan "Template AI"
- Tidak menggunakan efek glassmorphism, glow neon, atau elemen-elemen berlebihan.
- Warna tetap menggunakan palet biru korporat (#003366, #0052A3) yang konsisten dengan branding Bank Sumsel Babel.
- Tipografi bersih, whitespace cukup, dan hierarki visual yang jelas.
- Desain harus terasa custom dan profesional, bukan seperti template generik.

## Non-Functional Requirements
- **Performance**: Background image harus dioptimasi (format WebP, ukuran wajar) agar tidak memperlambat loading.
- **Accessibility**: Contrast ratio form elements terhadap background harus memenuhi WCAG AA.
- **Responsiveness**: Harus responsif di semua ukuran layar (mobile-first approach).

## Acceptance Criteria
1. Halaman login menampilkan card form login di tengah layar dengan background image full-screen.
2. Tidak ada feature cards atau DemoCredentials di halaman login.
3. Animasi entrance (fade-in + slide-up) berjalan saat halaman dimuat.
4. Tampilan responsif dan berfungsi baik di mobile, tablet, dan desktop.
5. Desain terasa clean, modern, dan profesional tanpa efek berlebihan.
6. Background image memiliki fallback ke gradient biru jika gagal dimuat.

## Out of Scope
- Perubahan logic autentikasi (backend) — tidak ada perubahan di controller/service.
- Perubahan pada komponen `LoginForm` internal (input fields, validasi) — hanya styling wrapper-nya.
- Fitur "Forgot Password" atau "Remember Me" — bukan bagian dari track ini.
- Perubahan pada halaman lain selain Login.
