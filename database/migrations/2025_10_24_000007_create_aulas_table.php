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
        Schema::create('aulas', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 100)->unique()->comment('Nombre o número del aula');
            $table->string('edificio', 100)->comment('Edificio donde se encuentra el aula');
            $table->integer('capacidad')->comment('Capacidad máxima de estudiantes');
            $table->enum('tipo', ['Aula Normal', 'Laboratorio', 'Auditorio', 'Taller'])->default('Aula Normal');
            $table->text('recursos')->nullable()->comment('Recursos disponibles: proyector, pizarra digital, etc.');
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('aulas');
    }
};
