<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Request Validator: ImportUserRequest
 *
 * [Fungsionalitas]
 * FormRequest ini bertanggung jawab menangani otorisasi (authorization) dan validasi (validation) 
 * data masukan (input) dari pengguna secara terpusat sebelum dieksekusi oleh Controller.
 */
class ImportUserRequest extends FormRequest
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
            'file' => 'required|mimes:csv,xlsx,xls|max:5120', // 5MB max
        ];
    }

    public function messages(): array
    {
        return [
            'file.required' => 'File wajib diunggah.',
            'file.mimes'    => 'Format file harus berupa csv, xlsx, atau xls.',
            'file.max'      => 'Ukuran file maksimal 5MB.',
        ];
    }
}
