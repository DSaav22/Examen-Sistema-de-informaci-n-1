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
        ]);

        // Crear usuarios de prueba principales (admin, coordinador, docente)
        // Estos se crean después de los seeders para tener datos completos

        User::create([
            'name' => 'Administrador',
            'email' => 'admin@admin.com',
            'password' => bcrypt('Admin123.'),
            'rol_id' => 1, // Rol administrador
            'ci' => '12345678',
            'telefono' => '12345678',
            'activo' => true,
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Coordinador',
            'email' => 'coordinador@coordinador.com',
            'password' => bcrypt('Coordinador123.'),
            'rol_id' => 2, // Rol coordinador
            'ci' => '87654321',
            'telefono' => '87654321',
            'activo' => true,
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Docente',
            'email' => 'docente@docente.com',
            'password' => bcrypt('Docente123.'),
            'rol_id' => 3, // Rol docente
            'ci' => '11223344',
            'telefono' => '11223344',
            'activo' => true,
            'email_verified_at' => now(),
        ]);
    }
}
