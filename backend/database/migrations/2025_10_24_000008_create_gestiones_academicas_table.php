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
        Schema::create('gestiones_academicas', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 50)->unique()->comment('Ejemplo: 2025-I, 2025-II');
            $table->integer('anio')->comment('Año de la gestión académica');
            $table->enum('periodo', ['I', 'II'])->comment('Periodo: I (primer semestre) o II (segundo semestre)');
            $table->date('fecha_inicio')->comment('Fecha de inicio del periodo');
            $table->date('fecha_fin')->comment('Fecha de fin del periodo');
            $table->boolean('activo')->default(false)->comment('Solo una gestión puede estar activa a la vez');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gestiones_academicas');
    }
};
