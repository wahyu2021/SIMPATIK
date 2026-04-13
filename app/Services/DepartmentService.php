<?php

namespace App\Services;

use App\Models\Department;
use App\Repositories\Contracts\DepartmentRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class DepartmentService
{
    public function __construct(
        private DepartmentRepositoryInterface $departmentRepository
    ) {}

    /**
     * Ambil daftar department dengan pagination dan filter.
     */
    public function getDepartments(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->departmentRepository->paginate($perPage, $filters);
    }

    /**
     * Cari department berdasarkan ID.
     *
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException
     */
    public function findDepartment(int $id): Department
    {
        $department = $this->departmentRepository->findById($id);

        if (!$department) {
            abort(404, 'Unit kerja tidak ditemukan.');
        }

        return $department;
    }

    /**
     * Buat department baru.
     */
    public function createDepartment(array $data): Department
    {
        return $this->departmentRepository->create($data);
    }

    /**
     * Update department yang sudah ada.
     */
    public function updateDepartment(Department $department, array $data): bool
    {
        return $this->departmentRepository->update($department, $data);
    }

    /**
     * Hapus department (soft delete).
     * Cek apakah masih ada user yang terdaftar di department ini.
     */
    public function deleteDepartment(Department $department): bool
    {
        // Pengecekan relasi: jangan hapus jika masih ada user terkait
        if ($department->users_count > 0 || $department->users()->count() > 0) {
            abort(422, 'Unit kerja tidak dapat dihapus karena masih memiliki pengguna terdaftar.');
        }

        return $this->departmentRepository->delete($department);
    }
}
