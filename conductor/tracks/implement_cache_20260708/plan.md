# Implementation Plan: Caching System

## Phase 1: Infrastructure & Configuration
- [ ] Task: Memeriksa dan mengoptimalkan konfigurasi `config/cache.php` untuk driver `database`.
- [ ] Task: Memastikan tabel `cache` dan `cache_locks` sudah ada di database (jalankan migrasi jika belum).
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Infrastructure & Configuration' (Protocol in workflow.md)

## Phase 2: Implement Model Observers (Cache Invalidation)
- [ ] Task: Membuat `CategoryObserver` untuk menghapus cache kategori otomatis saat ada perubahan.
- [ ] Task: Membuat `DepartmentObserver` untuk cache unit kerja.
- [ ] Task: Membuat `ItemObserver` untuk cache barang.
- [ ] Task: Membuat `UserObserver` untuk cache pengguna.
- [ ] Task: Membuat `InboundTransactionObserver` & `OutboundTransactionObserver` untuk transaksi.
- [ ] Task: Mendaftarkan semua Observers ke dalam `AppServiceProvider` Laravel.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Implement Model Observers' (Protocol in workflow.md)

## Phase 3: Implement Caching in Repositories
- [ ] Task: Memperbarui `CategoryRepository` agar memanggil `Cache::remember()` saat fungsi `paginate()` berjalan.
- [ ] Task: Memperbarui `DepartmentRepository` dengan logika `Cache::remember()`.
- [ ] Task: Memperbarui `ItemRepository` menggunakan *cache key* dinamis (berdasarkan halaman & filter).
- [ ] Task: Memperbarui `UserRepository` dengan implementasi cache.
- [ ] Task: Memperbarui `InboundRepository` dan `OutboundRepository` dengan implementasi cache.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Implement Caching in Repositories' (Protocol in workflow.md)

## Phase 4: Final Validation
- [ ] Task: Menguji penambahan/pengubahan data via antarmuka UI (React) dan memastikan data langsung berubah (Cache berhasil ditembus/invalidated).
- [ ] Task: Memantau Laravel log / Telescope untuk memastikan *query* database berkurang drastis.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Final Validation' (Protocol in workflow.md)
