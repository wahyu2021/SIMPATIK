<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('outbound_transactions', function (Blueprint $table) {
            $table->unsignedBigInteger('handed_over_by')->nullable()->after('issued_at');
            $table->timestamp('handed_over_at')->nullable()->after('handed_over_by');

            $table->foreign('handed_over_by')->references('id')->on('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('outbound_transactions', function (Blueprint $table) {
            $table->dropForeign(['handed_over_by']);
            $table->dropColumn(['handed_over_by', 'handed_over_at']);
        });
    }
};
