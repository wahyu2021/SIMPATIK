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
        // Create default departments
        $bagianUmum = Department::firstOrCreate(['name' => 'Bagian Umum']);
        $pelayanan = Department::firstOrCreate(['name' => 'Pelayanan Jasa & Informasi']);
        $teller = Department::firstOrCreate(['name' => 'Teller']);
        $cs = Department::firstOrCreate(['name' => 'Customer Service']);

        // 1. Admin Gudang (superadmin)
        $admin = User::firstOrCreate(
            ['email' => 'admin@simpatik.test'],
            [
                'name' => 'Admin Gudang',
                'password' => Hash::make('password'),
                'department_id' => $bagianUmum->id,
                'is_active' => true,
            ]
        );
        $admin->assignRole(UserRole::WAREHOUSE_ADMIN->value);

        // 2. Staff Bagian Umum (Mba Ajeng — kelola gudang harian)
        $generalAffairs = User::firstOrCreate(
            ['email' => 'bagianumum@simpatik.test'],
            [
                'name' => 'Ajeng (Bagian Umum)',
                'password' => Hash::make('password'),
                'department_id' => $bagianUmum->id,
                'is_active' => true,
            ]
        );
        $generalAffairs->assignRole(UserRole::GENERAL_AFFAIRS->value);

        // 3. Penyelia (Kak Redho — approve + cek stok bulanan)
        $supervisor = User::firstOrCreate(
            ['email' => 'penyelia@simpatik.test'],
            [
                'name' => 'Redho (Penyelia)',
                'password' => Hash::make('password'),
                'department_id' => $bagianUmum->id,
                'is_active' => true,
            ]
        );
        $supervisor->assignRole(UserRole::SUPERVISOR->value);

        // 4. Staff Unit Kerja (contoh: staff dari unit Pelayanan)
        $staff = User::firstOrCreate(
            ['email' => 'staff@simpatik.test'],
            [
                'name' => 'Staff Pelayanan',
                'password' => Hash::make('password'),
                'department_id' => $pelayanan->id,
                'is_active' => true,
            ]
        );
        $staff->assignRole(UserRole::STAFF->value);

        $this->command->info('Default users & departments created:');
        $this->command->info('  Admin:        admin@simpatik.test / password');
        $this->command->info('  Bagian Umum:  bagianumum@simpatik.test / password');
        $this->command->info('  Penyelia:     penyelia@simpatik.test / password');
        $this->command->info('  Staff:        staff@simpatik.test / password');
    }
}
