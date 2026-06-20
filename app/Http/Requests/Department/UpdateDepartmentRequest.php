<?php

namespace App\Http\Requests\Department;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDepartmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255|unique:departments,name,' . $this->route('department'),
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama unit kerja wajib diisi.',
            'name.max'      => 'Nama unit kerja maksimal 255 karakter.',
            'name.unique'   => 'Nama unit kerja sudah digunakan.',
        ];
    }
}
