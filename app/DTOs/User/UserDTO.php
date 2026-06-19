<?php

namespace App\DTOs\User;

use Illuminate\Foundation\Http\FormRequest;

class UserDTO
{
    public function __construct(
        public readonly string $name,
        public readonly string $email,
        public readonly ?string $password,
        public readonly int $department_id,
        public readonly ?string $role,
        public readonly ?bool $is_active
    ) {}

    public static function fromRequest(FormRequest $request): self
    {
        return new self(
            name: $request->validated('name'),
            email: $request->validated('email'),
            password: $request->validated('password'),
            department_id: (int) $request->validated('department_id'),
            role: $request->validated('role'),
            is_active: $request->has('is_active') ? (bool) $request->validated('is_active') : null
        );
    }
}
