<?php

namespace App\Enums;

enum UserRole: string
{
    case WAREHOUSE_ADMIN = 'warehouse_admin';
    case GENERAL_AFFAIRS = 'general_affairs';
    case SUPERVISOR = 'supervisor';
    case STAFF = 'staff';

    public function label(): string
    {
        return match($this) {
            self::WAREHOUSE_ADMIN => 'Admin Gudang',
            self::GENERAL_AFFAIRS => 'Staff Bagian Umum',
            self::SUPERVISOR => 'Penyelia',
            self::STAFF => 'Staf Unit Kerja',
        };
    }

    public function description(): string
    {
        return match($this) {
            self::WAREHOUSE_ADMIN => 'Full access ke seluruh sistem, kelola users & settings',
            self::GENERAL_AFFAIRS => 'Kelola gudang harian, serah terima barang, laporan (Mba Ajeng)',
            self::SUPERVISOR => 'Approve/reject permintaan unit, pengecekan stok bulanan (Kak Redho / Penyelia)',
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
            self::GENERAL_AFFAIRS => [
                'view-dashboard',
                'manage-items',
                'manage-categories',
                'view-inbound',
                'create-inbound',
                'issue-outbound',
                'create-outbound-request',
                'view-all-requests',
                'view-reports',
                'export-reports',
            ],
            self::SUPERVISOR => [
                'view-dashboard',
                'approve-outbound',
                'create-outbound-request',
                'view-own-unit-requests',
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
