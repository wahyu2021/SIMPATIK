<?php

namespace App\Services\Auth;

use App\DTOs\Auth\LoginDTO;
use App\DTOs\Auth\RegisterUserDTO;
use App\DTOs\Auth\SaveSignatureDTO;
use App\Enums\UserRole;
use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function __construct(
        private UserRepositoryInterface $userRepository
    ) {}

    /**
     * Authenticate user with credentials
     */
    public function login(LoginDTO $dto): User
    {
        $user = $this->userRepository->findByEmail($dto->email);

        if (!$user || !Hash::check($dto->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Kredensial yang diberikan tidak cocok dengan catatan kami.'],
            ]);
        }

        if (!$user->isActive()) {
            throw ValidationException::withMessages([
                'email' => ['Akun Anda telah dinonaktifkan. Hubungi administrator.'],
            ]);
        }

        Auth::login($user, $dto->remember);

        return $user;
    }

    /**
     * Logout current user
     */
    public function logout(): void
    {
        Auth::logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();
    }

    /**
     * Register new user
     */
    public function register(RegisterUserDTO $dto): User
    {
        DB::beginTransaction();
        try {
            // Create user
            $user = $this->userRepository->create($dto->toArray());

            // Assign role
            $user->assignRole($dto->role);

            // Sync permissions based on role
            $role = UserRole::from($dto->role);
            $user->syncPermissions($role->permissions());

            DB::commit();

            return $user;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Save user signature
     */
    public function saveSignature(User $user, SaveSignatureDTO $dto): string
    {
        try {
            return $user->saveSignature($dto->signatureData);
        } catch (\Exception $e) {
            throw new \RuntimeException('Gagal menyimpan tanda tangan: ' . $e->getMessage());
        }
    }

    /**
     * Check if user needs signature onboarding
     */
    public function needsSignatureOnboarding(User $user): bool
    {
        return $user->needsSignatureOnboarding();
    }

    /**
     * Get current authenticated user
     */
    public function getCurrentUser(): ?User
    {
        return Auth::user();
    }

    /**
     * Update user profile
     */
    public function updateProfile(User $user, array $data): bool
    {
        // Remove password if empty
        if (empty($data['password'])) {
            unset($data['password']);
        } else {
            $data['password'] = bcrypt($data['password']);
        }

        return $this->userRepository->update($user, $data);
    }

    /**
     * Change user password
     */
    public function changePassword(User $user, string $currentPassword, string $newPassword): bool
    {
        if (!Hash::check($currentPassword, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Password saat ini tidak sesuai.'],
            ]);
        }

        return $this->userRepository->update($user, [
            'password' => bcrypt($newPassword),
        ]);
    }

    /**
     * Toggle user active status
     */
    public function toggleActiveStatus(User $user): bool
    {
        return $this->userRepository->update($user, [
            'is_active' => !$user->is_active,
        ]);
    }
}
