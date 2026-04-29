<?php

namespace App\Traits;

trait HasAuditLog
{
    /**
     * Boot the trait
     */
    protected static function bootHasAuditLog(): void
    {
        static::creating(function ($model) {
            $model->created_by = auth()->id();
            $model->created_ip = request()->ip();
        });

        static::updating(function ($model) {
            $model->updated_by = auth()->id();
            $model->updated_ip = request()->ip();
        });
    }

    /**
     * Get creator user
     */
    public function creator()
    {
        return $this->belongsTo(\App\Models\User::class, 'created_by');
    }

    /**
     * Get updater user
     */
    public function updater()
    {
        return $this->belongsTo(\App\Models\User::class, 'updated_by');
    }

    /**
     * Get audit trail text
     */
    public function getAuditTrail(): string
    {
        $creator = $this->creator?->name ?? 'System';
        $createdAt = $this->created_at->format('d/m/Y H:i');
        
        return "Dibuat oleh {$creator} pada {$createdAt} dari IP {$this->created_ip}";
    }
}
