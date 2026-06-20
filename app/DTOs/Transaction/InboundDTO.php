<?php

namespace App\DTOs\Transaction;

use Illuminate\Foundation\Http\FormRequest;

class InboundDTO
{
    public function __construct(
        public readonly string $reference_number,
        public readonly int $user_id,
        public readonly string $transaction_date,
        public readonly array $details,
        public readonly ?string $notes,
        public readonly mixed $receipt_image
    ) {}

    public static function fromRequest(FormRequest $request, int $userId): self
    {
        return new self(
            reference_number: $request->validated('reference_number') ?? '',
            user_id: $userId,
            transaction_date: $request->validated('transaction_date'),
            details: $request->validated('details', []),
            notes: $request->validated('notes'),
            receipt_image: $request->file('receipt_image')
        );
    }
}
