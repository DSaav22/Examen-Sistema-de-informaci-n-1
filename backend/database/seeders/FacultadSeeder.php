<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Facultad;

class FacultadSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Facultad::create([
            'nombre' => 'Facultad de Ingeniería en Ciencias de la Computación y Telecomunicaciones',
            'codigo' => 'FICCT',
            'descripcion' => 'Facultad dedicada a la formación de profesionales en computación y telecomunicaciones',
            'activo' => true,
        ]);
    }
}
