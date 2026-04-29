<?php

namespace App\Http\Controllers\Auth;

use App\DTOs\Auth\RegisterUserDTO;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterUserRequest;
use App\Models\Department;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Services\Auth\AuthService;
use Inertia\Inertia;
use Inertia\Response;

class UserManagementController extends Controller
{
    public function __construct(
        private AuthService $authService,
        private UserRepositoryInterface $userRepository
    ) {}

    /**
     * Display user list
     */
    public function index(): Response
    {
        $users = $this->userRepository->paginate(
            perPage: 15,
            filters: request()->only(['search', 'department_id', 'role', 'is_active', 'has_signature'])
        );

        return Inertia::render('User/Index', [
            'users' => $users,
            'departments' => Department::all(),
            'roles' => UserRole::toSelectArray(),
            'filters' => request()->only(['search', 'department_id', 'role', 'is_active', 'has_signature']),
        ]);
    }

    /**
     * Show create user form
     */
    public function create(): Response
    {
        return Inertia::render('User/Create', [
            'departments' => Department::all(),
            'roles' => UserRole::toSelectArray(),
        ]);
    }

    /**
     * Store new user
     */
    public function store(RegisterUserRequest $request)
    {
        $user = $this->authService->register(
            RegisterUserDTO::fromRequest($request)
        );

        return redirect()->route('users.show', $user)
            ->with('success', 'User berhasil dibuat.');
    }

    /**
     * Show user detail
     */
    public function show(int $id): Response
    {
        $user = $this->userRepository->findById($id);

        if (!$user) {
            abort(404, 'User tidak ditemukan.');
        }

        return Inertia::render('User/Show', [
            'user' => $user->load(['department', 'roles', 'permissions']),
        ]);
    }

    /**
     * Show edit user form
     */
    public function edit(int $id): Response
    {
        $user = $this->userRepository->findById($id);

        if (!$user) {
            abort(404, 'User tidak ditemukan.');
        }

        return Inertia::render('User/Edit', [
            'user' => $user,
            'departments' => Department::all(),
            'roles' => UserRole::toSelectArray(),
        ]);
    }

    /**
     * Update user
     */
    public function update(RegisterUserRequest $request, int $id)
    {
        $user = $this->userRepository->findById($id);

        if (!$user) {
            abort(404, 'User tidak ditemukan.');
        }

        $this->userRepository->update($user, $request->validated());

        return redirect()->route('users.show', $user)
            ->with('success', 'User berhasil diperbarui.');
    }

    /**
     * Delete user
     */
    public function destroy(int $id)
    {
        $user = $this->userRepository->findById($id);

        if (!$user) {
            abort(404, 'User tidak ditemukan.');
        }

        // Prevent self-deletion
        if ($user->id === auth()->id()) {
            return redirect()->back()
                ->with('error', 'Anda tidak dapat menghapus akun sendiri.');
        }

        $this->userRepository->delete($user);

        return redirect()->route('users.index')
            ->with('success', 'User berhasil dihapus.');
    }

    /**
     * Toggle user active status
     */
    public function toggleStatus(int $id)
    {
        $user = $this->userRepository->findById($id);

        if (!$user) {
            abort(404, 'User tidak ditemukan.');
        }

        $this->authService->toggleActiveStatus($user);

        $status = $user->fresh()->is_active ? 'diaktifkan' : 'dinonaktifkan';

        return redirect()->back()
            ->with('success', "User berhasil {$status}.");
    }
}
