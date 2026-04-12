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
            self::WAREHOUSE_ADMIN => 'Pengelola tunggal gudang, full control: barang, stok, transaksi, user & settings',
            self::DIVISION_HEAD => 'Approve/reject pengajuan staf di unit kerjanya (Penyelia masing-masing)',
            self::GENERAL_AFFAIRS => 'Monitoring, cek laporan, dan audit stok bulanan',
            self::STAFF => 'Ajukan permintaan barang per unit kerja',
        };
    }

    public function permissions(): array
    {
        return match($this) {
            self::WAREHOUSE_ADMIN => [
                'view-dashboard',
                'manage-users',
                'manage-settings',
                'manage-items',
                'manage-categories',
                'manage-departments',
                'view-inbound',
                'create-inbound',
                'approve-outbound',
                'issue-outbound',
                'create-outbound-request',
                'view-all-requests',
                'view-reports',
                'export-reports',
                'view-forecasting',
            ],
            self::DIVISION_HEAD => [
                'view-dashboard',
                'approve-outbound',
                'create-outbound-request',
                'view-own-unit-requests',
                'view-reports',
                'export-reports',
            ],
            self::GENERAL_AFFAIRS => [
                'view-dashboard',
                'view-reports',
                'export-reports',
                'view-all-requests',
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
