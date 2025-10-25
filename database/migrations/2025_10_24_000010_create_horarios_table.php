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
        $driver = DB::getDriverName();

        if ($driver === 'pgsql') {
            // Primero, habilitamos la extensión btree_gist si no está habilitada (solo PostgreSQL)
            DB::statement('CREATE EXTENSION IF NOT EXISTS btree_gist');
        }

        Schema::create('horarios', function (Blueprint $table) use ($driver) {
            $table->id();
            $table->foreignId('grupo_id')->constrained('grupos')->onDelete('cascade')->comment('Relación con grupos');
            $table->foreignId('aula_id')->constrained('aulas')->onDelete('restrict')->comment('Relación con aulas');
            $table->enum('dia_semana', ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'])->comment('Día de la semana');
            $table->time('hora_inicio')->comment('Hora de inicio de la clase');
            $table->time('hora_fin')->comment('Hora de fin de la clase');
            $table->timestamps();
            
            // Índice único para SQLite (previene conflictos básicos)
            if ($driver === 'sqlite') {
                $table->unique(['aula_id', 'dia_semana', 'hora_inicio', 'hora_fin'], 'unique_horario_aula');
            }
        });

        // Restricciones avanzadas solo para PostgreSQL
        if ($driver === 'pgsql') {
            // Crear función IMMUTABLE para convertir TIME a intervalo
            DB::statement("
                CREATE OR REPLACE FUNCTION time_to_interval(t TIME)
                RETURNS INTERVAL AS \$\$
                BEGIN
                    RETURN t - TIME '00:00:00';
                END;
                \$\$ LANGUAGE plpgsql IMMUTABLE;
            ");

            // Restricción de exclusión para evitar conflictos de horarios en la misma aula
            // Esta es la restricción MÁS CRÍTICA del sistema
            DB::statement("
                ALTER TABLE horarios 
                ADD CONSTRAINT horarios_no_overlap_aula 
                EXCLUDE USING GIST (
                    aula_id WITH =,
                    dia_semana WITH =,
                    tsrange(
                        ('2000-01-01'::date + time_to_interval(hora_inicio))::timestamp,
                        ('2000-01-01'::date + time_to_interval(hora_fin))::timestamp
                    ) WITH &&
                )
            ");

            // NOTA: La restricción de docente se maneja mediante validación en el backend
            // ya que PostgreSQL no permite funciones que consultan otras tablas en índices GIST
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $driver = DB::getDriverName();
        
        if ($driver === 'pgsql') {
            // Eliminamos las restricciones y funciones
            DB::statement('ALTER TABLE horarios DROP CONSTRAINT IF EXISTS horarios_no_overlap_aula');
            DB::statement('DROP FUNCTION IF EXISTS time_to_interval(TIME)');
        }
        
        Schema::dropIfExists('horarios');
    }
};
