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
            ],
            [
                'nombre' => 'coordinador',
                'descripcion' => 'Puede gestionar horarios, asignar docentes a materias, gestionar grupos, aulas y generar reportes. No puede gestionar usuarios ni configuraciones del sistema.',
            ],
            [
                'nombre' => 'docente',
                'descripcion' => 'Puede ver sus horarios asignados, registrar asistencia de sus clases, generar códigos QR para asistencia y consultar información de sus grupos.',
            ],
        ];

        foreach ($roles as $roleData) {
            DB::table('roles')->updateOrInsert(
                ['nombre' => $roleData['nombre']], // Condición de búsqueda
                [
                    'descripcion' => $roleData['descripcion'],
                    'updated_at' => now(),
                    'created_at' => DB::raw('COALESCE(created_at, NOW())') // Mantiene created_at si ya existe
                ]
            );
        }
    }
}
