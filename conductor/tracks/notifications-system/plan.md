# Implementation Plan: Sistem Notifikasi Multi-Channel

Membangun fitur pemberitahuan (notification) terpusat untuk memberitahu pengguna mengenai perubahan status transaksi dan peringatan stok.

## Phase 1: In-App Notification (Website)
Fokus pada notifikasi lonceng di pojok kanan atas aplikasi.
- [ ] **Database Setup**:
    - [ ] Jalankan `php artisan notifications:table` dan migrasi.
- [ ] **Backend (Notification Classes)**:
    - [ ] Buat `OutboundStatusUpdatedNotification` (untuk Staff ketika pengajuannya disetujui/ditolak/diserahkan).
    - [ ] Buat `NewOutboundRequestNotification` (untuk Penyelia ketika ada staf mengajukan barang).
    - [ ] Buat `LowStockAlertNotification` (untuk Admin ketika stok barang menyentuh batas minimum).
- [ ] **Frontend (React UI)**:
    - [ ] Buat komponen `NotificationDropdown` di `Topbar.tsx`.
    - [ ] Buat halaman `Notifications/Index.tsx` untuk melihat semua notifikasi.
    - [ ] Buat endpoint API `/notifications/mark-as-read` untuk mengubah status notifikasi.

## Phase 2: WhatsApp Gateway Integration (Custom Local Bot)
Mengintegrasikan notifikasi krusial (seperti Low Stock Alert) ke nomor WhatsApp menggunakan *custom script* bot-wa lokal milik perusahaan/user.
- [ ] **Analisis API Lokal**: Memeriksa *script* di `D:\Coding\bot-wa` (di luar workspace) untuk mengetahui endpoint atau cara *push* pesan ke WA.
- [ ] **Integrasi Laravel**:
    - [ ] Buat `WhatsAppChannel` custom di Laravel.
    - [ ] Menambahkan *method* `toWhatsApp` pada kelas Notifikasi untuk memformat pesan dan menembak HTTP Request ke layanan lokal `bot-wa`.

## Definition of Done
- Terdapat ikon lonceng notifikasi dengan *badge* angka *unread* di topbar.
- User menerima notifikasi ketika status dokumennya berubah.
- Lonceng dapat diklik untuk membaca ringkasan pesan.
