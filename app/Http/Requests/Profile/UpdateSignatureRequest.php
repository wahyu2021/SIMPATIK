<?php

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSignatureRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
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
            'signature.required' => 'Tanda tangan wajib diisi.',
            'signature.string'   => 'Format tanda tangan tidak valid.',
        ];
    }
}
