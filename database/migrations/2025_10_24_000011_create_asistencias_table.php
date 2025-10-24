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
        Schema::create('asistencias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('grupo_id')->constrained('grupos')->onDelete('cascade')->comment('Relación con grupos');
            $table->foreignId('docente_id')->constrained('docentes')->onDelete('restrict')->comment('Docente que registra la asistencia');
            $table->date('fecha')->comment('Fecha de la clase');
            $table->time('hora_registro')->comment('Hora en que se registró la asistencia');
            $table->enum('estado', ['Presente', 'Ausente', 'Tardanza', 'Justificado'])->default('Presente');
            $table->text('observaciones')->nullable();
            $table->string('metodo_registro', 50)->default('Manual')->comment('Manual, QR, Biométrico');
            $table->timestamps();

            // Índice para búsquedas frecuentes
            $table->index(['grupo_id', 'fecha']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asistencias');
    }
};
