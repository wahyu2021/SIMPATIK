<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    /**
     * Seed daftar unit kerja Bank BSB Cabang Utama A. Rivai.
     * Menggunakan firstOrCreate agar aman dijalankan berulang kali.
     */
    public function run(): void
    {
        $departments = [
            'Bagian Umum',
            'Teller',
            'Customer Service',
            'Unit KSG',
            'Pelayanan Jasa & Informasi',
            'UPJI BPKAD',
            'Bagian Operasional',
            'Bagian Pemasaran',
            'Bagian Kredit',
            'Satpam / Keamanan',
            'Lainnya / Umum',
        ];

        foreach ($departments as $name) {
            Department::firstOrCreate(['name' => $name]);
        }

        $this->command->info("Department seeded ({$this->count($departments)} unit kerja)");
    }

    private function count(array $items): int
    {
        return count($items);
    }
}
