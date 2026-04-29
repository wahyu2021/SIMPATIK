<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DemandForecast extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_id',
        'target_period',
        'forecasted_demand',
        'suggested_order_qty',
        'model_version',
        'mae_score',
    ];

    protected function casts(): array
    {
        return [
            'forecasted_demand' => 'integer',
            'suggested_order_qty' => 'integer',
            'mae_score' => 'decimal:4',
        ];
    }
    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }
}
