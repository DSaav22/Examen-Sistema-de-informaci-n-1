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
            $table->foreignId('horario_id')->constrained('horarios')->onDelete('cascade')->comment('Horario específico de la clase');
            $table->date('fecha')->comment('Fecha de la clase');
            $table->time('hora_registro')->comment('Hora en que se registró la asistencia');
            $table->enum('estado', ['presente', 'ausente', 'tardanza', 'justificado'])->default('presente');
            $table->text('observaciones')->nullable();
            $table->string('metodo_registro', 50)->default('digital')->comment('digital, manual, qr, biometrico');
            $table->timestamps();

            // Índice para búsquedas frecuentes
            $table->index(['horario_id', 'fecha']);
            
            // Restricción: una sola asistencia por horario por día
            $table->unique(['horario_id', 'fecha']);
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
