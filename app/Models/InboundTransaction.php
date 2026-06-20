<?php

namespace App\Models;

use App\Traits\HasAuditLog;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Facades\Storage;

class InboundTransaction extends Model
{
    use HasFactory, HasAuditLog;

    protected $fillable = [
        'user_id',
        'reference_number',
        'transaction_date',
        'notes',
        'receipt_image_path',
    ];

    protected $appends = ['receipt_image_url'];

    protected function casts(): array
    {
        return [
            'transaction_date' => 'date',
        ];
    }

    protected function receiptImageUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->receipt_image_path ? Storage::disk('public')->url($this->receipt_image_path) : null,
        );
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function details(): HasMany
    {
        return $this->hasMany(InboundTransactionDetail::class);
    }
}
