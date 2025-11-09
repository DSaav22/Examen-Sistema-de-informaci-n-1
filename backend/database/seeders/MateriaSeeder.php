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

        // Crear Sistemas de Información I (puede ser compartida por varias carreras)
        $materia1 = Materia::create([
            'sigla' => 'SIS-123',
            'nombre' => 'Sistemas de Información I',
            'nivel' => 3,
            'creditos' => 4,
            'horas_semanales' => 6,
            'descripcion' => 'Introducción a los sistemas de información empresariales',
        ]);
        // Asignar a Ingeniería de Sistemas
        $materia1->carreras()->attach($ingSistemas->id, [
            'semestre_sugerido' => 3,
            'obligatoria' => true
        ]);

        // Crear Programación I
        $materia2 = Materia::create([
            'sigla' => 'INF-110',
            'nombre' => 'Programación I',
            'nivel' => 1,
            'creditos' => 5,
            'horas_semanales' => 8,
            'descripcion' => 'Fundamentos de programación estructurada',
        ]);
        // Asignar a Ingeniería Informática
        $materia2->carreras()->attach($ingInformatica->id, [
            'semestre_sugerido' => 1,
            'obligatoria' => true
        ]);

        // Crear Redes I
        $materia3 = Materia::create([
            'sigla' => 'RED-210',
            'nombre' => 'Redes I',
            'nivel' => 4,
            'creditos' => 4,
            'horas_semanales' => 6,
            'descripcion' => 'Introducción a las redes de computadoras',
        ]);
        // Asignar a Ingeniería en Redes
        $materia3->carreras()->attach($ingRedes->id, [
            'semestre_sugerido' => 4,
            'obligatoria' => true
        ]);

        // Crear Base de Datos I (compartida entre varias carreras)
        $materia4 = Materia::create([
            'sigla' => 'SIS-210',
            'nombre' => 'Base de Datos I',
            'nivel' => 4,
            'creditos' => 5,
            'horas_semanales' => 8,
            'descripcion' => 'Fundamentos de bases de datos relacionales',
        ]);
        // Asignar a Ingeniería de Sistemas (obligatoria)
        $materia4->carreras()->attach($ingSistemas->id, [
            'semestre_sugerido' => 4,
            'obligatoria' => true
        ]);
        // También asignar a Ingeniería Informática (obligatoria)
        $materia4->carreras()->attach($ingInformatica->id, [
            'semestre_sugerido' => 4,
            'obligatoria' => true
        ]);

        // Crear Estructura de Datos
        $materia5 = Materia::create([
            'sigla' => 'INF-220',
            'nombre' => 'Estructura de Datos',
            'nivel' => 4,
            'creditos' => 4,
            'horas_semanales' => 6,
            'descripcion' => 'Estudio de estructuras de datos y algoritmos',
        ]);
        // Asignar a Ingeniería Informática
        $materia5->carreras()->attach($ingInformatica->id, [
            'semestre_sugerido' => 4,
            'obligatoria' => true
        ]);
    }
}
