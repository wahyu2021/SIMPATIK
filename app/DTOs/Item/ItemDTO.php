<?php

namespace App\DTOs\Item;

use Illuminate\Foundation\Http\FormRequest;

class ItemDTO
{
    public function __construct(
        public readonly string $name,
        public readonly ?string $item_code,
        public readonly int $category_id,
        public readonly string $unit_of_measure,
        public readonly float $unit_price,
        public readonly int $minimum_stock,
        public readonly ?string $notes
    ) {}

    public static function fromRequest(FormRequest $request): self
    {
        return new self(
            name: $request->validated('name'),
            item_code: $request->validated('item_code'),
            category_id: (int) $request->validated('category_id'),
            unit_of_measure: $request->validated('unit_of_measure'),
            unit_price: (float) ($request->validated('unit_price') ?? 0),
            minimum_stock: (int) ($request->validated('minimum_stock') ?? 0),
            notes: $request->validated('notes')
        );
    }
}
