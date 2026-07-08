<?php

namespace App\Models;

use App\Enums\OutboundStatus;
use App\Traits\HasAuditLog;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Eloquent Model: OutboundTransaction
 *
 * [Representasi Tabel & Relasi]
 * - Mendefinisikan struktur relasional entitas di database.
 * - Memuat properti fillable untuk mencegah Mass Assignment Vulnerability.
 * - Method-method di dalamnya mendeskripsikan kardinalitas relasi (HasMany, BelongsTo, dll).
 */
class OutboundTransaction extends Model
{
    use HasFactory, HasAuditLog, SoftDeletes;

    protected $fillable = [
        'requester_id',
        'approver_id',
        'issued_by',
        'handed_over_by',
        'picked_up_by',
        'department_id',
        'document_number',
        'transaction_date',
        'status',
        'approved_at',
        'issued_at',
        'handed_over_at',
        'picked_up_at',
        'is_special_request',
        'is_direct_request',
        'rejection_reason',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'transaction_date'  => 'date',
            'approved_at'       => 'datetime',
            'issued_at'         => 'datetime',
            'handed_over_at'    => 'datetime',
            'picked_up_at'      => 'datetime',
            'is_special_request'=> 'boolean',
            'is_direct_request' => 'boolean',
            'status'            => OutboundStatus::class,
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

    public function handedOverByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'handed_over_by');
    }

    public function pickedUpByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'picked_up_by');
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
        return $this->status === OutboundStatus::Pending;
    }

    public function isApproved(): bool
    {
        return $this->status === OutboundStatus::Approved;
    }

    public function isIssued(): bool
    {
        return $this->status === OutboundStatus::Issued;
    }

    public function isHandedOver(): bool
    {
        return $this->status === OutboundStatus::HandedOver;
    }

    public function isCompleted(): bool
    {
        return $this->status === OutboundStatus::Completed;
    }

    public function isRejected(): bool
    {
        return $this->status === OutboundStatus::Rejected;
    }
}
