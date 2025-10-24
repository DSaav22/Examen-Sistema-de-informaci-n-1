<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Primero, habilitamos la extensión btree_gist si no está habilitada
        DB::statement('CREATE EXTENSION IF NOT EXISTS btree_gist');

        Schema::create('horarios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('grupo_id')->constrained('grupos')->onDelete('cascade')->comment('Relación con grupos');
            $table->foreignId('aula_id')->constrained('aulas')->onDelete('restrict')->comment('Relación con aulas');
            $table->enum('dia_semana', ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'])->comment('Día de la semana');
            $table->time('hora_inicio')->comment('Hora de inicio de la clase');
            $table->time('hora_fin')->comment('Hora de fin de la clase');
            $table->timestamps();
        });

        // Restricción de exclusión para evitar conflictos de horarios en la misma aula
        // No permite que dos horarios se solapen en el mismo aula, día y rango de horas
        DB::statement('
            ALTER TABLE horarios 
            ADD CONSTRAINT horarios_no_overlap_aula 
            EXCLUDE USING GIST (
                aula_id WITH =,
                dia_semana WITH =,
                tsrange(
                    (CURRENT_DATE + hora_inicio)::timestamp,
                    (CURRENT_DATE + hora_fin)::timestamp
                ) WITH &&
            )
        ');

        // Restricción de exclusión para evitar que un docente tenga dos clases al mismo tiempo
        // Esta restricción se implementa a través de la relación grupo_id (que tiene docente_id)
        DB::statement('
            CREATE OR REPLACE FUNCTION get_docente_from_grupo(grupo_id_param INTEGER)
            RETURNS INTEGER AS $$
            BEGIN
                RETURN (SELECT docente_id FROM grupos WHERE id = grupo_id_param);
            END;
            $$ LANGUAGE plpgsql IMMUTABLE;
        ');

        DB::statement('
            ALTER TABLE horarios 
            ADD CONSTRAINT horarios_no_overlap_docente 
            EXCLUDE USING GIST (
                get_docente_from_grupo(grupo_id) WITH =,
                dia_semana WITH =,
                tsrange(
                    (CURRENT_DATE + hora_inicio)::timestamp,
                    (CURRENT_DATE + hora_fin)::timestamp
                ) WITH &&
            )
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Primero eliminamos las restricciones
        DB::statement('ALTER TABLE horarios DROP CONSTRAINT IF EXISTS horarios_no_overlap_docente');
        DB::statement('ALTER TABLE horarios DROP CONSTRAINT IF EXISTS horarios_no_overlap_aula');
        DB::statement('DROP FUNCTION IF EXISTS get_docente_from_grupo(INTEGER)');
        
        Schema::dropIfExists('horarios');
    }
};
