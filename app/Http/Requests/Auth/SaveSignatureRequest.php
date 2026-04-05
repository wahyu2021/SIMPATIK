<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class SaveSignatureRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'signature' => ['required', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'signature.required' => 'Tanda tangan harus diisi.',
        ];
    }
}
