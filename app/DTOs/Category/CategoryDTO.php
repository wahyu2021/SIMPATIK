<?php

namespace App\DTOs\Category;

use Illuminate\Foundation\Http\FormRequest;

class CategoryDTO
{
    public function __construct(
        public readonly string $name
    ) {}

    public static function fromRequest(FormRequest $request): self
    {
        return new self(
            name: $request->validated('name')
        );
    }
}
