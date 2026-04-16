<?php

namespace App\Repositories\Eloquent;

use App\Models\Department;
use App\Repositories\Contracts\DepartmentRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

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

        return $query->paginate($perPage)->withQueryString();
    }

    public function findById(int $id): ?Department
    {
        return Department::withCount('users')->find($id);
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
