<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Materia;

try {
    echo "🔍 Probando consulta con relación carreras...\n\n";
    
    // Reconectar
    DB::reconnect();
    
    // Probar la consulta
    $materia = Materia::with('carreras')->first();
    
    if ($materia) {
        echo "✅ ÉXITO! Materia encontrada: {$materia->nombre}\n";
        echo "✅ Carreras cargadas: " . $materia->carreras->count() . "\n";
        
        if ($materia->carreras->count() > 0) {
            echo "\nCarreras asociadas:\n";
            foreach ($materia->carreras as $carrera) {
                echo "  - {$carrera->nombre}\n";
            }
        }
    } else {
        echo "⚠️ No hay materias en la base de datos\n";
    }
    
} catch (\Exception $e) {
    echo "❌ ERROR: " . $e->getMessage() . "\n";
    echo "Archivo: " . $e->getFile() . "\n";
    echo "Línea: " . $e->getLine() . "\n";
}
