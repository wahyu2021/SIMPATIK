<?php

namespace App\DTOs\Transaction;

class TransactionDetailDTO
{
    public function __construct(
        public readonly int $item_id,
        public readonly int $quantity
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            item_id: (int) $data['item_id'],
            quantity: (int) $data['quantity']
        );
    }
}
