<?php

namespace App\Models;

use App\Traits\HasAuditLog;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Item extends Model
{
    use HasFactory, HasAuditLog, SoftDeletes;

    protected $fillable = [
        'category_id',
        'item_code',
        'name',
        'unit_of_measure',
        'unit_price',
        'current_stock',
        'minimum_stock_level',
    ];

    protected function casts(): array
    {
        return [
            'unit_price' => 'decimal:2',
            'current_stock' => 'integer',
            'minimum_stock_level' => 'integer',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function inboundTransactionDetails(): HasMany
    {
        return $this->hasMany(InboundTransactionDetail::class);
    }

    public function outboundTransactionDetails(): HasMany
    {
        return $this->hasMany(OutboundTransactionDetail::class);
    }

    public function stockLedgers(): HasMany
    {
        return $this->hasMany(StockLedger::class);
    }

    public function demandForecasts(): HasMany
    {
        return $this->hasMany(DemandForecast::class);
    }

    // --- Helpers ---

    /**
     * Check if stock is at or below minimum level (trigger for WA notification)
     */
    public function isLowStock(): bool
    {
        return $this->current_stock <= $this->minimum_stock_level;
    }
}
