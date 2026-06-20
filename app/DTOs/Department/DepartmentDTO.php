<?php

namespace App\DTOs\Department;

use Illuminate\Foundation\Http\FormRequest;

class DepartmentDTO
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
