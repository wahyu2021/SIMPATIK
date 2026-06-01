<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    /**
     * Tampilkan halaman pengaturan dengan semua settings dikelompokkan.
     */
    public function index(): Response
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();

        return Inertia::render('Settings/Index', [
            'settings' => $settings,
        ]);
    }

    /**
     * Simpan perubahan pengaturan.
     */
    public function update(Request $request)
    {
        $request->validate([
            'company_name' => 'required|string|max:255',
            'company_branch' => 'required|string|max:255',
            'company_address' => 'required|string|max:500',
            'document_prefix_inbound' => 'required|string|max:10',
            'document_prefix_outbound' => 'required|string|max:10',
            'wa_api_url' => 'nullable|string|max:500',
            'wa_alert_numbers' => 'nullable|string|max:500',
            'ml_api_url' => 'nullable|url|max:500',
        ]);

        $data = $request->only([
            'company_name', 'company_branch', 'company_address',
            'document_prefix_inbound', 'document_prefix_outbound',
            'wa_api_url', 'wa_alert_numbers', 'ml_api_url',
        ]);

        foreach ($data as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value ?? '']
            );
        }

        return redirect()->back()
            ->with('success', 'Pengaturan berhasil disimpan.');
    }
}
