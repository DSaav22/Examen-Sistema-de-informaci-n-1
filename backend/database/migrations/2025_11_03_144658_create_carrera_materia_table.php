<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Crear tabla pivote para relación Muchos a Muchos entre Carreras y Materias
     * Una materia puede pertenecer a múltiples carreras (ej: Cálculo I en Ingeniería Civil e Ingeniería de Sistemas)
     * Una carrera tiene múltiples materias
     */
    public function up(): void
    {
        Schema::create('carrera_materia', function (Blueprint $table) {
            $table->id();
            $table->foreignId('carrera_id')
                ->constrained('carreras')
                ->onDelete('cascade')
                ->comment('Relación con carreras');
            $table->foreignId('materia_id')
                ->constrained('materias')
                ->onDelete('cascade')
                ->comment('Relación con materias');
            $table->integer('semestre_sugerido')
                ->nullable()
                ->comment('Semestre recomendado para cursar la materia en esta carrera');
            $table->boolean('obligatoria')
                ->default(true)
                ->comment('Si la materia es obligatoria u optativa para esta carrera');
            $table->timestamps();

            // Restricción de unicidad: una materia no puede estar asociada dos veces a la misma carrera
            $table->unique(['carrera_id', 'materia_id'], 'unique_carrera_materia');
            
            // Índices para mejorar búsquedas
            $table->index('carrera_id');
            $table->index('materia_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('carrera_materia');
    }
};
