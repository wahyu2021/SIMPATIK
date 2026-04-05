<?php

namespace App\Enums;

enum UserRole: string
{
    case WAREHOUSE_ADMIN = 'warehouse_admin';
    case GENERAL_AFFAIRS = 'general_affairs';
    case DIVISION_HEAD = 'division_head';
    case STAFF = 'staff';

    public function label(): string
    {
        return match($this) {
            self::WAREHOUSE_ADMIN => 'Admin Gudang',
            self::GENERAL_AFFAIRS => 'Staff Bagian Umum',
            self::DIVISION_HEAD => 'Pimpinan',
            self::STAFF => 'Staf Unit Kerja',
        };
    }

    public function permissions(): array
    {
        return match($this) {
            self::WAREHOUSE_ADMIN => [
                'view-dashboard',
                'manage-users',
                'manage-items',
                'manage-categories',
                'manage-departments',
                'view-inbound',
                'create-inbound',
                'approve-outbound',
                'view-reports',
                'view-forecasting',
            ],
            self::GENERAL_AFFAIRS => [
                'view-dashboard',
                'view-inbound',
                'create-inbound',
                'approve-outbound',
                'view-reports',
            ],
            self::DIVISION_HEAD => [
                'view-dashboard',
                'view-reports',
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
