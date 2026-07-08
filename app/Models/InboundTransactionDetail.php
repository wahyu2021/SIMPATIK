<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Eloquent Model: InboundTransactionDetail
 *
 * [Representasi Tabel & Relasi]
 * - Mendefinisikan struktur relasional entitas di database.
 * - Memuat properti fillable untuk mencegah Mass Assignment Vulnerability.
 * - Method-method di dalamnya mendeskripsikan kardinalitas relasi (HasMany, BelongsTo, dll).
 */
class InboundTransactionDetail extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'inbound_transaction_id',
        'item_id',
        'quantity',
        'unit_price',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'unit_price' => 'decimal:2',
        ];
    }

    public function inboundTransaction(): BelongsTo
    {
        return $this->belongsTo(InboundTransaction::class);
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }
}
