<?php

namespace App\Providers;

use App\Repositories\Contracts\CategoryRepositoryInterface;
use App\Repositories\Contracts\DashboardRepositoryInterface;
use App\Repositories\Contracts\DepartmentRepositoryInterface;
use App\Repositories\Contracts\InboundRepositoryInterface;
use App\Repositories\Contracts\ItemRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Repositories\Eloquent\CategoryRepository;
use App\Repositories\Eloquent\DashboardRepository;
use App\Repositories\Eloquent\DepartmentRepository;
use App\Repositories\Eloquent\InboundRepository;
use App\Repositories\Eloquent\ItemRepository;
use App\Repositories\Eloquent\UserRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * All of the container bindings that should be registered.
     *
     * @var array
     */
    public array $bindings = [
        UserRepositoryInterface::class       => UserRepository::class,
        DashboardRepositoryInterface::class  => DashboardRepository::class,
        ItemRepositoryInterface::class       => ItemRepository::class,
        DepartmentRepositoryInterface::class => DepartmentRepository::class,
        InboundRepositoryInterface::class    => InboundRepository::class,
        CategoryRepositoryInterface::class   => CategoryRepository::class,
    ];

    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
