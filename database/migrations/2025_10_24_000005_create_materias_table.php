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
        Schema::create('materias', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 150)->comment('Nombre de la materia');
            $table->string('codigo', 20)->unique()->comment('Código único de la materia');
            $table->foreignId('carrera_id')->constrained('carreras')->onDelete('restrict')->comment('Relación con carreras');
            $table->integer('nivel')->comment('Nivel o semestre: 1, 2, 3...');
            $table->integer('creditos')->default(4)->comment('Créditos académicos');
            $table->integer('horas_semanales')->default(4)->comment('Horas de clase por semana');
            $table->text('descripcion')->nullable();
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('materias');
    }
};
