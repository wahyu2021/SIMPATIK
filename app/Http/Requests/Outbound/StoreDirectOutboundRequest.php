<?php

namespace App\Http\Requests\Outbound;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Request Validator: StoreDirectOutboundRequest
 *
 * [Fungsionalitas]
 * FormRequest ini bertanggung jawab menangani otorisasi (authorization) dan validasi (validation) 
 * data masukan (input) dari pengguna secara terpusat sebelum dieksekusi oleh Controller.
 */
class StoreDirectOutboundRequest extends FormRequest
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
            'requester_id'     => ['required', 'exists:users,id'],
            'department_id'    => ['required', 'exists:departments,id'],
            'transaction_date' => ['required', 'date', 'before_or_equal:today'],
            'is_special_request' => ['nullable', 'boolean'],
            'notes'            => ['nullable', 'string', 'max:500'],
            'details'          => ['required', 'array', 'min:1'],
            'details.*.item_id' => ['required', 'exists:items,id'],
            'details.*.quantity'=> ['required', 'integer', 'min:1'],
        ];
    }
}
