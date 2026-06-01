<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE outbound_transactions MODIFY COLUMN status ENUM('Pending', 'Approved', 'Issued', 'Handed Over', 'Rejected', 'Completed') DEFAULT 'Pending'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE outbound_transactions MODIFY COLUMN status ENUM('Pending', 'Approved', 'Issued', 'Rejected', 'Completed') DEFAULT 'Pending'");
    }
};
