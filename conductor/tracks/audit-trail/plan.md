# Implementation Plan: Digital Audit Trail

Membangun sistem pencatatan aktivitas pengguna untuk memenuhi standar keamanan perbankan.

## Goals
- Mencatat setiap aksi krusial (Login, Create, Update, Delete, Approve).
- Menyimpan snapshot data sebelum dan sesudah perubahan (diff).
- Menyediakan antarmuka bagi Admin untuk meninjau log aktivitas.

## Task List
- [ ] **Database & Model**:
    - [ ] Buat migration `activity_logs`.
    - [ ] Buat model `ActivityLog`.
- [ ] **Core Logging Service**:
    - [ ] Implementasi `ActivityLogger` service.
    - [ ] Buat Trait `HasAuditLog` untuk otomatisasi log di model.
- [ ] **Integration**:
    - [ ] Pasang logging pada modul Auth, Items, Inbound, dan Outbound.
- [ ] **Frontend**:
    - [ ] Buat halaman `AuditLogs/Index.tsx` dengan filter modul, user, dan tanggal.

## Definition of Done
- Setiap perubahan pada data barang atau transaksi terekam di database beserta informasi IP Address dan User Agent.
- Admin dapat melihat siapa yang mengubah data tertentu di dashboard.
