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
        // Primero ejecutar el seeder de roles
        $this->call([
            RolesSeeder::class,
        ]);

        // Crear un usuario administrador por defecto
        User::create([
            'name' => 'Administrador',
            'email' => 'admin@sistema.com',
            'password' => bcrypt('password'),
            'rol_id' => 1, // Rol administrador
            'ci' => '12345678',
            'telefono' => '12345678',
            'activo' => true,
            'email_verified_at' => now(),
        ]);

        // Crear un usuario coordinador por defecto
        User::create([
            'name' => 'Coordinador',
            'email' => 'coordinador@sistema.com',
            'password' => bcrypt('password'),
            'rol_id' => 2, // Rol coordinador
            'ci' => '87654321',
            'telefono' => '87654321',
            'activo' => true,
            'email_verified_at' => now(),
        ]);

        // Crear un usuario docente por defecto
        User::create([
            'name' => 'Docente',
            'email' => 'docente@sistema.com',
            'password' => bcrypt('password'),
            'rol_id' => 3, // Rol docente
            'ci' => '11223344',
            'telefono' => '11223344',
            'activo' => true,
            'email_verified_at' => now(),
        ]);
    }
}
