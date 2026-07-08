<?php

namespace App\Observers;

use App\Models\InboundTransaction;
use Illuminate\Support\Facades\Cache;

class InboundTransactionObserver
{
    public function saved(InboundTransaction $transaction): void
    {
        Cache::forever('inbounds_version', now()->timestamp);
    }

    public function deleted(InboundTransaction $transaction): void
    {
        Cache::forever('inbounds_version', now()->timestamp);
    }
}
