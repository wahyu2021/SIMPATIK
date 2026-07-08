<?php

namespace App\Http\Requests\Auth;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

/**
 * Request Validator: UpdateUserRequest
 *
 * [Fungsionalitas]
 * FormRequest ini bertanggung jawab menangani otorisasi (authorization) dan validasi (validation) 
 * data masukan (input) dari pengguna secara terpusat sebelum dieksekusi oleh Controller.
 */
class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('manage-users') ?? false;
    }

    /**
     * Dapatkan aturan validasi (validation rules) yang diterapkan pada request ini.
     * 
     * [Konteks Keamanan & Bisnis]
     * Aturan di bawah ini memastikan integritas tipe data dan batasan nilai
     * sebelum data mencapai layer Controller.
     * 
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $userId = $this->route('user'); // route param: users/{user}

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', Rule::unique('users', 'email')->ignore($userId)],
            'password' => ['nullable', 'confirmed', Password::min(8)],
            'department_id' => ['required', 'exists:departments,id'],
            'role' => ['required', Rule::in(UserRole::toArray())],
            'is_active' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama harus diisi.',
            'email.required' => 'Email harus diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah digunakan oleh user lain.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
            'department_id.required' => 'Unit kerja harus dipilih.',
            'department_id.exists' => 'Unit kerja tidak valid.',
            'role.required' => 'Role harus dipilih.',
            'role.in' => 'Role tidak valid.',
        ];
    }
}
