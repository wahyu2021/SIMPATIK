<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\SignatureController;
use App\Http\Controllers\Auth\UserManagementController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ItemController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Guest Routes
|--------------------------------------------------------------------------
*/

Route::middleware('guest')->group(function () {
    Route::get('/', function () {
        return redirect()->route('login');
    });

    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store']);
});

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth'])->group(function () {
    // Logout
    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');

    // Signature Onboarding - MUST BE OUTSIDE signature middleware
    // Accessible untuk users yang belum ada signature
    Route::prefix('signature')->name('signature.')->group(function () {
        Route::get('/create', [SignatureController::class, 'create'])->name('create');
        Route::post('/create', [SignatureController::class, 'store'])->name('store');
        
        // Edit & update hanya untuk users yang sudah ada signature
        Route::middleware(['signature'])->group(function () {
            Route::get('/edit', [SignatureController::class, 'edit'])->name('edit');
            Route::put('/update', [SignatureController::class, 'update'])->name('update');
        });
    });

    // Routes that require signature completion
    Route::middleware(['signature'])->group(function () {
        // Dashboard
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Items (Barang)
        Route::resource('items', ItemController::class);

        // User Management (Admin only)
        Route::middleware(['role:warehouse_admin'])->group(function () {
            Route::resource('users', UserManagementController::class);
            Route::post('users/{id}/toggle-status', [UserManagementController::class, 'toggleStatus'])
                ->name('users.toggle-status');
        });

        // Profile
        Route::get('/profile', function () {
            return Inertia::render('Profile/Edit', [
                'user' => auth()->user()->load('department'),
            ]);
        })->name('profile.edit');
    });
});


