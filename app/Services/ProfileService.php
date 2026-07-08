<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

/**
 * Service Layer: ProfileService
 *
 * [Business Logic & Transaksi]
 * Class ini menangani seluruh alur logika bisnis utama (Business Rules).
 * - Bertanggung jawab atas integritas data.
 * - Sering dibungkus dalam DB::transaction() jika melibatkan multi-tabel.
 * - Berkomunikasi dengan database HANYA melalui interface Repository.
 */
class ProfileService
{
    /**
     * Update profil user (nama & email).
     */
    public function updateProfile(User $user, \App\DTOs\Profile\ProfileDTO $dto): bool
    {
        return $user->update([
            'name'         => $dto->name,
            'email'        => $dto->email,
            'phone_number' => $dto->phone_number,
        ]);
    }

    /**
     * Ganti password user.
     */
    public function updatePassword(User $user, string $newPassword): bool
    {
        return $user->update([
            'password' => Hash::make($newPassword),
        ]);
    }

    /**
     * Update tanda tangan user dari base64 data.
     */
    public function updateSignature(User $user, string $signatureBase64): string
    {
        return $user->saveSignature($signatureBase64);
    }

    /**
     * Ambil data profil lengkap untuk ditampilkan.
     */
    public function getProfileData(User $user): array
    {
        $user->load('department', 'roles');

        return [
            'user'         => $user,
            'signatureUrl' => $user->getSignatureUrl(),
        ];
    }
}
