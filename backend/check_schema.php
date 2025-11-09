<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== VERIFICANDO ESQUEMA DE TABLA 'horarios' ===\n\n";

// Verificar columnas de la tabla horarios
$columns = DB::select("
    SELECT column_name, data_type, is_nullable, column_default
    FROM information_schema.columns 
    WHERE table_name = 'horarios'
    ORDER BY ordinal_position
");

echo "Columnas encontradas en la tabla 'horarios':\n";
foreach ($columns as $column) {
    echo "- {$column->column_name} ({$column->data_type}) " . 
         ($column->is_nullable === 'YES' ? 'NULL' : 'NOT NULL') . "\n";
}

echo "\n";

// Verificar específicamente la columna docente_id
$docenteIdExists = DB::select("
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'horarios' 
    AND column_name = 'docente_id'
");

if (count($docenteIdExists) > 0) {
    echo "✅ LA COLUMNA 'docente_id' EXISTE EN LA TABLA 'horarios'\n";
} else {
    echo "❌ LA COLUMNA 'docente_id' NO EXISTE EN LA TABLA 'horarios'\n";
    echo "   Necesitamos ejecutar la migración manualmente.\n";
}

echo "\n=== FIN DE VERIFICACIÓN ===\n";
