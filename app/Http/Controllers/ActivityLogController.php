<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ActivityLogController extends Controller
{
    /**
     * Tampilkan daftar log aktivitas (Hanya Admin).
     */
    public function index(Request $request): Response
    {
        $query = ActivityLog::with('user:id,name')
            ->latest();

        // Filter pencarian
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                  ->orWhere('log_name', 'like', "%{$search}%")
                  ->orWhereHas('user', function($qu) use ($search) {
                      $qu->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Filter Tabel/Modul
        if ($request->filled('module')) {
            $query->where('log_name', $request->module);
        }

        $logs = $query->paginate(20)->onEachSide(1)->withQueryString();

        return Inertia::render('AuditLogs/Index', [
            'logs' => $logs,
            'filters' => $request->only(['search', 'module']),
            'modules' => ActivityLog::distinct()->pluck('log_name')->filter()->values(),
        ]);
    }

    /**
     * Detail log (melihat diff properties).
     */
    public function show(int $id)
    {
        $log = ActivityLog::with('user:id,name')->findOrFail($id);
        return response()->json($log);
    }
}
