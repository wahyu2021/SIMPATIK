<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Department;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create default department if not exists
        $department = \App\Models\Department::firstOrCreate(
            ['name' => 'IT Department'],
            []
        );

        // Create Warehouse Admin
        $admin = \App\Models\User::firstOrCreate(
            ['email' => 'admin@simpatik.test'],
            [
                'name' => 'Admin Gudang',
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
                'department_id' => $department->id,
                'is_active' => true,
            ]
        );
        $admin->assignRole(\App\Enums\UserRole::WAREHOUSE_ADMIN->value);

        // Create General Affairs Staff
        $generalAffairs = \App\Models\User::firstOrCreate(
            ['email' => 'bagianumum@simpatik.test'],
            [
                'name' => 'Staff Bagian Umum',
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
                'department_id' => $department->id,
                'is_active' => true,
            ]
        );
        $generalAffairs->assignRole(\App\Enums\UserRole::GENERAL_AFFAIRS->value);

        // Create Division Head
        $divisionHead = \App\Models\User::firstOrCreate(
            ['email' => 'pimpinan@simpatik.test'],
            [
                'name' => 'Pimpinan Divisi',
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
                'department_id' => $department->id,
                'is_active' => true,
            ]
        );
        $divisionHead->assignRole(\App\Enums\UserRole::DIVISION_HEAD->value);

        // Create Staff
        $staff = \App\Models\User::firstOrCreate(
            ['email' => 'staff@simpatik.test'],
            [
                'name' => 'Staff Unit Kerja',
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
                'department_id' => $department->id,
                'is_active' => true,
            ]
        );
        $staff->assignRole(\App\Enums\UserRole::STAFF->value);

        $this->command->info('Default users created successfully!');
        $this->command->info('Admin: admin@simpatik.test / password');
        $this->command->info('Bagian Umum: bagianumum@simpatik.test / password');
        $this->command->info('Pimpinan: pimpinan@simpatik.test / password');
        $this->command->info('Staff: staff@simpatik.test / password');
    }
}

