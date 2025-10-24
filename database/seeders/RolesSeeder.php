<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'nombre' => 'administrador',
                'descripcion' => 'Acceso completo al sistema. Puede gestionar usuarios, roles, configuraciones, materias, aulas, docentes, horarios y todas las funcionalidades del sistema.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'coordinador',
                'descripcion' => 'Puede gestionar horarios, asignar docentes a materias, gestionar grupos, aulas y generar reportes. No puede gestionar usuarios ni configuraciones del sistema.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'docente',
                'descripcion' => 'Puede ver sus horarios asignados, registrar asistencia de sus clases, generar códigos QR para asistencia y consultar información de sus grupos.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('roles')->insert($roles);
    }
}
