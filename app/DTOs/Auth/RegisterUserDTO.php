<?php

namespace App\DTOs\Auth;

use Illuminate\Http\Request;

readonly class RegisterUserDTO
{
    public function __construct(
        public string $name,
        public string $email,
        public string $password,
        public int $department_id,
        public string $role,
        public bool $is_active = true,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            name: $request->input('name'),
            email: $request->input('email'),
            password: $request->input('password'),
            department_id: $request->integer('department_id'),
            role: $request->input('role'),
            is_active: $request->boolean('is_active', true),
        );
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'email' => $this->email,
            'password' => bcrypt($this->password),
            'department_id' => $this->department_id,
            'is_active' => $this->is_active,
        ];
    }
}
