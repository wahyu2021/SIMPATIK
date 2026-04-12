<?php

namespace App\Http\Requests\Item;

use Illuminate\Foundation\Http\FormRequest;

class UpdateItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id'        => ['required', 'exists:categories,id'],
            'name'               => ['required', 'string', 'max:255'],
            'unit_of_measure'    => ['required', 'string', 'max:50'],
            'unit_price'         => ['required', 'numeric', 'min:0'],
            'minimum_stock_level'=> ['required', 'integer', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'category_id.required'         => 'Kategori harus dipilih.',
            'category_id.exists'           => 'Kategori tidak valid.',
            'name.required'                => 'Nama barang harus diisi.',
            'name.max'                     => 'Nama barang maksimal 255 karakter.',
            'unit_of_measure.required'     => 'Satuan harus diisi.',
            'unit_price.required'          => 'Harga satuan harus diisi.',
            'unit_price.min'               => 'Harga satuan tidak boleh negatif.',
            'minimum_stock_level.required' => 'Stok minimum harus diisi.',
            'minimum_stock_level.min'      => 'Stok minimum tidak boleh negatif.',
        ];
    }
}
