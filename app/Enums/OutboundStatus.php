<?php

namespace App\Enums;

/**
 * Enum untuk status pengajuan barang keluar (Outbound Transaction).
 * Digunakan di Model, Repository, dan Service agar konsisten.
 *
 * Alur: Pending → Approved → Issued (Stok Dikurangi) → Handed Over (Admin Serahkan) → Completed (Pemohon Terima)
 *       Pending → Rejected (Ditolak)
 */
enum OutboundStatus: string
{
    case Pending    = 'Pending';
    case Approved   = 'Approved';
    case Issued     = 'Issued';
    case HandedOver = 'Handed Over';
    case Rejected   = 'Rejected';
    case Completed  = 'Completed';

    /**
     * Label bahasa Indonesia untuk tampilan frontend.
     */
    public function label(): string
    {
        return match ($this) {
            self::Pending    => 'Menunggu',
            self::Approved   => 'Disetujui Penyelia',
            self::Issued     => 'Disetujui Gudang',
            self::HandedOver => 'Diserahkan',
            self::Rejected   => 'Ditolak',
            self::Completed  => 'Selesai',
        };
    }
}
