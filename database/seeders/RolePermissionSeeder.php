<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create all permissions
        $permissions = [
            // Dashboard
            'view-dashboard',

            // User & System Management
            'manage-users',
            'manage-settings',

            // Master Data
            'manage-items',
            'manage-categories',
            'manage-departments',

            // Inbound (Barang Masuk)
            'view-inbound',
            'create-inbound',

            // Outbound (Pengajuan Barang)
            'create-outbound-request',
            'approve-outbound',         // Penyelia approve/reject permintaan
            'issue-outbound',           // Staff gudang serahkan barang (status → Issued)
            'view-own-requests',        // Lihat pengajuan sendiri
            'view-own-unit-requests',   // Lihat pengajuan se-unit kerja
            'view-all-requests',        // Lihat semua pengajuan

            // Reporting
            'view-reports',
            'export-reports',

            // Forecasting
            'view-forecasting',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles and assign permissions
        foreach (UserRole::cases() as $roleEnum) {
            $role = Role::firstOrCreate(['name' => $roleEnum->value]);
            $role->syncPermissions($roleEnum->permissions());
        }

        $this->command->info('Roles and permissions seeded successfully!');
    }
}
