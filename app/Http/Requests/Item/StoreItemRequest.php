<?php

namespace App\Http\Requests\Item;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Request Validator: StoreItemRequest
 *
 * [Fungsionalitas]
 * FormRequest ini bertanggung jawab menangani otorisasi (authorization) dan validasi (validation) 
 * data masukan (input) dari pengguna secara terpusat sebelum dieksekusi oleh Controller.
 */
class StoreItemRequest extends FormRequest
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
            'category_id'        => ['required', 'exists:categories,id'],
            'name'               => ['required', 'string', 'max:255'],
            'unit_of_measure'    => ['required', 'string', 'max:50'],
            'unit_price'         => ['nullable', 'numeric', 'min:0'],
            'current_stock'      => ['required', 'integer', 'min:0'],
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
            'current_stock.required'       => 'Stok awal harus diisi.',
            'current_stock.min'            => 'Stok awal tidak boleh negatif.',
            'minimum_stock_level.required' => 'Stok minimum harus diisi.',
            'minimum_stock_level.min'      => 'Stok minimum tidak boleh negatif.',
        ];
    }
}
