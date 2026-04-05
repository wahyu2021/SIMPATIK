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
            'view-dashboard',
            'manage-users',
            'manage-items',
            'manage-categories',
            'manage-departments',
            'view-inbound',
            'create-inbound',
            'approve-outbound',
            'create-outbound-request',
            'view-own-requests',
            'view-reports',
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

