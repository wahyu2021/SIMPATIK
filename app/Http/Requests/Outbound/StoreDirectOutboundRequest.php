<?php

namespace App\Http\Requests\Outbound;

use Illuminate\Foundation\Http\FormRequest;

class StoreDirectOutboundRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

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
