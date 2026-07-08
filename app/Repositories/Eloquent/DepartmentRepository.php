<?php

namespace App\Repositories\Eloquent;

use App\Models\Department;
use App\Repositories\Contracts\DepartmentRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;

class DepartmentRepository implements DepartmentRepositoryInterface
{
    public function paginate(int $perPage = 15, array $filters = []): LengthAwarePaginator
    {
        $query = Department::withCount('users');

        // Search: nama unit kerja
        if (!empty($filters['search'])) {
            $query->where('name', 'like', "%{$filters['search']}%");
        }

        // Sorting (default: terbaru)
        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortDir = $filters['sort_dir'] ?? 'desc';
        $allowedSorts = ['name', 'created_at'];

        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortDir === 'asc' ? 'asc' : 'desc');
        }

        $page = request()->get('page', 1);
        $version = Cache::get('departments_version', '0');
        $cacheKey = "departments_paginate_v{$version}_" . md5(json_encode(func_get_args()) . $page);

        return Cache::remember($cacheKey, 3600, function () use ($query, $perPage) {
            return $query->paginate($perPage)->onEachSide(1)->withQueryString();
        });
    }

    public function findById(int $id): ?Department
    {
        $version = Cache::get('departments_version', '0');
        return Cache::remember("departments_find_v{$version}_{$id}", 3600, function () use ($id) {
            return Department::withCount('users')->find($id);
        });
    }

    public function create(array $data): Department
    {
        return Department::create($data);
    }

    public function update(Department $department, array $data): bool
    {
        return $department->update($data);
    }

    public function delete(Department $department): bool
    {
        return $department->delete();
    }
}
