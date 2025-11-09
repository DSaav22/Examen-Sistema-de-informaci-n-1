<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Añadir columnas para gestión de cupos e inscripciones:
     * - cupos_ofrecidos: Cupos totales que la universidad ofrece para este grupo
     * - inscritos: Número de estudiantes actualmente inscritos
     * - estado: Estado del grupo (Abierto, Cerrado, En Curso, Finalizado)
     */
    public function up(): void
    {
        Schema::table('grupos', function (Blueprint $table) {
            $table->integer('cupos_ofrecidos')
                ->default(30)
                ->after('cupo_maximo')
                ->comment('Cupos totales ofrecidos por la universidad para este grupo');
            
            $table->integer('inscritos')
                ->default(0)
                ->after('cupos_ofrecidos')
                ->comment('Número de estudiantes inscritos actualmente');
            
            $table->enum('estado', ['Abierto', 'Cerrado', 'En Curso', 'Finalizado'])
                ->default('Abierto')
                ->after('inscritos')
                ->comment('Estado actual del grupo');
        });
    }

    /**
     * Reverse the migrations.
     * 
     * Eliminar las columnas agregadas
     */
    public function down(): void
    {
        Schema::table('grupos', function (Blueprint $table) {
            $table->dropColumn(['cupos_ofrecidos', 'inscritos', 'estado']);
        });
    }
};
