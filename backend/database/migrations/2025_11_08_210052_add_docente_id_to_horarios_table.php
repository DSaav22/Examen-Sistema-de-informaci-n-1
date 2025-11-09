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
        if (!Schema::hasColumn('horarios', 'docente_id')) {
            Schema::table('horarios', function (Blueprint $table) {
                // Añade la columna 'docente_id'
                $table->foreignId('docente_id')
                      ->nullable() // Permite nulos
                      ->constrained('docentes') // Enlace a la tabla 'docentes'
                      ->nullOnDelete(); // Si se borra el docente, pone esto en NULL
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('horarios', 'docente_id')) {
            Schema::table('horarios', function (Blueprint $table) {
                $table->dropForeign(['docente_id']);
                $table->dropColumn('docente_id');
            });
        }
    }
};
