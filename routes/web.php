<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\SignatureController;
use App\Http\Controllers\Auth\UserManagementController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\InboundController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\OutboundController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
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
        Route::prefix('profile')->name('profile.')->group(function () {
            Route::get('/', [ProfileController::class, 'edit'])->name('edit');
            Route::put('/update', [ProfileController::class, 'updateProfile'])->name('update');
            Route::put('/password', [ProfileController::class, 'updatePassword'])->name('password');
            Route::put('/signature', [ProfileController::class, 'updateSignature'])->name('signature');
        });

        // Barang Masuk (Inbound) — Admin Gudang only
        Route::middleware(['role:warehouse_admin'])->group(function () {
            Route::resource('inbound', InboundController::class);
        });
        // Pengajuan Barang (Outbound) — semua role bisa akses (filter di controller)
        Route::resource('outbound', OutboundController::class)->only(['index', 'create', 'store', 'show', 'destroy']);
        Route::post('outbound/{id}/approve', [OutboundController::class, 'approve'])->name('outbound.approve');
        Route::post('outbound/{id}/reject', [OutboundController::class, 'reject'])->name('outbound.reject');
        Route::post('outbound/{id}/issue', [OutboundController::class, 'issue'])->name('outbound.issue');
        Route::resource('categories', CategoryController::class);
        Route::resource('departments', DepartmentController::class);
        Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
        Route::get('/reports/breakdown/{itemId}', [ReportController::class, 'breakdown'])->name('reports.breakdown');
        Route::get('/reports/stock-ledger', [ReportController::class, 'stockLedger'])->name('reports.stock-ledger');
        Route::get('/reports/reconciliation', [ReportController::class, 'reconciliation'])->name('reports.reconciliation');
        Route::post('/reports/reconciliation', [ReportController::class, 'storeReconciliation'])->name('reports.reconciliation.store');
        Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
            Route::put('/settings', [SettingController::class, 'update'])->name('settings.update');
    });
});


