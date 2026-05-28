<?php

namespace App\Models;

use App\Traits\HasSignature;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, HasRoles, HasSignature, Notifiable, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
        'signature_path',
        'is_active',
        'department_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $appends = ['signature_url'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    /**
     * URL publik tanda tangan user (null jika belum ada).
     */
    public function getSignatureUrlAttribute(): ?string
    {
        return $this->getSignatureUrl();
    }

    /**
     * Check if user is active
     */
    public function isActive(): bool
    {
        return $this->is_active;
    }

    /**
     * Check if user needs to complete signature onboarding
     */
    public function needsSignatureOnboarding(): bool
    {
        return !$this->hasSignature();
    }

    /**
     * Get user's role name
     */
    public function getRoleName(): ?string
    {
        return $this->roles->first()?->name;
    }
    
    /**
     * Relationships
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function inboundTransactions(): HasMany
    {
        return $this->hasMany(InboundTransaction::class);
    }

    public function outboundRequestsAsRequester(): HasMany
    {
        return $this->hasMany(OutboundTransaction::class, 'requester_id');
    }

    public function outboundRequestsAsApprover(): HasMany
    {
        return $this->hasMany(OutboundTransaction::class, 'approver_id');
    }

    public function outboundRequestsAsIssuer(): HasMany
    {
        return $this->hasMany(OutboundTransaction::class, 'issued_by');
    }
}

