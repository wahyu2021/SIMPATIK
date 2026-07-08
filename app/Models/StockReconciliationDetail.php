<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Eloquent Model: StockReconciliationDetail
 *
 * [Representasi Tabel & Relasi]
 * - Mendefinisikan struktur relasional entitas di database.
 * - Memuat properti fillable untuk mencegah Mass Assignment Vulnerability.
 * - Method-method di dalamnya mendeskripsikan kardinalitas relasi (HasMany, BelongsTo, dll).
 */
class StockReconciliationDetail extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'reconciliation_id',
        'item_id',
        'system_qty',
        'physical_qty',
        'difference',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'system_qty' => 'integer',
            'physical_qty' => 'integer',
            'difference' => 'integer',
        ];
    }

    public function reconciliation(): BelongsTo
    {
        return $this->belongsTo(StockReconciliation::class, 'reconciliation_id');
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }
}
