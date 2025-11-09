<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== LISTANDO GRUPOS DISPONIBLES ===\n\n";

$grupos = \App\Models\Grupo::select('id', 'nombre_grupo', 'docente_id')->get();

foreach ($grupos as $grupo) {
    echo "ID: {$grupo->id} | Nombre: {$grupo->nombre_grupo} | Docente ID: " . 
         ($grupo->docente_id ?? 'NULL') . "\n";
}

echo "\nTotal de grupos: " . count($grupos) . "\n";
