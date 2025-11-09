<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make('Illuminate\Contracts\Console\Kernel');
$kernel->bootstrap();

echo "🔍 DIAGNÓSTICO DE TABLA carrera_materia\n";
echo "======================================\n\n";

// 1. Buscar en qué schema está
echo "1. Buscando tabla en todos los schemas...\n";
$result = DB::select("SELECT schemaname, tablename FROM pg_tables WHERE tablename = 'carrera_materia'");

if (count($result) > 0) {
    foreach ($result as $row) {
        echo "   ✅ Encontrada en schema: {$row->schemaname}\n";
    }
} else {
    echo "   ❌ NO ENCONTRADA en ningún schema\n";
}

echo "\n2. Verificando search_path actual...\n";
$searchPath = DB::select("SHOW search_path");
echo "   Search path: {$searchPath[0]->search_path}\n";

echo "\n3. Listando TODAS las tablas en schema 'public'...\n";
$tables = DB::select("SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename");
foreach ($tables as $table) {
    if (str_contains($table->tablename, 'carrera') || str_contains($table->tablename, 'materia')) {
        echo "   - {$table->tablename}\n";
    }
}

echo "\n4. Verificando con Schema::hasTable()...\n";
echo "   " . (Schema::hasTable('carrera_materia') ? "✅ TRUE" : "❌ FALSE") . "\n";

echo "\n5. Probando consulta directa...\n";
try {
    $count = DB::table('carrera_materia')->count();
    echo "   ✅ Consulta exitosa. Registros: {$count}\n";
} catch (\Exception $e) {
    echo "   ❌ Error: " . $e->getMessage() . "\n";
}
