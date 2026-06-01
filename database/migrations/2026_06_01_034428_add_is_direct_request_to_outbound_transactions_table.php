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
        Schema::table('outbound_transactions', function (Blueprint $column) {
            $column->boolean('is_direct_request')->default(false)->after('is_special_request');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('outbound_transactions', function (Blueprint $column) {
            $column->dropColumn('is_direct_request');
        });
    }
};
