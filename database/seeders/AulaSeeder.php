<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Aula;

class AulaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $aulas = [
            [
                'nombre' => '225-PC',
                'edificio' => 'Edificio Nuevo',
                'capacidad' => 40,
                'tipo' => 'Laboratorio',
                'recursos' => 'Computadoras, Proyector, Aire acondicionado',
            ],
            [
                'nombre' => '224-AUD',
                'edificio' => 'Edificio Nuevo',
                'capacidad' => 100,
                'tipo' => 'Auditorio',
                'recursos' => 'Sistema de audio, Proyector, Pizarra digital',
            ],
            [
                'nombre' => '301-A',
                'edificio' => 'Edificio Antiguo',
                'capacidad' => 50,
                'tipo' => 'Aula Normal',
                'recursos' => 'Proyector, Pizarra',
            ],
            [
                'nombre' => '302-B',
                'edificio' => 'Edificio Antiguo',
                'capacidad' => 50,
                'tipo' => 'Aula Normal',
                'recursos' => 'Proyector, Pizarra',
            ],
            [
                'nombre' => '303-C',
                'edificio' => 'Edificio Antiguo',
                'capacidad' => 50,
                'tipo' => 'Aula Normal',
                'recursos' => 'Proyector, Pizarra',
            ],
        ];

        foreach ($aulas as $aula) {
            Aula::create($aula);
        }
    }
}
