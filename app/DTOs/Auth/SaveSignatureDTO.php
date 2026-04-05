<?php

namespace App\DTOs\Auth;

use Illuminate\Http\Request;

readonly class SaveSignatureDTO
{
    public function __construct(
        public string $signatureData,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            signatureData: $request->input('signature'),
        );
    }
}
