<?php

namespace App\Repositories\Contracts;

use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

interface UserRepositoryInterface
{
    /**
     * Get paginated users
     */
    public function paginate(int $perPage = 15, array $filters = []): LengthAwarePaginator;

    /**
     * Find user by ID
     */
    public function findById(int $id): ?User;

    /**
     * Find user by email
     */
    public function findByEmail(string $email): ?User;

    /**
     * Create new user
     */
    public function create(array $data): User;

    /**
     * Update user
     */
    public function update(User $user, array $data): bool;

    /**
     * Delete user (soft delete)
     */
    public function delete(User $user): bool;

    /**
     * Get users by role
     */
    public function getByRole(string $role): array;

    /**
     * Get users by department
     */
    public function getByDepartment(int $departmentId): array;

    /**
     * Get active users
     */
    public function getActiveUsers(): array;

    /**
     * Get users without signature
     */
    public function getUsersWithoutSignature(): array;
}
