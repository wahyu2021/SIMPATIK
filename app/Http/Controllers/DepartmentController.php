<?php

namespace App\Http\Controllers;

use App\Services\DepartmentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

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
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:departments,name',
        ], [
            'name.required' => 'Nama unit kerja wajib diisi.',
            'name.max'      => 'Nama unit kerja maksimal 255 karakter.',
            'name.unique'   => 'Nama unit kerja sudah digunakan.',
        ]);

        $this->departmentService->createDepartment($validated);

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
    public function update(Request $request, int $id): RedirectResponse
    {
        $department = $this->departmentService->findDepartment($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:departments,name,' . $department->id,
        ], [
            'name.required' => 'Nama unit kerja wajib diisi.',
            'name.max'      => 'Nama unit kerja maksimal 255 karakter.',
            'name.unique'   => 'Nama unit kerja sudah digunakan.',
        ]);

        $this->departmentService->updateDepartment($department, $validated);

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
}
