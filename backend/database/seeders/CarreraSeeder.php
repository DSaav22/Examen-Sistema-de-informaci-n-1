<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Carrera;
use App\Models\Facultad;

class CarreraSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener la facultad FICCT
        $ficct = Facultad::where('codigo', 'FICCT')->first();

        // Crear las carreras
        Carrera::create([
            'nombre' => 'Ingeniería Informática',
            'codigo' => 'INF',
            'facultad_id' => $ficct->id,
            'duracion_semestres' => 10,
            'descripcion' => 'Carrera enfocada en el desarrollo de software y sistemas informáticos',
        ]);

        Carrera::create([
            'nombre' => 'Ingeniería de Sistemas',
            'codigo' => 'SIS',
            'facultad_id' => $ficct->id,
            'duracion_semestres' => 10,
            'descripcion' => 'Carrera orientada al análisis, diseño e implementación de sistemas de información',
        ]);

        Carrera::create([
            'nombre' => 'Ingeniería en Redes y Telecomunicaciones',
            'codigo' => 'RED',
            'facultad_id' => $ficct->id,
            'duracion_semestres' => 10,
            'descripcion' => 'Carrera especializada en infraestructura de redes y comunicaciones',
        ]);
    }
}
