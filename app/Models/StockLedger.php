<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockLedger extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_id',
        'transaction_date',
        'movement_type',
        'document_reference',
        'qty_in',
        'qty_out',
        'ending_balance',
    ];

    protected function casts(): array
    {
        return [
            'transaction_date' => 'date',
            'qty_in' => 'integer',
            'qty_out' => 'integer',
            'ending_balance' => 'integer',
        ];
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }
}
