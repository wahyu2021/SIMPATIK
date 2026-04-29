<?php

namespace App\Repositories\Contracts;

use App\Models\OutboundTransaction;
use Illuminate\Pagination\LengthAwarePaginator;

interface OutboundRepositoryInterface
{
    /**
     * Ambil pengajuan barang dengan pagination + filter (search, status, department, tanggal)
     */
    public function paginate(int $perPage = 15, array $filters = []): LengthAwarePaginator;

    /**
     * Cari pengajuan berdasarkan ID (include relasi lengkap)
     */
    public function findById(int $id): ?OutboundTransaction;

    /**
     * Buat pengajuan baru
     */
    public function create(array $data): OutboundTransaction;

    /**
     * Update pengajuan
     */
    public function update(OutboundTransaction $outbound, array $data): bool;

    /**
     * Hapus pengajuan
     */
    public function delete(OutboundTransaction $outbound): bool;

    /**
     * Generate nomor dokumen otomatis (OUT-YYYYMM-XXXX)
     */
    public function generateDocumentNumber(): string;
}
