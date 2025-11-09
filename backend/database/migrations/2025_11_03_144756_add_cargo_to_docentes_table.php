<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Añadir columna cargo a la tabla docentes
     * Ejemplos: Profesor Titular, Profesor Asociado, Profesor Auxiliar, Jefe de Cátedra, etc.
     */
    public function up(): void
    {
        Schema::table('docentes', function (Blueprint $table) {
            $table->string('cargo', 100)
                ->nullable()
                ->after('especialidad')
                ->comment('Cargo del docente (Ej: Profesor Titular, Profesor Asociado, etc.)');
        });
    }

    /**
     * Reverse the migrations.
     * 
     * Eliminar la columna cargo
     */
    public function down(): void
    {
        Schema::table('docentes', function (Blueprint $table) {
            $table->dropColumn('cargo');
        });
    }
};
