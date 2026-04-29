<?php

namespace App\Repositories\Contracts;

use App\Models\Department;
use Illuminate\Pagination\LengthAwarePaginator;

interface DepartmentRepositoryInterface
{
    /**
     * Ambil department dengan pagination + filter (search)
     */
    public function paginate(int $perPage = 15, array $filters = []): LengthAwarePaginator;

    /**
     * Cari department berdasarkan ID
     */
    public function findById(int $id): ?Department;

    /**
     * Buat department baru
     */
    public function create(array $data): Department;

    /**
     * Update department
     */
    public function update(Department $department, array $data): bool;

    /**
     * Hapus department (soft delete)
     */
    public function delete(Department $department): bool;
}
