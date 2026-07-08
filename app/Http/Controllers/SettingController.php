<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller: SettingController
 *
 * [Arsitektur Layered]
 * Controller ini murni bertugas menangani Request HTTP (Input) dan Response (Output).
 * Seluruh logika bisnis atau manipulasi database dilarang berada di sini, melainkan 
 * harus didelegasikan (di-passing) ke lapisan Service melalui Data Transfer Object (DTO).
 */
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
    public function update(\App\Http\Requests\Setting\UpdateSettingRequest $request)
    {
        $data = $request->validated();

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
