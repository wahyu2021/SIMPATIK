<?php

namespace App\Repositories\Eloquent;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;

/**
 * Repository: UserRepository
 *
 * [Data Access Layer]
 * Pattern Repository digunakan untuk memisahkan abstraksi query database dari logika bisnis.
 * Hal ini memastikan bahwa kode yang berhubungan langsung dengan struktur tabel/kolom Eloquent
 * terisolasi dan mudah di-mock (ditiru) saat melakukan Unit Testing.
 */
class UserRepository implements UserRepositoryInterface
{
    public function paginate(int $perPage = 15, array $filters = []): LengthAwarePaginator
    {
        $query = User::with(['department', 'roles']);

        // Search filter
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', "%{$filters['search']}%")
                  ->orWhere('email', 'like', "%{$filters['search']}%");
            });
        }

        // Department filter
        if (!empty($filters['department_id'])) {
            $query->where('department_id', $filters['department_id']);
        }

        // Role filter
        if (!empty($filters['role'])) {
            $query->role($filters['role']);
        }

        // Active status filter
        if (isset($filters['is_active'])) {
            $query->where('is_active', $filters['is_active']);
        }

        // Signature filter
        if (isset($filters['has_signature'])) {
            if ($filters['has_signature']) {
                $query->whereNotNull('signature_path');
            } else {
                $query->whereNull('signature_path');
            }
        }

        $page = request()->get('page', 1);
        $version = Cache::get('users_version', '0');
        $cacheKey = "users_paginate_v{$version}_" . md5(json_encode(func_get_args()) . $page);

        return Cache::remember($cacheKey, 3600, function () use ($query, $perPage) {
            return $query->latest()->paginate($perPage)->onEachSide(1);
        });
    }

    public function findById(int $id): ?User
    {
        $version = Cache::get('users_version', '0');
        return Cache::remember("users_find_v{$version}_{$id}", 3600, function () use ($id) {
            return User::with(['department', 'roles'])->find($id);
        });
    }

    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }

    public function create(array $data): User
    {
        return User::create($data);
    }

    public function update(User $user, array $data): bool
    {
        return $user->update($data);
    }

    public function delete(User $user): bool
    {
        return $user->delete();
    }

    public function getByRole(string $role): array
    {
        return User::role($role)->get()->toArray();
    }

    public function getByDepartment(int $departmentId): array
    {
        return User::where('department_id', $departmentId)
            ->with('roles')
            ->get()
            ->toArray();
    }

    public function getActiveUsers(): array
    {
        return User::where('is_active', true)
            ->with(['department', 'roles'])
            ->get()
            ->toArray();
    }

    public function getUsersWithoutSignature(): array
    {
        return User::whereNull('signature_path')
            ->where('is_active', true)
            ->with('department')
            ->get()
            ->toArray();
    }
}
