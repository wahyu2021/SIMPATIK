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
use App\Http\Controllers\NotificationController;
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

    // Routes that require auth
        // Dashboard
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Items (Barang)
        Route::resource('items', ItemController::class);

        // User Management (Admin only)
        Route::middleware(['role:warehouse_admin'])->group(function () {
            Route::resource('users', UserManagementController::class);
            Route::post('users/{id}/toggle-status', [UserManagementController::class, 'toggleStatus'])
                ->name('users.toggle-status');
            
            Route::get('audit-logs', [\App\Http\Controllers\ActivityLogController::class, 'index'])->name('audit-logs.index');
            Route::get('audit-logs/{id}', [\App\Http\Controllers\ActivityLogController::class, 'show'])->name('audit-logs.show');
        });

        // Profile
        Route::prefix('profile')->name('profile.')->group(function () {
            Route::get('/', [ProfileController::class, 'edit'])->name('edit');
            Route::put('/update', [ProfileController::class, 'updateProfile'])->name('update');
            Route::put('/password', [ProfileController::class, 'updatePassword'])->name('password');
        });

        // Barang Masuk (Inbound)
        Route::middleware(['can:view-inbound'])->group(function () {
            Route::resource('inbound', InboundController::class);
        });
        // Pengajuan Barang (Outbound) — otorisasi via OutboundPolicy
        Route::resource('outbound', OutboundController::class)->only(['index', 'create', 'store', 'show', 'edit', 'update', 'destroy']);
        Route::get('outbound-direct/create', [OutboundController::class, 'createDirect'])->name('outbound.create-direct');
        Route::post('outbound-direct', [OutboundController::class, 'storeDirect'])->name('outbound.store-direct');
        Route::post('outbound/{id}/approve', [OutboundController::class, 'approve'])->name('outbound.approve');
        Route::post('outbound/{id}/reject', [OutboundController::class, 'reject'])->name('outbound.reject');
        Route::post('outbound/{id}/issue', [OutboundController::class, 'issue'])->name('outbound.issue');
        Route::post('outbound/{id}/handover', [OutboundController::class, 'handover'])->name('outbound.handover');
        Route::post('outbound/{id}/pickup', [OutboundController::class, 'pickup'])->name('outbound.pickup');
        Route::get('outbound/{id}/pdf/spb', [OutboundController::class, 'downloadSpb'])->name('outbound.pdf.spb');
        Route::get('outbound/{id}/pdf/bast', [OutboundController::class, 'downloadBast'])->name('outbound.pdf.bast');
        Route::resource('categories', CategoryController::class);
        Route::resource('departments', DepartmentController::class);
        Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
        Route::get('/reports/department', [ReportController::class, 'departmentReport'])->name('reports.department');
        Route::get('/reports/export/mutation', [ReportController::class, 'exportMutationPdf'])->name('reports.export.mutation');
        Route::get('/reports/export/mutation/excel', [ReportController::class, 'exportMutationExcel'])->name('reports.export.mutation.excel');
        Route::get('/reports/export/department', [ReportController::class, 'exportDepartmentPdf'])->name('reports.export.department');
        Route::get('/reports/export/department/excel', [ReportController::class, 'exportDepartmentExcel'])->name('reports.export.department.excel');
        Route::get('/reports/breakdown/{itemId}', [ReportController::class, 'breakdown'])->name('reports.breakdown');
        Route::get('/reports/stock-ledger', [ReportController::class, 'stockLedger'])->name('reports.stock-ledger');
        Route::get('/reports/reconciliation', [ReportController::class, 'reconciliation'])->name('reports.reconciliation');
        Route::post('/reports/reconciliation', [ReportController::class, 'storeReconciliation'])->name('reports.reconciliation.store');
        Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
        Route::put('/settings', [SettingController::class, 'update'])->name('settings.update');

        // Notifikasi
        Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
        Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
        Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
});


