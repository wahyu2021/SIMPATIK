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
        $operasional = Department::firstOrCreate(['name' => 'Bagian Operasional']);
        $pemasaran = Department::firstOrCreate(['name' => 'Bagian Pemasaran']);
        $kredit = Department::firstOrCreate(['name' => 'Bagian Kredit']);

        // ══════════════════════════════════════════
        // 1. Admin Gudang (warehouse_admin)
        // ══════════════════════════════════════════
        $admin = User::firstOrCreate(
            ['email' => 'admin@simpatik.test'],
            [
                'name' => 'Rudi Hartono',
                'password' => Hash::make('password'),
                'department_id' => $bagianUmum->id,
                'is_active' => true,
            ]
        );
        $admin->assignRole(UserRole::WAREHOUSE_ADMIN->value);

        // ══════════════════════════════════════════
        // 2. Staff Bagian Umum (general_affairs)
        // ══════════════════════════════════════════
        $generalAffairs = User::firstOrCreate(
            ['email' => 'bagianumum@simpatik.test'],
            [
                'name' => 'Dewi Lestari',
                'password' => Hash::make('password'),
                'department_id' => $bagianUmum->id,
                'is_active' => true,
            ]
        );
        $generalAffairs->assignRole(UserRole::GENERAL_AFFAIRS->value);

        // ══════════════════════════════════════════
        // 3. Penyelia (division_head) — tiap unit punya penyelia
        // ══════════════════════════════════════════
        $penyeliaData = [
            ['email' => 'penyelia@simpatik.test',         'name' => 'Hendra Wijaya',   'dept' => $pelayanan],
            ['email' => 'penyelia.teller@simpatik.test',  'name' => 'Sri Mulyani',     'dept' => $teller],
            ['email' => 'penyelia.cs@simpatik.test',      'name' => 'Bambang Sugiarto', 'dept' => $cs],
            ['email' => 'penyelia.ops@simpatik.test',     'name' => 'Agus Priyanto',   'dept' => $operasional],
        ];

        foreach ($penyeliaData as $p) {
            $user = User::firstOrCreate(
                ['email' => $p['email']],
                [
                    'name' => $p['name'],
                    'password' => Hash::make('password'),
                    'department_id' => $p['dept']->id,
                    'is_active' => true,
                ]
            );
            $user->assignRole(UserRole::DIVISION_HEAD->value);
        }

        // ══════════════════════════════════════════
        // 4. Staff dari berbagai unit kerja
        // ══════════════════════════════════════════
        $staffData = [
            ['email' => 'staff@simpatik.test',            'name' => 'Andi Setiawan',    'dept' => $pelayanan],
            ['email' => 'siti@simpatik.test',             'name' => 'Siti Aminah',      'dept' => $pelayanan],
            ['email' => 'budi@simpatik.test',             'name' => 'Budi Santoso',     'dept' => $teller],
            ['email' => 'rina@simpatik.test',             'name' => 'Rina Marlina',     'dept' => $teller],
            ['email' => 'dian@simpatik.test',             'name' => 'Dian Puspita',     'dept' => $cs],
            ['email' => 'fajar@simpatik.test',            'name' => 'Fajar Nugroho',    'dept' => $cs],
            ['email' => 'yanti@simpatik.test',            'name' => 'Yanti Kusuma',     'dept' => $operasional],
            ['email' => 'wawan@simpatik.test',            'name' => 'Wawan Hermawan',   'dept' => $operasional],
            ['email' => 'lisa@simpatik.test',             'name' => 'Lisa Permata',     'dept' => $pemasaran],
            ['email' => 'arief@simpatik.test',            'name' => 'Arief Rahman',     'dept' => $kredit],
        ];

        foreach ($staffData as $s) {
            $user = User::firstOrCreate(
                ['email' => $s['email']],
                [
                    'name' => $s['name'],
                    'password' => Hash::make('password'),
                    'department_id' => $s['dept']->id,
                    'is_active' => true,
                ]
            );
            $user->assignRole(UserRole::STAFF->value);
        }

        $this->command->info('Users seeded (' . User::count() . ' akun):');
        $this->command->info('  Admin Gudang:  admin@simpatik.test / password');
        $this->command->info('  Bagian Umum:   bagianumum@simpatik.test / password');
        $this->command->info('  Penyelia:      penyelia@simpatik.test / password');
        $this->command->info('  Staff:         staff@simpatik.test / password');
        $this->command->info('  (semua password: password)');
    }
}
