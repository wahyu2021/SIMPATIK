<?php

namespace App\Traits;

use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

/**
 * Trait HasAuditLog
 * Otomatis mencatat aktivitas CRUD ke tabel activity_logs.
 */
trait HasAuditLog
{
    protected static function bootHasAuditLog(): void
    {
        static::created(function (Model $model) {
            static::logActivity($model, 'created', 'Dibuat');
        });

        static::updated(function (Model $model) {
            $changes = $model->getChanges();
            // Hapus updated_at dari tracking perubahan
            unset($changes['updated_at']);

            if (empty($changes)) return;

            $properties = [
                'old' => array_intersect_key($model->getOriginal(), $changes),
                'new' => $changes,
            ];

            static::logActivity($model, 'updated', 'Diperbarui', $properties);
        });

        static::deleted(function (Model $model) {
            static::logActivity($model, 'deleted', 'Dihapus');
        });
    }

    /**
     * Simpan log ke database.
     */
    protected static function logActivity(Model $model, string $description, string $label, array $properties = []): void
    {
        ActivityLog::create([
            'user_id'      => Auth::id(),
            'log_name'     => $model->getTable(),
            'description'  => $label,
            'subject_type' => get_class($model),
            'subject_id'   => $model->getKey(),
            'properties'   => !empty($properties) ? $properties : null,
            'ip_address'   => Request::ip(),
            'user_agent'   => Request::userAgent(),
        ]);
    }
}
