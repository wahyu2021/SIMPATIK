<?php

namespace App\Enums;

/**
 * Enum untuk status pengajuan barang keluar (Outbound Transaction).
 * Digunakan di Model, Repository, dan Service agar konsisten.
 */
enum OutboundStatus: string
{
    case Pending  = 'Pending';
    case Approved = 'Approved';
    case Issued   = 'Issued';
    case Rejected = 'Rejected';

    /**
     * Label bahasa Indonesia untuk tampilan frontend.
     */
    public function label(): string
    {
        return match ($this) {
            self::Pending  => 'Menunggu',
            self::Approved => 'Disetujui',
            self::Issued   => 'Diserahkan',
            self::Rejected => 'Ditolak',
        };
    }
}
