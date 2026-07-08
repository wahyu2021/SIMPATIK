<?php

namespace App\Services;

use App\Enums\UserRole;
use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

/**
 * Service Layer: UserService
 *
 * [Business Logic & Transaksi]
 * Class ini menangani seluruh alur logika bisnis utama (Business Rules).
 * - Bertanggung jawab atas integritas data.
 * - Sering dibungkus dalam DB::transaction() jika melibatkan multi-tabel.
 * - Berkomunikasi dengan database HANYA melalui interface Repository.
 */
class UserService
{
    public function __construct(
        private UserRepositoryInterface $userRepository
    ) {}

    /**
     * Ambil daftar user dengan pagination dan filter.
     */
    public function getUsers(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->userRepository->paginate($perPage, $filters);
    }

    /**
     * Cari user berdasarkan ID.
     *
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException
     */
    public function findUser(int $id): User
    {
        $user = $this->userRepository->findById($id);

        if (!$user) {
            abort(404, 'User tidak ditemukan.');
        }

        return $user;
    }

    /**
     * Buat user baru dan assign role + permissions.
     */
    public function createUser(\App\DTOs\User\UserDTO $dto): User
    {
        return DB::transaction(function () use ($dto) {
            $user = $this->userRepository->create([
                'name' => $dto->name,
                'email' => $dto->email,
                'password' => $dto->password, // auto hashed via model cast
                'department_id' => $dto->department_id,
                'is_active' => $dto->is_active ?? true,
            ]);

            $this->syncRoleAndPermissions($user, $dto->role);

            return $user->load(['department', 'roles']);
        });
    }

    /**
     * Update data user, sync role jika berubah.
     */
    public function updateUser(User $user, \App\DTOs\User\UserDTO $dto): User
    {
        return DB::transaction(function () use ($user, $dto) {
            $updateData = [
                'name' => $dto->name,
                'email' => $dto->email,
                'department_id' => $dto->department_id,
                'is_active' => $dto->is_active ?? $user->is_active,
            ];

            // Hanya update password jika diisi
            if (!empty($dto->password)) {
                $updateData['password'] = $dto->password;
            }

            $this->userRepository->update($user, $updateData);

            // Sync role jika berubah
            if (!empty($dto->role)) {
                $currentRole = $user->getRoleName();
                if ($currentRole !== $dto->role) {
                    $this->syncRoleAndPermissions($user, $dto->role);
                }
            }

            return $user->fresh(['department', 'roles']);
        });
    }

    /**
     * Hapus user (soft delete).
     * Gagal jika user punya transaksi terkait.
     */
    public function deleteUser(User $user, int $currentUserId): bool
    {
        // Tidak boleh hapus diri sendiri
        if ($user->id === $currentUserId) {
            abort(422, 'Anda tidak dapat menghapus akun sendiri.');
        }

        // Cek relasi transaksi
        $hasInbound = $user->inboundTransactions()->exists();
        $hasOutboundRequester = $user->outboundRequestsAsRequester()->exists();
        $hasOutboundApprover = $user->outboundRequestsAsApprover()->exists();

        if ($hasInbound || $hasOutboundRequester || $hasOutboundApprover) {
            abort(422, 'User tidak dapat dihapus karena masih memiliki transaksi terkait. Nonaktifkan user sebagai gantinya.');
        }

        return $this->userRepository->delete($user);
    }

    /**
     * Toggle status aktif/nonaktif user.
     */
    public function toggleStatus(User $user, int $currentUserId): User
    {
        if ($user->id === $currentUserId) {
            abort(422, 'Anda tidak dapat menonaktifkan akun sendiri.');
        }

        $this->userRepository->update($user, [
            'is_active' => !$user->is_active,
        ]);

        return $user->fresh();
    }

    /**
     * Sync role dan permissions berdasarkan role enum.
     */
    private function syncRoleAndPermissions(User $user, string $roleName): void
    {
        $role = UserRole::from($roleName);
        $user->syncRoles([$roleName]);
        $user->syncPermissions($role->permissions());
    }
}
