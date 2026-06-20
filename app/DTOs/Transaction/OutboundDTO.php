<?php

namespace App\DTOs\Transaction;

use Illuminate\Foundation\Http\FormRequest;

class OutboundDTO
{
    public function __construct(
        public readonly string $document_number,
        public readonly int $requester_id,
        public readonly int $department_id,
        public readonly string $transaction_date,
        public readonly ?bool $is_special_request,
        public readonly array $details,
        public readonly ?string $notes
    ) {}

    public static function fromRequest(FormRequest $request, int $requesterId, int $departmentId): self
    {
        return new self(
            document_number: $request->validated('document_number') ?? '',
            requester_id: $requesterId,
            department_id: $departmentId,
            transaction_date: $request->validated('transaction_date') ?? now()->toDateString(),
            is_special_request: $request->validated('is_special_request') ? (bool) $request->validated('is_special_request') : false,
            details: $request->validated('details', []),
            notes: $request->validated('notes')
        );
    }
}
