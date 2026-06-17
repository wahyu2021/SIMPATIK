# Implementation Plan: Menonaktifkan Signature & Implementasi QR Code

*Goal*: Menonaktifkan proses *onboarding* tanda tangan digital saat login, mencabut prasyarat *middleware* signature, dan mengganti format validasi pada PDF (SPB & BAST) dari tanda tangan basah/digital menjadi QR Code.

## Phase 1: Backend Routing & Middleware (Disable Signature)
- [x] **routes/web.php**: 
    - Hapus grup middleware `['signature']` sehingga rute dapat diakses tanpa mengecek *signature*.
    - Hapus/nonaktifkan *route group* untuk `SignatureController`.
- [x] **bootstrap/app.php**: 
    - Hapus alias middleware `signature` (`EnsureUserHasSignature::class`).
- [x] **app/Http/Controllers/Auth/LoginController.php**: 
    - Hapus *logic* redirect ke `signature.create`. *User* langsung diarahkan ke Dashboard.
- [x] **app/Models/User.php** / **app/Traits/HasSignature.php**: 
    - Modifikasi `needsSignatureOnboarding()` agar selalu me-`return false`.

## Phase 2: Frontend & UI Clean Up
- [x] Hapus rute dan akses Frontend ke komponen `Auth/Signature` dan `Profile/EditSignature`.
- [x] Sembunyikan atau hapus menu "Ubah Tanda Tangan" di halaman Profil/Pengaturan pengguna.

## Phase 3: Implementasi QR Code pada PDF
- [x] Instal *library* QR Code untuk Laravel (misal: `simplesoftwareio/simple-qrcode`).
- [x] Tentukan standar informasi di dalam QR Code (sebagai *placeholder* awal, bisa berisi: "Disetujui secara elektronik oleh: [Nama Lengkap] - [Role] pada [Tanggal]").
- [x] Update *view* / HTML generator PDF untuk SPB dan BAST (di `OutboundController` atau class PDF Generator-nya):
    - Ganti render tag gambar `<img src="signature.jpg">` dengan *render* QR Code yang di-*generate* secara dinamis.

## Phase 4: Documentation Update
- [x] Update `README.md` dan `Modul Sistem.md` untuk menghilangkan referensi *Mandatory Signature Onboarding*.
- [x] Tambahkan penjelasan bahwa validasi cetak (PDF) menggunakan validasi elektronik berbasis QR Code.

## Definition of Done
- *User* baru maupun lama bisa langsung mengakses seluruh fitur SIMPATIK tanpa ditahan oleh halaman *Signature Onboarding*.
- PDF BAST dan SPB sukses dicetak dengan menyertakan QR Code (bukan lagi gambar coretan tanda tangan).
