<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AdminSeeder extends Seeder
{
    /**
     * Seeder para forzar actualización de credenciales de administrador.
     * 
     * Este seeder actualiza todas las credenciales de administrador a valores conocidos
     * para solucionar el error 422 en producción.
     * 
     * Email: admin@prod.com
     * Contraseña: Admin123.
     * 
     * Para ejecutar:
     * php artisan db:seed --class=AdminSeeder
     */
    public function run(): void
    {
        echo "🔄 Actualizando credenciales de administrador...\n";

        // Buscar usuario admin por rol_id = 1 o por email conocido
        $admin = User::where('rol_id', 1)
                     ->orWhere('email', 'admin@admin.com')
                     ->orWhere('email', 'admin@prod.com')
                     ->first();

        if (!$admin) {
            echo "❌ No se encontró usuario administrador. Creando nuevo usuario...\n";
            
            // Crear nuevo administrador si no existe
            $admin = User::create([
                'name' => 'Administrador',
                'email' => 'admin@prod.com',
                'password' => Hash::make('Admin123.'),
                'rol_id' => 1, // Rol administrador
                'ci' => '12345678',
                'telefono' => '12345678',
                'activo' => true,
                'email_verified_at' => now(),
            ]);

            echo "✅ Usuario administrador creado exitosamente.\n";
        } else {
            echo "📋 Usuario encontrado: {$admin->email} (ID: {$admin->id})\n";
            
            // Actualizar credenciales a valores conocidos
            $admin->update([
                'name' => 'Administrador',
                'email' => 'admin@prod.com',
                'password' => Hash::make('Admin123.'),
                'rol_id' => 1,
                'activo' => true,
                'email_verified_at' => now(),
            ]);

            echo "✅ Credenciales actualizadas exitosamente.\n";
        }

        // Mostrar credenciales finales
        echo "\n" . str_repeat('=', 60) . "\n";
        echo "📧 EMAIL: admin@prod.com\n";
        echo "🔑 CONTRASEÑA: Admin123.\n";
        echo "👤 NOMBRE: Administrador\n";
        echo "🆔 ID: {$admin->id}\n";
        echo "🎭 ROL: Administrador (rol_id: 1)\n";
        echo str_repeat('=', 60) . "\n\n";

        // Verificación adicional: listar todos los usuarios con rol_id = 1
        $admins = User::where('rol_id', 1)->get();
        echo "🔍 Total de administradores en la base de datos: {$admins->count()}\n";
        
        foreach ($admins as $adm) {
            echo "  - {$adm->email} (ID: {$adm->id}, Activo: " . ($adm->activo ? 'Sí' : 'No') . ")\n";
        }

        // SQL equivalente para referencia (comentado)
        /*
        UPDATE users 
        SET 
            name = 'Administrador',
            email = 'admin@prod.com',
            password = '$2y$12$...' -- Hash de 'Admin123.'
            rol_id = 1,
            activo = true,
            email_verified_at = NOW()
        WHERE rol_id = 1 OR email = 'admin@admin.com'
        LIMIT 1;
        */
    }
}
