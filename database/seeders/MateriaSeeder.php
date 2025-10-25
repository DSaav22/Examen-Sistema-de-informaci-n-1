<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Materia;
use App\Models\Carrera;

class MateriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener las carreras
        $ingInformatica = Carrera::where('nombre', 'Ingeniería Informática')->first();
        $ingSistemas = Carrera::where('nombre', 'Ingeniería de Sistemas')->first();
        $ingRedes = Carrera::where('nombre', 'Ingeniería en Redes y Telecomunicaciones')->first();

        // Crear las materias
        Materia::create([
            'nombre' => 'Sistemas de Información I',
            'codigo' => 'SIS123',
            'carrera_id' => $ingSistemas->id,
            'nivel' => 3,
            'creditos' => 4,
            'horas_semanales' => 6,
            'descripcion' => 'Introducción a los sistemas de información empresariales',
        ]);

        Materia::create([
            'nombre' => 'Programación I',
            'codigo' => 'INF110',
            'carrera_id' => $ingInformatica->id,
            'nivel' => 1,
            'creditos' => 5,
            'horas_semanales' => 8,
            'descripcion' => 'Fundamentos de programación estructurada',
        ]);

        Materia::create([
            'nombre' => 'Redes I',
            'codigo' => 'RED210',
            'carrera_id' => $ingRedes->id,
            'nivel' => 4,
            'creditos' => 4,
            'horas_semanales' => 6,
            'descripcion' => 'Introducción a las redes de computadoras',
        ]);

        Materia::create([
            'nombre' => 'Base de Datos I',
            'codigo' => 'SIS210',
            'carrera_id' => $ingSistemas->id,
            'nivel' => 4,
            'creditos' => 5,
            'horas_semanales' => 8,
            'descripcion' => 'Fundamentos de bases de datos relacionales',
        ]);

        Materia::create([
            'nombre' => 'Estructura de Datos',
            'codigo' => 'INF220',
            'carrera_id' => $ingInformatica->id,
            'nivel' => 4,
            'creditos' => 4,
            'horas_semanales' => 6,
            'descripcion' => 'Estudio de estructuras de datos y algoritmos',
        ]);
    }
}
