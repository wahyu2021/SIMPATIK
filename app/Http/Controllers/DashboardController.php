<?php

namespace App\Http\Controllers;

use App\Services\DashboardService;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private DashboardService $dashboardService
    ) {}

    /**
     * Tampilkan halaman Dashboard dengan statistik.
     */
    public function index(): Response
    {
        $data = $this->dashboardService->getDashboardData();

        return Inertia::render('Dashboard/Index', $data);
    }
}
