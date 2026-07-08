<?php

namespace App\Observers;

use App\Models\Department;
use Illuminate\Support\Facades\Cache;

class DepartmentObserver
{
    public function saved(Department $department): void
    {
        Cache::forever('departments_version', now()->timestamp);
    }

    public function deleted(Department $department): void
    {
        Cache::forever('departments_version', now()->timestamp);
    }
}
