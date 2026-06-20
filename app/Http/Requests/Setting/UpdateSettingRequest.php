<?php

namespace App\Http\Requests\Setting;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Biasanya pengaturan hanya bisa diubah oleh admin atau user tertentu
        // Jika sudah dihandle di middleware/policy controller, kembalikan true
        return true;
    }

    public function rules(): array
    {
        return [
            'company_name'             => 'required|string|max:255',
            'company_branch'           => 'required|string|max:255',
            'company_address'          => 'required|string|max:500',
            'document_prefix_inbound'  => 'required|string|max:10',
            'document_prefix_outbound' => 'required|string|max:10',
            'wa_api_url'               => 'nullable|string|max:500',
            'wa_alert_numbers'         => 'nullable|string|max:500',
            'ml_api_url'               => 'nullable|url|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'company_name.required'             => 'Nama perusahaan wajib diisi.',
            'company_branch.required'           => 'Cabang perusahaan wajib diisi.',
            'company_address.required'          => 'Alamat perusahaan wajib diisi.',
            'document_prefix_inbound.required'  => 'Prefix dokumen barang masuk wajib diisi.',
            'document_prefix_outbound.required' => 'Prefix dokumen barang keluar wajib diisi.',
            'ml_api_url.url'                    => 'Format URL ML API tidak valid.',
        ];
    }
}
