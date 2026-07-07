<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;

class DepartmentSeeder extends Seeder
{
    public function run()
    {
        $departments = [
            'Unit Pelayanan Jasa dan Informasi Dalam Negeri',
            'Unit Pelayanan Jasa dan Informasi Luar Negeri',
            'Unit Pelayanan Uang Tunai',
            'Unit Dana, Jasa & Prioritas Banking',
            'Unit Administrasi, Umum & Akuntansi',
            'Unit Legal, Administrasi & Operasional Kredit',
            'Unit Kredit Konsumtif',
            'Unit Kredit Produktif',
            'Unit Audit Intern',
            'Divisi Risiko Bisnis',
            'Divisi Manajemen Aset Khusus',
            'Kantor Kas Samsat',
            'Kantor Kas Pakjo',
            'Kantor Kas May Salim',
            'Kantor Kas RSUD Siti Fatimah',
            'Kantor Kas RSMH',
            'Kantor Kas Unsri Bukit',
            'Kantor Kas Bandara / SMB II',
            'Kantor Kas UNIKA',
            'Tenaga Pendukung & Rekrutmen Outsource',
            'Teller Payment Samsat',
            'Satuan Pengamanan',
            'Pengemudi / Sopir Kantor',
            'Cleaning Service',
            'Juru Parkir & Pelayan Dalam'
        ];

        foreach ($departments as $dept) {
            Department::firstOrCreate(['name' => $dept]);
        }
    }
}
