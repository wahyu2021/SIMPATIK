<?php

namespace App\Models;

use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements FilamentUser
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, HasRoles, Notifiable, SoftDeletes;

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

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    public function canAccessPanel(Panel $panel): bool
    {
        return $this->is_active;
    }
    
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
}
