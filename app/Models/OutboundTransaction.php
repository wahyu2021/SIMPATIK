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
        'issued_by',
        'department_id',
        'document_number',
        'transaction_date',
        'status',
        'approved_at',
        'issued_at',
        'is_special_request',
        'rejection_reason',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'transaction_date' => 'date',
            'approved_at' => 'datetime',
            'issued_at' => 'datetime',
            'is_special_request' => 'boolean',
        ];
    }

    // --- Relationships ---

    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requester_id');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approver_id');
    }

    public function issuedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'issued_by');
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function details(): HasMany
    {
        return $this->hasMany(OutboundTransactionDetail::class);
    }

    // --- Status Helpers ---

    public function isPending(): bool
    {
        return $this->status === 'Pending';
    }

    public function isApproved(): bool
    {
        return $this->status === 'Approved';
    }

    public function isIssued(): bool
    {
        return $this->status === 'Issued';
    }

    public function isRejected(): bool
    {
        return $this->status === 'Rejected';
    }
}
