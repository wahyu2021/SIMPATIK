<?php

namespace App\DTOs\Profile;

use Illuminate\Foundation\Http\FormRequest;

class ProfileDTO
{
    public function __construct(
        public readonly string $name,
        public readonly string $email,
        public readonly ?string $phone_number
    ) {}

    public static function fromRequest(FormRequest $request): self
    {
        return new self(
            name: $request->validated('name'),
            email: $request->validated('email'),
            phone_number: $request->validated('phone_number')
        );
    }
}
