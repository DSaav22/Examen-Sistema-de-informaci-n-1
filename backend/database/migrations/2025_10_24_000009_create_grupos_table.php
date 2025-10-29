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
        Schema::create('grupos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('materia_id')->constrained('materias')->onDelete('restrict')->comment('Relación con materias');
            $table->foreignId('docente_id')->constrained('docentes')->onDelete('restrict')->comment('Relación con docentes');
            $table->foreignId('gestion_academica_id')->constrained('gestiones_academicas')->onDelete('restrict')->comment('Relación con gestiones_academicas');
            $table->string('nombre_grupo', 50)->comment('Ejemplo: A, B, 01, 02');
            $table->integer('cupo_maximo')->default(30)->comment('Cupo máximo de estudiantes');
            $table->integer('cupo_actual')->default(0)->comment('Estudiantes inscritos actualmente');
            $table->boolean('activo')->default(true);
            $table->timestamps();

            // Restricción de unicidad: un docente no puede tener dos grupos con el mismo nombre en la misma materia y gestión
            $table->unique(['materia_id', 'nombre_grupo', 'gestion_academica_id'], 'unique_grupo_materia_gestion');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grupos');
    }
};
