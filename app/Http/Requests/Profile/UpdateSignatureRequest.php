<?php

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Request Validator: UpdateSignatureRequest
 *
 * [Fungsionalitas]
 * FormRequest ini bertanggung jawab menangani otorisasi (authorization) dan validasi (validation) 
 * data masukan (input) dari pengguna secara terpusat sebelum dieksekusi oleh Controller.
 */
class UpdateSignatureRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Dapatkan aturan validasi (validation rules) yang diterapkan pada request ini.
     * 
     * [Konteks Keamanan & Bisnis]
     * Aturan di bawah ini memastikan integritas tipe data dan batasan nilai
     * sebelum data mencapai layer Controller.
     * 
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'signature' => ['required', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'signature.required' => 'Tanda tangan wajib diisi.',
            'signature.string'   => 'Format tanda tangan tidak valid.',
        ];
    }
}
