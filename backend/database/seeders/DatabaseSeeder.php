<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Ejecutar seeders en orden para respetar las llaves foráneas
        $this->call([
            // 1. Crear roles primero (no depende de nada)
            RolesSeeder::class,
            
            // 2. Crear facultad (no depende de nada excepto roles)
            FacultadSeeder::class,
            
            // 3. Crear carreras (depende de facultades)
            CarreraSeeder::class,
            
            // 4. Crear aulas (no depende de otras tablas de negocio)
            AulaSeeder::class,
            
            // 5. Crear materias (depende de carreras)
            MateriaSeeder::class,
            
            // 6. Crear docentes adicionales (depende de roles y usuarios)
            DocenteSeeder::class,
            
            // 7. Crear usuarios principales (admin, coordinador, docente)
            UserSeeder::class,
        ]);
    }
}
