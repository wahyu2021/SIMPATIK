<?php

namespace App\Models;

use App\Traits\HasAuditLog;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Eloquent Model: Category
 *
 * [Representasi Tabel & Relasi]
 * - Mendefinisikan struktur relasional entitas di database.
 * - Memuat properti fillable untuk mencegah Mass Assignment Vulnerability.
 * - Method-method di dalamnya mendeskripsikan kardinalitas relasi (HasMany, BelongsTo, dll).
 */
class Category extends Model
{
    use HasFactory, HasAuditLog, SoftDeletes;

    protected $fillable = ['name'];

    public function items(): HasMany
    {
        return $this->hasMany(Item::class);
    }
}
