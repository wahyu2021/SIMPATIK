<?php

namespace App\Http\Controllers;

use App\Services\DepartmentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller: DepartmentController
 *
 * [Arsitektur Layered]
 * Controller ini murni bertugas menangani Request HTTP (Input) dan Response (Output).
 * Seluruh logika bisnis atau manipulasi database dilarang berada di sini, melainkan 
 * harus didelegasikan (di-passing) ke lapisan Service melalui Data Transfer Object (DTO).
 */
class DepartmentController extends Controller
{
    public function __construct(
        private DepartmentService $departmentService
    ) {}

    /**
     * Tampilkan daftar unit kerja (dengan filter & pagination).
     */
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'sort_by', 'sort_dir']);

        return Inertia::render('Departments/Index', [
            'departments' => $this->departmentService->getDepartments($filters),
            'filters'     => $filters,
        ]);
    }

    /**
     * Tampilkan form tambah unit kerja.
     */
    public function create(): Response
    {
        return Inertia::render('Departments/Form');
    }

    /**
     * Simpan unit kerja baru.
     */
    public function store(\App\Http\Requests\Department\StoreDepartmentRequest $request): RedirectResponse
    {
        $this->departmentService->createDepartment(\App\DTOs\Department\DepartmentDTO::fromRequest($request));

        return redirect()
            ->route('departments.index')
            ->with('success', 'Unit kerja berhasil ditambahkan.');
    }

    /**
     * Tampilkan form edit unit kerja.
     */
    public function edit(int $id): Response
    {
        return Inertia::render('Departments/Form', [
            'department' => $this->departmentService->findDepartment($id),
        ]);
    }

    /**
     * Update data unit kerja.
     */
    public function update(\App\Http\Requests\Department\UpdateDepartmentRequest $request, int $id): RedirectResponse
    {
        $department = $this->departmentService->findDepartment($id);

        $this->departmentService->updateDepartment($department, \App\DTOs\Department\DepartmentDTO::fromRequest($request));

        return redirect()
            ->route('departments.index')
            ->with('success', 'Unit kerja berhasil diperbarui.');
    }

    /**
     * Hapus unit kerja (soft delete).
     */
    public function destroy(int $id): RedirectResponse
    {
        $department = $this->departmentService->findDepartment($id);
        $this->departmentService->deleteDepartment($department);

        return redirect()
            ->route('departments.index')
            ->with('success', 'Unit kerja berhasil dihapus.');
    }

    /**
     * Tampilkan detail unit kerja.
     */
    public function show(int $id)
    {
        abort(404);
    }
}
