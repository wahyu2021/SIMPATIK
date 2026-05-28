<?php

namespace App\Policies;

use App\Models\OutboundTransaction;
use App\Models\User;

/**
 * Aturan otorisasi terpusat untuk modul Pengajuan Barang (Outbound).
 *
 * Setiap method merepresentasikan 1 aksi di controller.
 * Controller cukup memanggil $this->authorize('namaAksi', $outbound).
 */
class OutboundPolicy
{
    /**
     * Semua authenticated user boleh melihat daftar pengajuan.
     * Filter data (milik sendiri vs semua) ditangani di service layer.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Semua authenticated user boleh melihat detail pengajuan.
     * Staff hanya bisa lihat miliknya — tapi itu difilter di query, bukan di policy.
     */
    public function view(User $user, OutboundTransaction $outbound): bool
    {
        return true;
    }

    /**
     * Hanya staff dan warehouse admin yang boleh membuat pengajuan baru.
     */
    public function create(User $user): bool
    {
        return $user->hasRole(['staff', 'warehouse_admin']);
    }

    /**
     * Penyelia unit kerja yang sama boleh menyetujui pengajuan berstatus Pending.
     */
    public function approve(User $user, OutboundTransaction $outbound): bool
    {
        return $user->hasRole('division_head')
            && $outbound->department_id === $user->department_id
            && $outbound->isPending();
    }

    /**
     * Penyelia unit kerja yang sama boleh menolak pengajuan berstatus Pending.
     */
    public function reject(User $user, OutboundTransaction $outbound): bool
    {
        return $this->approve($user, $outbound);
    }

    /**
     * Hanya warehouse admin yang boleh mengeluarkan barang (Approved → Issued).
     */
    public function issue(User $user, OutboundTransaction $outbound): bool
    {
        return $user->hasRole('warehouse_admin')
            && $outbound->isApproved();
    }

    /**
     * Admin Gudang serahkan barang ke pemohon (Issued → Handed Over).
     */
    public function handover(User $user, OutboundTransaction $outbound): bool
    {
        return $user->hasRole('warehouse_admin')
            && $outbound->isIssued();
    }

    /**
     * Pemohon konfirmasi penerimaan barang (Handed Over → Completed).
     */
    public function pickup(User $user, OutboundTransaction $outbound): bool
    {
        return $outbound->requester_id === $user->id
            && $outbound->isHandedOver();
    }

    /**
     * Hanya pemilik pengajuan yang boleh membatalkan, dan hanya saat masih Pending.
     */
    public function delete(User $user, OutboundTransaction $outbound): bool
    {
        return $outbound->requester_id === $user->id
            && $outbound->isPending();
    }

    /**
     * Hanya pemilik pengajuan yang boleh mengedit, dan hanya saat masih Pending.
     */
    public function update(User $user, OutboundTransaction $outbound): bool
    {
        return $outbound->requester_id === $user->id
            && $outbound->isPending();
    }
}
