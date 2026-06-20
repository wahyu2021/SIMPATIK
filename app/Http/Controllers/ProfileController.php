<?php

namespace App\Http\Controllers;

use App\Http\Requests\Profile\UpdatePasswordRequest;
use App\Http\Requests\Profile\UpdateProfileRequest;
use App\Services\ProfileService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function __construct(
        private ProfileService $profileService
    ) {}

    /**
     * Tampilkan halaman profil.
     */
    public function edit(Request $request): Response
    {
        $data = $this->profileService->getProfileData($request->user());

        return Inertia::render('Profile/Edit', $data);
    }

    /**
     * Update data profil (nama & email).
     */
    public function updateProfile(UpdateProfileRequest $request): RedirectResponse
    {
        $this->profileService->updateProfile($request->user(), \App\DTOs\Profile\ProfileDTO::fromRequest($request));

        return redirect()
            ->route('profile.edit')
            ->with('success', 'Profil berhasil diperbarui.');
    }

    /**
     * Ganti password.
     */
    public function updatePassword(UpdatePasswordRequest $request): RedirectResponse
    {
        $this->profileService->updatePassword($request->user(), $request->validated()['password']);

        return redirect()
            ->route('profile.edit')
            ->with('success', 'Password berhasil diubah.');
    }

    /**
     * Update tanda tangan.
     */
    public function updateSignature(\App\Http\Requests\Profile\UpdateSignatureRequest $request): RedirectResponse
    {
        $this->profileService->updateSignature($request->user(), $request->validated('signature'));

        return redirect()
            ->route('profile.edit')
            ->with('success', 'Tanda tangan berhasil diperbarui.');
    }
}
