<?php

namespace App\Imports;

use App\Models\Department;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class UsersImport implements ToCollection, WithHeadingRow
{
    public int $importedCount = 0;

    /**
     * @param Collection $rows
     */
    public function collection(Collection $rows)
    {
        // Ambil semua department untuk pencarian fuzzy (kemiripan nama)
        $departments = Department::all();

        foreach ($rows as $row) {
            // Karena header Google Forms bisa dinamis, kita cari value berdasarkan kecocokan kata kunci pada key/header
            $nama = $this->findValue($row, ['nama', 'name']);
            $email = $this->findValue($row, ['email']);
            $roleInput = $this->findValue($row, ['role', 'peran', 'akses']);
            $unitInput = $this->findValue($row, ['unit', 'departemen', 'bagian', 'asal']);

            // Jika tidak ada email atau nama, lewati baris ini (mungkin baris kosong)
            if (empty($email) || empty($nama)) {
                continue;
            }

            // Hindari duplikasi berdasarkan email
            $user = User::where('email', $email)->first();

            if (! $user) {
                // Tentukan department_id
                $departmentId = null;
                if (!empty($unitInput)) {
                    // Cari departemen yang namanya mirip (case-insensitive)
                    $dept = $departments->first(function ($d) use ($unitInput) {
                        return Str::contains(strtolower($d->name), strtolower($unitInput)) 
                            || Str::contains(strtolower($unitInput), strtolower($d->name));
                    });
                    if ($dept) {
                        $departmentId = $dept->id;
                    }
                }

                $user = User::create([
                    'name'          => $nama,
                    'email'         => $email,
                    'password'      => Hash::make('Simpatik123!'),
                    'department_id' => $departmentId,
                    'is_active'     => true,
                ]);

                // Tentukan role
                if (!empty($roleInput)) {
                    $roleSlug = strtolower($roleInput);
                    if (Str::contains($roleSlug, 'umum')) {
                        $user->assignRole('general_affairs');
                    } elseif (Str::contains($roleSlug, 'gudang') || Str::contains($roleSlug, 'admin')) {
                        $user->assignRole('warehouse_admin');
                    } elseif (Str::contains($roleSlug, 'penyelia') || Str::contains($roleSlug, 'kepala')) {
                        $user->assignRole('division_head');
                    } else {
                        $user->assignRole('staff');
                    }
                } else {
                    // Default role jika tidak diisi
                    $user->assignRole('staff');
                }

                $this->importedCount++;
            }
        }
    }

    /**
     * Helper untuk mencari nilai di dalam row berdasarkan beberapa kemungkinan key.
     */
    private function findValue($row, array $keywords)
    {
        foreach ($row as $key => $value) {
            if ($key === null) continue;
            
            foreach ($keywords as $keyword) {
                if (Str::contains(strtolower($key), $keyword)) {
                    return $value;
                }
            }
        }
        return null;
    }
}
