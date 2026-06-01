<?php

namespace App\Http\Requests\Outbound;

use Illuminate\Foundation\Http\FormRequest;

class StoreOutboundRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'department_id'    => 'nullable|exists:departments,id',
            'transaction_date' => 'required|date|before_or_equal:today',
            'is_special_request' => 'boolean',
            'notes'            => 'nullable|string|max:1000',

            'details'                       => 'required|array|min:1|max:50',
            'details.*.item_id'             => 'required|exists:items,id|distinct',
            'details.*.quantity_requested'   => 'required|integer|min:1|max:999999',
            'details.*.notes'               => 'nullable|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'department_id.required'    => 'Unit kerja wajib dipilih.',
            'department_id.exists'      => 'Unit kerja tidak valid.',
            'transaction_date.required' => 'Tanggal pengajuan wajib diisi.',
            'transaction_date.before_or_equal' => 'Tanggal tidak boleh di masa depan.',

            'details.required'            => 'Minimal 1 item barang harus ditambahkan.',
            'details.min'                 => 'Minimal 1 item barang harus ditambahkan.',
            'details.max'                 => 'Maksimal 50 item per pengajuan.',
            'details.*.item_id.required'  => 'Barang wajib dipilih.',
            'details.*.item_id.exists'    => 'Barang tidak valid.',
            'details.*.item_id.distinct'  => 'Barang tidak boleh duplikat dalam satu pengajuan.',
            'details.*.quantity_requested.required' => 'Jumlah wajib diisi.',
            'details.*.quantity_requested.min'      => 'Jumlah minimal 1.',
            'details.*.quantity_requested.max'      => 'Jumlah maksimal 999.999.',
        ];
    }
}
