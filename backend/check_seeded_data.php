<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== RESUMEN DE DATOS SEMBRADOS ===\n\n";

$stats = [
    'Roles' => \App\Models\Role::count(),
    'Usuarios' => \App\Models\User::count(),
    'Facultades' => \App\Models\Facultad::count(),
    'Carreras' => \App\Models\Carrera::count(),
    'Materias' => \App\Models\Materia::count(),
    'Docentes' => \App\Models\Docente::count(),
    'Aulas' => \App\Models\Aula::count(),
    'Grupos' => \App\Models\Grupo::count(),
    'Horarios' => \App\Models\Horario::count(),
];

foreach ($stats as $tabla => $count) {
    echo sprintf("%-15s: %3d registros\n", $tabla, $count);
}

echo "\n--- Usuarios Creados ---\n";
$users = \App\Models\User::with('role')->get();
foreach ($users as $user) {
    echo "- {$user->email} ({$user->role->nombre})\n";
}

echo "\n✅ Base de datos lista para usar!\n";
