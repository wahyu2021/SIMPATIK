<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tambah status 'Completed' dan kolom pickup ke outbound_transactions.
     * Alur baru: Pending → Approved → Issued (Siap Diambil) → Completed (Sudah Diambil).
     */
    public function up(): void
    {
        // 1. Tambah 'Completed' ke enum status
        DB::statement("ALTER TABLE outbound_transactions MODIFY COLUMN status ENUM('Pending', 'Approved', 'Issued', 'Rejected', 'Completed') DEFAULT 'Pending'");

        // 2. Tambah kolom pickup
        Schema::table('outbound_transactions', function (Blueprint $table) {
            $table->foreignId('picked_up_by')->nullable()->after('issued_by')->constrained('users')->nullOnDelete();
            $table->timestamp('picked_up_at')->nullable()->after('issued_at');
        });

        // 3. Migrasi data: semua yang sudah 'Issued' (lama) → 'Completed' karena sudah selesai
        DB::table('outbound_transactions')
            ->where('status', 'Issued')
            ->update([
                'status'       => 'Completed',
                'picked_up_at' => DB::raw('issued_at'),
                'picked_up_by' => DB::raw('requester_id'),
            ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Kembalikan data 'Completed' → 'Issued'
        DB::table('outbound_transactions')
            ->where('status', 'Completed')
            ->update(['status' => 'Issued']);

        Schema::table('outbound_transactions', function (Blueprint $table) {
            $table->dropForeign(['picked_up_by']);
            $table->dropColumn(['picked_up_by', 'picked_up_at']);
        });

        DB::statement("ALTER TABLE outbound_transactions MODIFY COLUMN status ENUM('Pending', 'Approved', 'Issued', 'Rejected') DEFAULT 'Pending'");
    }
};
