<?php

namespace App\Http\Requests\Inbound;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateInboundRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // Ambil ID transaksi dari route parameter untuk exclude dari unique check
        $inboundId = $this->route('inbound');

        return [
            'reference_number'     => [
                'required', 'string', 'max:100',
                Rule::unique('inbound_transactions', 'reference_number')->ignore($inboundId),
            ],
            'transaction_date'     => ['required', 'date', 'before_or_equal:today'],
            'notes'                => ['nullable', 'string', 'max:500'],
            'details'              => ['required', 'array', 'min:1', 'max:50'],
            'details.*.item_id'    => ['required', 'integer', 'exists:items,id', 'distinct'],
            'details.*.quantity'   => ['required', 'integer', 'min:1', 'max:999999'],
            'details.*.unit_price' => ['nullable', 'numeric', 'min:0', 'max:99999999999'],
        ];
    }

    public function messages(): array
    {
        return [
            'reference_number.required'     => 'Nomor referensi/surat jalan harus diisi.',
            'reference_number.max'          => 'Nomor referensi maksimal 100 karakter.',
            'reference_number.unique'       => 'Nomor referensi sudah pernah digunakan.',
            'transaction_date.required'     => 'Tanggal transaksi harus diisi.',
            'transaction_date.date'         => 'Format tanggal tidak valid.',
            'transaction_date.before_or_equal' => 'Tanggal transaksi tidak boleh di masa depan.',
            'notes.max'                     => 'Catatan maksimal 500 karakter.',
            'details.required'              => 'Minimal harus ada 1 item barang.',
            'details.min'                   => 'Minimal harus ada 1 item barang.',
            'details.max'                   => 'Maksimal 50 item barang per transaksi.',
            'details.*.item_id.required'    => 'Barang harus dipilih.',
            'details.*.item_id.exists'      => 'Barang tidak valid.',
            'details.*.item_id.distinct'    => 'Barang tidak boleh duplikat dalam satu transaksi.',
            'details.*.quantity.required'   => 'Jumlah barang harus diisi.',
            'details.*.quantity.min'        => 'Jumlah barang minimal 1.',
            'details.*.quantity.max'        => 'Jumlah barang maksimal 999.999.',
            'details.*.unit_price.required' => 'Harga satuan harus diisi.',
            'details.*.unit_price.min'      => 'Harga satuan tidak boleh negatif.',
            'details.*.unit_price.max'      => 'Harga satuan terlalu besar.',
        ];
    }
}
