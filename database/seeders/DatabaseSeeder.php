<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RolePermissionSeeder::class,
            DepartmentSeeder::class,
            UserSeeder::class,
            DefaultSettingsSeeder::class,
            MasterDataSeeder::class,
            InboundNovember2025Seeder::class,
            InboundDesember2025Seeder::class,
            InboundJanuari2026Seeder::class,
            InboundFebruari2026Seeder::class,
            InboundMaret2026Seeder::class,
            InboundApril2026Seeder::class,
            OutboundNovember2025Seeder::class,
            OutboundDesember2025Seeder::class,
            OutboundJanuari2026Seeder::class,
            OutboundFebruari2026Seeder::class,
            OutboundMaret2026Seeder::class,
            OutboundApril2026Seeder::class,
        ]);
    }
}

