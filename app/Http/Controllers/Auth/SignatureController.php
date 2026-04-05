<?php

namespace App\Http\Controllers\Auth;

use App\DTOs\Auth\SaveSignatureDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\SaveSignatureRequest;
use App\Services\Auth\AuthService;
use Inertia\Inertia;
use Inertia\Response;

class SignatureController extends Controller
{
    public function __construct(
        private AuthService $authService
    ) {}

    /**
     * Show signature onboarding page
     * Only for users without signature
     */
    public function create(): Response
    {
        $user = auth()->user();

        // If already has signature, redirect to dashboard
        if ($user && !$user->needsSignatureOnboarding()) {
            return redirect()->route('dashboard')
                ->with('info', 'Anda sudah memiliki tanda tangan digital.');
        }

        return Inertia::render('Auth/Signature', [
            'user' => $user,
        ]);
    }

    /**
     * Save user signature
     */
    public function store(SaveSignatureRequest $request)
    {
        $user = auth()->user();

        if (!$user) {
            return redirect()->route('login')
                ->with('error', 'Silakan login terlebih dahulu.');
        }

        try {
            $this->authService->saveSignature(
                $user,
                SaveSignatureDTO::fromRequest($request)
            );

            return redirect()->route('dashboard')
                ->with('success', 'Tanda tangan digital berhasil disimpan! Selamat datang.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Gagal menyimpan tanda tangan: ' . $e->getMessage());
        }
    }

    /**
     * Show signature update page
     * Only for users with signature
     */
    public function edit(): Response
    {
        $user = auth()->user();

        if (!$user || $user->needsSignatureOnboarding()) {
            return redirect()->route('signature.create')
                ->with('warning', 'Anda belum memiliki tanda tangan digital.');
        }

        return Inertia::render('Profile/EditSignature', [
            'user' => $user,
        ]);
    }

    /**
     * Update user signature
     */
    public function update(SaveSignatureRequest $request)
    {
        $user = auth()->user();

        if (!$user) {
            return redirect()->route('login')
                ->with('error', 'Silakan login terlebih dahulu.');
        }

        try {
            $this->authService->saveSignature(
                $user,
                SaveSignatureDTO::fromRequest($request)
            );

            return redirect()->back()
                ->with('success', 'Tanda tangan digital berhasil diperbarui!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Gagal memperbarui tanda tangan: ' . $e->getMessage());
        }
    }
}

