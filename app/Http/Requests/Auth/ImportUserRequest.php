<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class ImportUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

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
