<?php

namespace App\Observers;

use App\Models\OutboundTransaction;
use Illuminate\Support\Facades\Cache;

class OutboundTransactionObserver
{
    public function saved(OutboundTransaction $transaction): void
    {
        Cache::forever('outbounds_version', now()->timestamp);
    }

    public function deleted(OutboundTransaction $transaction): void
    {
        Cache::forever('outbounds_version', now()->timestamp);
    }
}
