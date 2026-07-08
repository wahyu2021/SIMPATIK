<?php

namespace App\Providers;

use App\Models\OutboundTransaction;
use App\Policies\OutboundPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(OutboundTransaction::class, OutboundPolicy::class);
        
        \App\Models\Category::observe(\App\Observers\CategoryObserver::class);
        \App\Models\Department::observe(\App\Observers\DepartmentObserver::class);
        \App\Models\Item::observe(\App\Observers\ItemObserver::class);
        \App\Models\User::observe(\App\Observers\UserObserver::class);
        \App\Models\InboundTransaction::observe(\App\Observers\InboundTransactionObserver::class);
        \App\Models\OutboundTransaction::observe(\App\Observers\OutboundTransactionObserver::class);
    }
}
