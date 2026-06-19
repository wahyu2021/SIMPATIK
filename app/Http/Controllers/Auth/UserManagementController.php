<?php

namespace App\Http\Controllers\Auth;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterUserRequest;
use App\Http\Requests\Auth\UpdateUserRequest;
use App\Models\Department;
use App\Services\UserService;
use Inertia\Inertia;
use Inertia\Response;

class UserManagementController extends Controller
{
    public function __construct(
        private UserService $userService,
    ) {}

    /**
     * Daftar semua user dengan filter & pagination.
     */
    public function index(): Response
    {
        $filters = request()->only(['search', 'department_id', 'role', 'is_active']);

        return Inertia::render('User/Index', [
            'users' => $this->userService->getUsers($filters),
            'departments' => Department::orderBy('name')->get(),
            'roles' => UserRole::toSelectArray(),
            'filters' => $filters,
        ]);
    }

    /**
     * Form tambah user baru.
     */
    public function create(): Response
    {
        return Inertia::render('User/Form', [
            'departments' => Department::orderBy('name')->get(),
            'roles' => UserRole::toSelectArray(),
        ]);
    }

    /**
     * Simpan user baru.
     */
    public function store(RegisterUserRequest $request)
    {
        $this->userService->createUser(\App\DTOs\User\UserDTO::fromRequest($request));

        return redirect()->route('users.index')
            ->with('success', 'User berhasil ditambahkan.');
    }

    /**
     * Detail user.
     */
    public function show(int $id): Response
    {
        $user = $this->userService->findUser($id);

        return Inertia::render('User/Show', [
            'user' => $user->load(['department', 'roles']),
        ]);
    }

    /**
     * Form edit user.
     */
    public function edit(int $id): Response
    {
        $user = $this->userService->findUser($id);

        return Inertia::render('User/Form', [
            'user' => $user->load(['department', 'roles']),
            'departments' => Department::orderBy('name')->get(),
            'roles' => UserRole::toSelectArray(),
        ]);
    }

    /**
     * Update user — handle password opsional + role sync.
     */
    public function update(UpdateUserRequest $request, int $id)
    {
        $user = $this->userService->findUser($id);

        $this->userService->updateUser($user, \App\DTOs\User\UserDTO::fromRequest($request));

        return redirect()->route('users.index')
            ->with('success', 'User berhasil diperbarui.');
    }

    /**
     * Hapus user (soft delete).
     */
    public function destroy(int $id)
    {
        $user = $this->userService->findUser($id);

        $this->userService->deleteUser($user, auth()->id());

        return redirect()->route('users.index')
            ->with('success', 'User berhasil dihapus.');
    }

    /**
     * Toggle status aktif/nonaktif.
     */
    public function toggleStatus(int $id)
    {
        $user = $this->userService->findUser($id);
        $updated = $this->userService->toggleStatus($user, auth()->id());

        $status = $updated->is_active ? 'diaktifkan' : 'dinonaktifkan';

        return redirect()->back()
            ->with('success', "User berhasil {$status}.");
    }
    /**
     * Import users dari file Excel/CSV (GForm export).
     */
    public function import(\App\Http\Requests\Auth\ImportUserRequest $request)
    {
        try {
            $import = new \App\Imports\UsersImport;
            \Maatwebsite\Excel\Facades\Excel::import($import, $request->file('file'));

            if ($import->importedCount === 0) {
                return redirect()->route('users.index')
                    ->with('error', 'Gagal mengimpor. Sistem tidak menemukan kolom Nama dan Email di file Anda, atau data sudah ada.');
            }

            return redirect()->route('users.index')
                ->with('success', "Berhasil! {$import->importedCount} data user telah ditambahkan.");
        } catch (\Exception $e) {
            return redirect()->route('users.index')
                ->with('error', 'Gagal mengimpor data: format file tidak sesuai atau rusak.');
        }
    }
}
