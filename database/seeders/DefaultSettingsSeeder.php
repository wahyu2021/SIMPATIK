<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class DefaultSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            [
                'key' => 'company_name',
                'value' => 'PT. Bank Pembangunan Daerah Sumatera Selatan dan Bangka Belitung',
            ],
            [
                'key' => 'company_branch',
                'value' => 'Cabang Utama Kapten A. Rivai',
            ],
            [
                'key' => 'company_address',
                'value' => 'Jl. Kapten A. Rivai No. 21 Palembang 30129',
            ],
            [
                'key' => 'document_prefix_inbound',
                'value' => 'INB',
            ],
            [
                'key' => 'document_prefix_outbound',
                'value' => 'SPB',
            ],
            [
                'key' => 'wa_api_url',
                'value' => '',
            ],
            [
                'key' => 'wa_api_token',
                'value' => '',
            ],
            [
                'key' => 'wa_alert_numbers',
                'value' => '',
            ],
            [
                'key' => 'ml_api_url',
                'value' => 'http://localhost:8001/api/forecast',
            ],
        ];

        foreach ($settings as $setting) {
            Setting::firstOrCreate(
                ['key' => $setting['key']],
                ['value' => $setting['value']]
            );
        }

        $this->command->info('Default settings seeded (' . count($settings) . ' entries)');
    }
}
