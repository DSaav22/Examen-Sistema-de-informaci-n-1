<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Docente;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class DocenteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener el rol de docente (ID = 3)
        $rolDocente = Role::where('nombre', 'docente')->first();

        // Crear 3 docentes de prueba adicionales
        $docentes = [
            [
                'name' => 'Dr. Juan Pérez',
                'email' => 'juan.perez@docente.com',
                'ci' => '5678901',
                'telefono' => '70123456',
                'codigo_docente' => 'DOC001',
                'especialidad' => 'Bases de Datos',
                'grado_academico' => 'Doctorado',
                'tipo_contrato' => 'Tiempo Completo',
            ],
            [
                'name' => 'Dra. María García',
                'email' => 'maria.garcia@docente.com',
                'ci' => '6789012',
                'telefono' => '71234567',
                'codigo_docente' => 'DOC002',
                'especialidad' => 'Programación',
                'grado_academico' => 'Doctorado',
                'tipo_contrato' => 'Tiempo Completo',
            ],
            [
                'name' => 'Ing. Carlos López',
                'email' => 'carlos.lopez@docente.com',
                'ci' => '7890123',
                'telefono' => '72345678',
                'codigo_docente' => 'DOC003',
                'especialidad' => 'Redes y Telecomunicaciones',
                'grado_academico' => 'Maestría',
                'tipo_contrato' => 'Medio Tiempo',
            ],
        ];

        foreach ($docentes as $docenteData) {
            // Crear el usuario
            $usuario = User::create([
                'name' => $docenteData['name'],
                'email' => $docenteData['email'],
                'password' => Hash::make('password'),
                'rol_id' => $rolDocente->id,
                'ci' => $docenteData['ci'],
                'telefono' => $docenteData['telefono'],
                'activo' => true,
                'email_verified_at' => now(),
            ]);

            // Crear el docente asociado al usuario
            Docente::create([
                'usuario_id' => $usuario->id,
                'codigo_docente' => $docenteData['codigo_docente'],
                'especialidad' => $docenteData['especialidad'],
                'grado_academico' => $docenteData['grado_academico'],
                'fecha_contratacion' => now()->subYears(rand(1, 10)),
                'tipo_contrato' => $docenteData['tipo_contrato'],
                'activo' => true,
            ]);
        }
    }
}
