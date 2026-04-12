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

        // 1. Admin Gudang (pengelola tunggal gudang, full control)
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

        // 2. Staff Bagian Umum (monitoring, cek laporan, audit)
        $generalAffairs = User::firstOrCreate(
            ['email' => 'bagianumum@simpatik.test'],
            [
                'name' => 'Staff Bagian Umum',
                'password' => Hash::make('password'),
                'department_id' => $bagianUmum->id,
                'is_active' => true,
            ]
        );
        $generalAffairs->assignRole(UserRole::GENERAL_AFFAIRS->value);

        // 3. Penyelia / Kepala Unit Kerja (approve pengajuan staf)
        $divisionHead = User::firstOrCreate(
            ['email' => 'penyelia@simpatik.test'],
            [
                'name' => 'Penyelia Pelayanan',
                'password' => Hash::make('password'),
                'department_id' => $pelayanan->id,
                'is_active' => true,
            ]
        );
        $divisionHead->assignRole(UserRole::DIVISION_HEAD->value);

        // 4. Staff Unit Kerja (pemohon barang)
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
        $this->command->info('  Admin Gudang:  admin@simpatik.test / password');
        $this->command->info('  Bagian Umum:   bagianumum@simpatik.test / password');
        $this->command->info('  Penyelia:      penyelia@simpatik.test / password');
        $this->command->info('  Staff:         staff@simpatik.test / password');
    }
}
