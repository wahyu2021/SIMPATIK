<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('items', function (Blueprint $table) {
            $table->index('name');
        });

        Schema::table('outbound_transactions', function (Blueprint $table) {
            $table->index('status');
            $table->index('transaction_date');
        });

        Schema::table('inbound_transactions', function (Blueprint $table) {
            $table->index('transaction_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('items', function (Blueprint $table) {
            $table->dropIndex(['name']);
        });

        Schema::table('outbound_transactions', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['transaction_date']);
        });

        Schema::table('inbound_transactions', function (Blueprint $table) {
            $table->dropIndex(['transaction_date']);
        });
    }
};
