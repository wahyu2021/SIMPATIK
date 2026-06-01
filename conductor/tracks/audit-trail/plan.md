# Implementation Plan: Digital Audit Trail

Membangun sistem pencatatan aktivitas pengguna untuk memenuhi standar keamanan perbankan.

## Goals
- Mencatat setiap aksi krusial (Login, Create, Update, Delete, Approve).
- Menyimpan snapshot data sebelum dan sesudah perubahan (diff).
- Menyediakan antarmuka bagi Admin untuk meninjau log aktivitas.

## Task List
- [x] **Database & Model**:
    - [x] Buat migration `activity_logs`.
    - [x] Buat model `ActivityLog`.
- [x] **Core Logging Service**:
    - [x] Implementasi logic logging otomatis di Trait.
    - [x] Buat Trait `HasAuditLog` untuk otomatisasi log di model.
- [x] **Integration**:
    - [x] Pasang logging pada modul Auth, Items, Inbound, dan Outbound.
- [x] **Frontend**:
    - [x] Buat halaman `AuditLogs/Index.tsx` dengan filter modul, user, dan tanggal.

## Definition of Done
- Setiap perubahan pada data barang atau transaksi terekam di database beserta informasi IP Address dan User Agent.
- Admin dapat melihat siapa yang mengubah data tertentu di dashboard.
