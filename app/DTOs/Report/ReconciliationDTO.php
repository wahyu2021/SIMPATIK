<?php

namespace App\DTOs\Report;

use Illuminate\Foundation\Http\FormRequest;

class ReconciliationDTO
{
    public function __construct(
        public readonly int $month,
        public readonly int $year,
        public readonly int $user_id,
        public readonly array $details,
        public readonly ?string $notes
    ) {}

    public static function fromRequest(FormRequest $request, int $userId): self
    {
        return new self(
            month: (int) $request->validated('month'),
            year: (int) $request->validated('year'),
            user_id: $userId,
            details: $request->validated('details', []),
            notes: $request->validated('notes')
        );
    }
}
