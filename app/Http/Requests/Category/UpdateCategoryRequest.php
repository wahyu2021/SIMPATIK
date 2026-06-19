<?php

namespace App\Http\Requests\Category;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // Parameter id pada rute `categories.update` diambil menggunakan `$this->route('category')`
        return [
            'name' => 'required|string|max:255|unique:categories,name,' . $this->route('category'),
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama kategori wajib diisi.',
            'name.max'      => 'Nama kategori maksimal 255 karakter.',
            'name.unique'   => 'Nama kategori sudah digunakan.',
        ];
    }
}
