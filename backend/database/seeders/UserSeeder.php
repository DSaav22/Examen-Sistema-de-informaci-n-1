<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear usuario administrador (idempotente)
        User::updateOrCreate(
            ['email' => 'admin@admin.com'],
            [
                'name' => 'Administrador',
                'password' => bcrypt('Admin123.'),
                'rol_id' => 1, // Rol administrador
                'ci' => '12345678',
                'telefono' => '12345678',
                'activo' => true,
                'email_verified_at' => now(),
            ]
        );

        // Crear usuario coordinador (idempotente)
        User::updateOrCreate(
            ['email' => 'coordinador@coordinador.com'],
            [
                'name' => 'Coordinador',
                'password' => bcrypt('Coordinador123.'),
                'rol_id' => 2, // Rol coordinador
                'ci' => '87654321',
                'telefono' => '87654321',
                'activo' => true,
                'email_verified_at' => now(),
            ]
        );

        // Crear usuario docente (idempotente)
        User::updateOrCreate(
            ['email' => 'docente@docente.com'],
            [
                'name' => 'Docente',
                'password' => bcrypt('Docente123.'),
                'rol_id' => 3, // Rol docente
                'ci' => '11223344',
                'telefono' => '11223344',
                'activo' => true,
                'email_verified_at' => now(),
            ]
        );
    }
}
