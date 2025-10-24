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
        Schema::create('tokens_asistencia_qr', function (Blueprint $table) {
            $table->id();
            $table->foreignId('grupo_id')->constrained('grupos')->onDelete('cascade')->comment('Relación con grupos');
            $table->foreignId('docente_id')->constrained('docentes')->onDelete('restrict')->comment('Docente que generó el token');
            $table->string('token', 100)->unique()->comment('Token único para el código QR');
            $table->dateTime('fecha_hora_generacion')->comment('Fecha y hora de generación del token');
            $table->dateTime('fecha_hora_expiracion')->comment('Fecha y hora de expiración del token');
            $table->boolean('usado')->default(false)->comment('Indica si el token ya fue usado');
            $table->timestamps();

            // Índice para búsquedas por token
            $table->index('token');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tokens_asistencia_qr');
    }
};
