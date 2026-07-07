<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Department;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Data Pegawai (Pimpinan Utama Cabang sengaja dikecualikan sesuai instruksi)
        $data = [
            'Unit Pelayanan Jasa dan Informasi Dalam Negeri' => [
                'Prisillia Inola', 'Selvi Kesuma Indah', 'Pingkan Astuty', 'Poppy Indah Rachmanita', 'Rakha Billy Fauzan', 
                'Uun Marcelena', 'Ova Desta Septia', 'Meilanda Dwi Putri', 'Sela Dea Putri', 'Sarah Fadhillah', 
                'Salyma Dewi Safitri', 'Talitha Aurellia Azzahra', 'Yunida Karivani', 'Debie Citra Lestari', 'Audrey Syifa Putricia'
            ],
            'Unit Pelayanan Jasa dan Informasi Luar Negeri' => [
                'Tri Hendro Wibowo', 'Windy Diah Angraini'
            ],
            'Unit Pelayanan Uang Tunai' => [
                'Ade Prafitri', 'Ade Yulianti', 'Tri Puspitasari', 'Rani Susanti', 'Azriel Putra Hidayat', 
                'Putri Dwi Amanda Yashifa', 'Afifah Putri Salamah', 'Lusi Kumala Dewi', 'Rahmad Darmawan', 
                'Desi Putri Utami', 'Putra Pala Rezki Illahi', 'M. Ridwan Eka Putra', 'Meris Duwi Anggraini'
            ],
            'Unit Dana, Jasa & Prioritas Banking' => [
                'Sarinah Aria Putri', 'Zacery Lovianira Pratami', 'Fitri Mareta Sari', 'Samaji', 'Christina Anita Nadjaja', 'Bella Maretta'
            ],
            'Unit Administrasi, Umum & Akuntansi' => [
                'M. Faisal Kramajaya', 'Collinsia Permata Sari', 'Yunia Anggraini', 'M. Redho Aditya Putra', 'Rizka Amalia', 'Riska Siti Aisyah'
            ],
            'Unit Legal, Administrasi & Operasional Kredit' => [
                'Aldy Lazuardi', 'M. Wahyu Okta Prima'
            ],
            'Unit Kredit Konsumtif' => [
                'Janeke', 'Muhammad Rahmatullah', 'Nadia Agustini', 'Armeiki Haslin', 'M. Alief Ananta', 'Aghi Muhammad Rifalma'
            ],
            'Unit Kredit Produktif' => [
                'Rizki Amelia', 'Jevi Wahyu Saputra', 'Okky Dwi Alvihhadra', 'Gilang Bintang Basyeban'
            ],
            'Unit Audit Intern' => [
                'Lili Ramayanti', 'Silvia Susanto', 'Rossa Dwi Jayanti'
            ],
            'Divisi Risiko Bisnis' => [
                'Nataya Quariza', 'Sylvifta Priscilia', 'Robbirham Rahmatullah'
            ],
            'Divisi Manajemen Aset Khusus' => [
                'Afriansyah'
            ],
            'Kantor Kas Samsat' => [
                'Dieka Apriyani', 'Wahyuni Pratiwi', 'Nyimas Kurnia Rizqi Desmailani'
            ],
            'Kantor Kas Pakjo' => [
                'Ani Ananta', 'Nyayu Nadia Nur Zhofirah', 'Sarah Yunika Salsabillah'
            ],
            'Kantor Kas May Salim' => [
                'Rahma Ilmy', 'Bertha Velonia', 'Miranda Rifani'
            ],
            'Kantor Kas RSUD Siti Fatimah' => [
                'Irin Artha', 'Frisca Ananda', 'Jihan Putri Nabilla', 'Tiara Kinanti'
            ],
            'Kantor Kas RSMH' => [
                'Dendri S.', 'Rika Wulandari', 'Eldisa Putri Halim'
            ],
            'Kantor Kas Unsri Bukit' => [
                'Dwi Putri Handayani', 'Celvin Indwi Saputri', 'Masayu Arifah Sumayyah', 'Sherliyana Azzahra', 'Alif Hasyim Nawawi'
            ],
            'Kantor Kas Bandara / SMB II' => [
                'M. Hasbi Bardiansyah', 'Nursyahbani S.'
            ],
            'Kantor Kas UNIKA' => [
                'Riadhillah Oktharinah', 'Syaqilla Ning Maharani', 'Putri Aulia Rahmatika'
            ],
            'Tenaga Pendukung & Rekrutmen Outsource' => [
                'Chery Syafitri', 'Ridiansyah', 'Shofri Namiah', 'Jimmy Richardo', 'Yunita Kesuma', 'Hefy Yunita Sari', 
                'Yuliandhita Vega Farrahdina', 'Lucky Kevin Fahreza', 'Novia Lailati', 'Endang Sri Rahadianti', 
                'Sahputra Siahaan', 'Anggie Prihanggum Ayu', 'M. Akbar Prayogi Syahputra', 'M Rizal', 'Putri Apriani', 
                'Kms Muhamad Badri', 'Peggy Laska', 'Saniyyah Ramadina', 'M. Jethro Lambay', 'Indri', 'M. Rizki Junaidi', 
                'Imam Muslim Sorimuda', 'Rama Nur Alfarizi', 'Tasya F.H.', 'Teo Sandi', 'Ajeng Rahayu', 'Riri Ardika'
            ],
            'Teller Payment Samsat' => [
                'Endah Kartika Sari', 'Sabilla Maghfira Salsabillah', 'Andita Dwi Tamara', 'M. Haris Yuliansyah', 'Rahma Rani', 
                'Riski Yundasari', 'Tiftani Ayu Rosalina', 'M Suhud Fakhri', 'Selfi Safira', 'M. Iqbal Raka Hakiki', 
                'Bella Anggraini', 'Fadilla Utami', 'Benny Yasin Kurdi Madira', 'Massagus Abdul Basith', 'Siska Putri Utami', 
                'M Reynaldy', 'Emil Akbari', 'Lilo Oktori', 'Ivana Ruth Sihite', 'Rahmad Reynold Syahputra', 'M Rizg Giansyah', 
                'M. Aditya Nugraha', 'Slamet Rayandi', 'Agung Pratama', 'Aroyan Ramadhan', 'Resi Dwi Agustini', 'Nanda Nugraha', 
                'M. Iqbal Septriansyah', 'Imam Rahmad Alpiq', 'M Agung Alfarizi', 'M. Hamzah'
            ],
            'Satuan Pengamanan' => [
                'Wiwit Asmi', 'Reza Rendra Graha', 'M Ibram', 'Mulyadi', 'Ivan', 'Yudha Miftahuda', 'M. Syawal', 'Aki Pasak Yudha', 
                'Alamsyah', 'Robby Wiliam', 'Hendri', 'Kms Abdul Hamid', 'Neno Saputra', 'Hendra Kelana', 'M Zulpiansa', 
                'Junaidi', 'Agun', 'M. Yopi Yolanda', 'Apriansyah', 'Rusdy'
            ],
            'Pengemudi / Sopir Kantor' => [
                'Achmad Tiara', 'M. Arief', 'Juandito', 'Iwan Wahyudi', 'Mardani Visca', 'Stanley Vernando', 'Budiono', 
                'Ariansyah', 'Rendi Iransyah Putra', 'Jefri Alvarezi', 'M. Afriza'
            ],
            'Cleaning Service' => [
                'Ponidi', 'Sugeng Rianto', 'Heri Gunawan', 'Sultoni', 'Shinta', 'Eko Prasatya Utama', 'Rahmad ramadhan', 
                'Rizham Taufik', 'M Ariansyah', 'Fatimah', 'Lisa Agustiani', 'M. Rizki Syahbani', 'M Zulkifli', 'Eti Rianty', 
                'Julia Enita', 'Tama Rian'
            ],
            'Juru Parkir & Pelayan Dalam' => [
                'Hadi Darma', 'Doddi Siswoyo', 'Syahrizal', 'Dimas Ananda Pratama', 'Rayhan Ramadhan', 'Herza Satrio', 
                'Syeilla Noviara Wijaya', 'Alfia Ridha Halika'
            ]
        ];

        $uniqueEmails = [];
        
        foreach ($data as $deptName => $users) {
            $department = Department::where('name', $deptName)->first();
            
            foreach ($users as $index => $userName) {
                // Bersihkan nama untuk dijadikan format email
                $cleanName = strtolower(preg_replace('/[^a-zA-Z0-9]+/', '.', trim($userName)));
                $cleanName = trim($cleanName, '.');
                $email = $cleanName . '@bsb.com';
                
                // Cek jika nama ganda
                $counter = 1;
                while (in_array($email, $uniqueEmails)) {
                    $email = $cleanName . $counter . '@bsb.com';
                    $counter++;
                }
                $uniqueEmails[] = $email;

                $user = User::firstOrCreate(
                    ['email' => $email],
                    [
                        'name' => trim($userName),
                        'password' => bcrypt('password123'),
                        'department_id' => $department ? $department->id : null,
                        'is_active' => true,
                    ]
                );

                // Asign Role
                $departmentsWithoutHead = [
                    'Tenaga Pendukung & Rekrutmen Outsource', 'Teller Payment Samsat', 
                    'Satuan Pengamanan', 'Pengemudi / Sopir Kantor', 'Cleaning Service', 'Juru Parkir & Pelayan Dalam'
                ];
                
                if (trim($userName) === 'Ajeng Rahayu') {
                    // Admin Gudang Tunggal
                    $user->assignRole('warehouse_admin');
                } elseif ($deptName === 'Unit Administrasi, Umum & Akuntansi') {
                    // Seluruh anggota unit ini adalah Bagian Umum (GA)
                    if ($index === 0) {
                        $user->assignRole('division_head');
                        $user->assignRole('general_affairs');
                    } else {
                        $user->assignRole('general_affairs');
                    }
                } else {
                    if ($index === 0 && !in_array($deptName, $departmentsWithoutHead)) {
                        $user->assignRole('division_head');
                    } else {
                        $user->assignRole('staff');
                    }
                }
            }
        }
    }
}
