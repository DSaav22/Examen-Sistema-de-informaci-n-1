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
        Schema::create('carreras', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 150)->comment('Nombre de la carrera');
            $table->string('codigo', 20)->unique()->comment('Código identificador de la carrera');
            $table->foreignId('facultad_id')->constrained('facultades')->onDelete('restrict')->comment('Relación con facultades');
            $table->integer('duracion_semestres')->default(10)->comment('Duración en semestres');
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
        Schema::dropIfExists('carreras');
    }
};
