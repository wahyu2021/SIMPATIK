<?php

namespace App\Http\Controllers\Auth;

use App\DTOs\Auth\LoginDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Services\Auth\AuthService;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller: LoginController
 *
 * [Arsitektur Layered]
 * Controller ini murni bertugas menangani Request HTTP (Input) dan Response (Output).
 * Seluruh logika bisnis atau manipulasi database dilarang berada di sini, melainkan 
 * harus didelegasikan (di-passing) ke lapisan Service melalui Data Transfer Object (DTO).
 */
class LoginController extends Controller
{
    public function __construct(
        private AuthService $authService
    ) {}

    /**
     * Show login form
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login');
    }

    /**
     * Handle login request
     */
    public function store(LoginRequest $request)
    {
        $user = $this->authService->login(
            LoginDTO::fromRequest($request)
        );

        $request->session()->regenerate();

        // Redirect to dashboard
        return redirect()->intended(route('dashboard'))
            ->with('success', 'Selamat datang, ' . $user->name);
    }

    /**
     * Logout user
     */
    public function destroy()
    {
        $this->authService->logout();

        return redirect()->route('login')
            ->with('success', 'Anda telah keluar dari sistem.');
    }
}

