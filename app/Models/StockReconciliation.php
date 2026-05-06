<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StockReconciliation extends Model
{
    protected $fillable = [
        'month',
        'year',
        'reconciliation_date',
        'created_by',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'reconciliation_date' => 'date',
            'month' => 'integer',
            'year' => 'integer',
        ];
    }

    public function details(): HasMany
    {
        return $this->hasMany(StockReconciliationDetail::class, 'reconciliation_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
