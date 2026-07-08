<?php

namespace App\Http\Controllers;

use App\Services\DashboardService;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller: DashboardController
 *
 * [Arsitektur Layered]
 * Controller ini murni bertugas menangani Request HTTP (Input) dan Response (Output).
 * Seluruh logika bisnis atau manipulasi database dilarang berada di sini, melainkan 
 * harus didelegasikan (di-passing) ke lapisan Service melalui Data Transfer Object (DTO).
 */
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
