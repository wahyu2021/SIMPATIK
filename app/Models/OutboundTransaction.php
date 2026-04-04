<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OutboundTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'requester_id',
        'approver_id',
        'department_id',
        'document_number',
        'transaction_date',
        'status',
        'approved_at',
    ];

    protected function casts(): array
    {
        return [
            'transaction_date' => 'date',
            'approved_at' => 'datetime',
        ];
    }

    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requester_id');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approver_id');
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function details(): HasMany
    {
        return $this->hasMany(OutboundTransactionDetail::class);
    }
}
