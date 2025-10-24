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
        Schema::create('pwa_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->constrained('users')->onDelete('cascade')->comment('Usuario suscrito a notificaciones PWA');
            $table->text('endpoint')->comment('Endpoint de la suscripción push');
            $table->text('public_key')->nullable()->comment('Clave pública para encriptación');
            $table->text('auth_token')->nullable()->comment('Token de autenticación');
            $table->string('user_agent')->nullable()->comment('Información del navegador');
            $table->timestamps();

            // Índice para búsquedas por usuario
            $table->index('usuario_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pwa_subscriptions');
    }
};
