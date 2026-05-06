<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stock_reconciliation_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reconciliation_id')->constrained('stock_reconciliations')->cascadeOnDelete();
            $table->foreignId('item_id')->constrained()->cascadeOnDelete();
            $table->integer('system_qty');     // Saldo sistem
            $table->integer('physical_qty');   // Stok fisik aktual
            $table->integer('difference');     // physical - system
            $table->string('notes', 255)->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_reconciliation_details');
    }
};
