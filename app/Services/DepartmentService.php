<?php

namespace App\Services;

use App\Models\Department;
use App\Repositories\Contracts\DepartmentRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * Service Layer: DepartmentService
 *
 * [Business Logic & Transaksi]
 * Class ini menangani seluruh alur logika bisnis utama (Business Rules).
 * - Bertanggung jawab atas integritas data.
 * - Sering dibungkus dalam DB::transaction() jika melibatkan multi-tabel.
 * - Berkomunikasi dengan database HANYA melalui interface Repository.
 */
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
     * Buat unit kerja baru.
     */
    public function createDepartment(\App\DTOs\Department\DepartmentDTO $dto): Department
    {
        return $this->departmentRepository->create([
            'name' => $dto->name,
        ]);
    }

    /**
     * Update data unit kerja.
     */
    public function updateDepartment(Department $department, \App\DTOs\Department\DepartmentDTO $dto): bool
    {
        return $this->departmentRepository->update($department, [
            'name' => $dto->name,
        ]);
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
