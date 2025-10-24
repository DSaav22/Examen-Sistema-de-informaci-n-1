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
        Schema::create('notificaciones_log', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->constrained('users')->onDelete('cascade')->comment('Usuario destinatario de la notificación');
            $table->string('tipo', 50)->comment('Tipo de notificación: cambio_horario, asistencia, aviso_general');
            $table->string('titulo', 150)->comment('Título de la notificación');
            $table->text('mensaje')->comment('Contenido de la notificación');
            $table->boolean('leida')->default(false)->comment('Indica si la notificación fue leída');
            $table->dateTime('fecha_envio')->comment('Fecha y hora de envío');
            $table->dateTime('fecha_lectura')->nullable()->comment('Fecha y hora de lectura');
            $table->timestamps();

            // Índice para búsquedas por usuario y estado
            $table->index(['usuario_id', 'leida']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notificaciones_log');
    }
};
