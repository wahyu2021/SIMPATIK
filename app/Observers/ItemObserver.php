<?php

namespace App\Observers;

use App\Models\Item;
use Illuminate\Support\Facades\Cache;

class ItemObserver
{
    public function saved(Item $item): void
    {
        Cache::forever('items_version', now()->timestamp);
    }

    public function deleted(Item $item): void
    {
        Cache::forever('items_version', now()->timestamp);
    }
}
