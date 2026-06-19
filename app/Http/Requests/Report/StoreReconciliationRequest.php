<?php

namespace App\Http\Requests\Report;

use Illuminate\Foundation\Http\FormRequest;

class StoreReconciliationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'month' => 'required|integer|min:1|max:12',
            'year' => 'required|integer|min:2024',
            'notes' => 'nullable|string|max:500',
            'details' => 'required|array|min:1',
            'details.*.item_id' => 'required|integer|exists:items,id',
            'details.*.system_qty' => 'required|integer',
            'details.*.physical_qty' => 'required|integer|min:0',
            'details.*.notes' => 'nullable|string|max:255',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            foreach ($this->input('details', []) as $index => $detail) {
                if (($detail['system_qty'] ?? 0) != ($detail['physical_qty'] ?? 0)) {
                    if (empty($detail['notes'])) {
                        $validator->errors()->add("details.{$index}.notes", 'Keterangan wajib diisi karena ada selisih.');
                    }
                }
            }
        });
    }
}
