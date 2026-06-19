<?php

namespace App\Enums;

enum UserRole: string
{
    case WAREHOUSE_ADMIN = 'warehouse_admin';
    case DIVISION_HEAD = 'division_head';
    case GENERAL_AFFAIRS = 'general_affairs';
    case STAFF = 'staff';

    public function label(): string
    {
        return match($this) {
            self::WAREHOUSE_ADMIN => 'Admin Gudang',
            self::DIVISION_HEAD => 'Penyelia / Kepala Unit Kerja',
            self::GENERAL_AFFAIRS => 'Staff Bagian Umum',
            self::STAFF => 'Staf Unit Kerja',
        };
    }

    public function description(): string
    {
        return match($this) {
            self::WAREHOUSE_ADMIN => 'Fokus pada pengeluaran barang (outbound), pencetakan dokumen, dan monitoring laporan',
            self::DIVISION_HEAD => 'Approve/reject pengajuan staf di unit kerjanya (Penyelia masing-masing)',
            self::GENERAL_AFFAIRS => 'Mengelola data master, user management, pengaturan sistem, barang masuk (inbound), dan audit',
            self::STAFF => 'Ajukan permintaan barang per unit kerja',
        };
    }

    public function permissions(): array
    {
        return match($this) {
            self::WAREHOUSE_ADMIN => [
                'view-dashboard',
                'view-items',
                'view-categories',
                'view-departments',
                'approve-outbound',
                'issue-outbound',
                'view-all-requests',
                'view-reports',
            ],
            self::DIVISION_HEAD => [
                'view-dashboard',
                'create-outbound-request',
                'approve-outbound',
                'view-own-requests',
                'view-own-unit-requests',
            ],
            self::GENERAL_AFFAIRS => [
                'view-dashboard',
                'manage-users',
                'manage-settings',
                'manage-items',
                'manage-categories',
                'manage-departments',
                'view-items',
                'view-categories',
                'view-departments',
                'view-inbound',
                'create-inbound',
                'view-all-requests',
                'view-reports',
                'export-reports',
                'view-forecasting',
            ],
            self::STAFF => [
                'view-dashboard',
                'create-outbound-request',
                'view-own-requests',
            ],
        };
    }

    public static function toArray(): array
    {
        return array_map(fn($case) => $case->value, self::cases());
    }

    public static function toSelectArray(): array
    {
        return array_combine(
            array_map(fn($case) => $case->value, self::cases()),
            array_map(fn($case) => $case->label(), self::cases())
        );
    }
}
