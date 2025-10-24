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
        Schema::create('docentes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->constrained('users')->onDelete('restrict')->comment('Relación con la tabla users');
            $table->string('codigo_docente', 20)->unique()->comment('Código único del docente');
            $table->string('especialidad', 100)->nullable()->comment('Especialidad del docente');
            $table->enum('grado_academico', ['Licenciatura', 'Maestría', 'Doctorado'])->default('Licenciatura');
            $table->date('fecha_contratacion')->nullable();
            $table->enum('tipo_contrato', ['Tiempo Completo', 'Medio Tiempo', 'Por Horas'])->default('Tiempo Completo');
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('docentes');
    }
};
