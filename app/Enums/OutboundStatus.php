<?php

namespace App\Enums;

/**
 * Enum untuk status pengajuan barang keluar (Outbound Transaction).
 * Digunakan di Model, Repository, dan Service agar konsisten.
 *
 * Alur: Pending → Approved → Issued (Siap Diambil) → Completed (Sudah Diambil)
 *       Pending → Rejected (Ditolak)
 */
enum OutboundStatus: string
{
    case Pending   = 'Pending';
    case Approved  = 'Approved';
    case Issued    = 'Issued';
    case Rejected  = 'Rejected';
    case Completed = 'Completed';

    /**
     * Label bahasa Indonesia untuk tampilan frontend.
     */
    public function label(): string
    {
        return match ($this) {
            self::Pending   => 'Menunggu',
            self::Approved  => 'Disetujui',
            self::Issued    => 'Siap Diambil',
            self::Rejected  => 'Ditolak',
            self::Completed => 'Selesai',
        };
    }
}
