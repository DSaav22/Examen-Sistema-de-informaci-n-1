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
        Schema::table('materias', function (Blueprint $table) {
            // Verificar si existe la foreign key antes de intentar eliminarla
            if (Schema::hasColumn('materias', 'carrera_id')) {
                try {
                    $table->dropForeign(['carrera_id']); // Intenta eliminar FK si existe
                } catch (\Exception $e) {
                    // Ignorar si no existe la FK
                }
                $table->dropColumn('carrera_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No hacer nada - no queremos recrear carrera_id
        // La relación N:M es la correcta
    }
};
