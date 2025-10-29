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
            'sigla' => 'SIS-123',
            'nombre' => 'Sistemas de Información I',
            'carrera_id' => $ingSistemas->id,
            'nivel' => 3,
            'creditos' => 4,
            'horas_semanales' => 6,
            'descripcion' => 'Introducción a los sistemas de información empresariales',
        ]);

        Materia::create([
            'sigla' => 'INF-110',
            'nombre' => 'Programación I',
            'carrera_id' => $ingInformatica->id,
            'nivel' => 1,
            'creditos' => 5,
            'horas_semanales' => 8,
            'descripcion' => 'Fundamentos de programación estructurada',
        ]);

        Materia::create([
            'sigla' => 'RED-210',
            'nombre' => 'Redes I',
            'carrera_id' => $ingRedes->id,
            'nivel' => 4,
            'creditos' => 4,
            'horas_semanales' => 6,
            'descripcion' => 'Introducción a las redes de computadoras',
        ]);

        Materia::create([
            'sigla' => 'SIS-210',
            'nombre' => 'Base de Datos I',
            'carrera_id' => $ingSistemas->id,
            'nivel' => 4,
            'creditos' => 5,
            'horas_semanales' => 8,
            'descripcion' => 'Fundamentos de bases de datos relacionales',
        ]);

        Materia::create([
            'sigla' => 'INF-220',
            'nombre' => 'Estructura de Datos',
            'carrera_id' => $ingInformatica->id,
            'nivel' => 4,
            'creditos' => 4,
            'horas_semanales' => 6,
            'descripcion' => 'Estudio de estructuras de datos y algoritmos',
        ]);
    }
}
