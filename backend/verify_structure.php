<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== VERIFICACIÓN DE ESTRUCTURA DE BASE DE DATOS ===\n\n";

// 1. Verificar tabla carrera_materia
echo "1. Tabla pivot carrera_materia:\n";
$pivots = DB::table('carrera_materia')->get();
echo "   Total de registros: " . $pivots->count() . "\n";
foreach ($pivots as $pivot) {
    $carrera = DB::table('carreras')->where('id', $pivot->carrera_id)->first();
    $materia = DB::table('materias')->where('id', $pivot->materia_id)->first();
    echo "   - {$materia->nombre} → {$carrera->nombre} (semestre: {$pivot->semestre_sugerido}, obligatoria: " . ($pivot->obligatoria ? 'Sí' : 'No') . ")\n";
}

// 2. Verificar que materias NO tiene carrera_id
echo "\n2. Columnas de tabla materias:\n";
$columns = DB::select("SELECT column_name FROM information_schema.columns WHERE table_name = 'materias' ORDER BY ordinal_position");
echo "   Columnas: ";
$columnNames = array_map(fn($col) => $col->column_name, $columns);
echo implode(', ', $columnNames) . "\n";
echo "   ✓ carrera_id " . (in_array('carrera_id', $columnNames) ? "EXISTE (ERROR)" : "NO existe (CORRECTO)") . "\n";

// 3. Verificar relación M:N funciona
echo "\n3. Relación Many-to-Many:\n";
$materia = App\Models\Materia::with('carreras')->first();
echo "   Materia: {$materia->nombre}\n";
echo "   Carreras asociadas: " . $materia->carreras->pluck('nombre')->implode(', ') . "\n";

// 4. Verificar columnas de grupos
echo "\n4. Nuevas columnas en tabla grupos:\n";
$grupoColumns = DB::select("SELECT column_name FROM information_schema.columns WHERE table_name = 'grupos' AND column_name IN ('cupos_ofrecidos', 'inscritos', 'estado')");
foreach ($grupoColumns as $col) {
    echo "   ✓ {$col->column_name}\n";
}

// 5. Verificar columna cargo en docentes
echo "\n5. Nueva columna en tabla docentes:\n";
$docenteColumns = DB::select("SELECT column_name FROM information_schema.columns WHERE table_name = 'docentes' AND column_name = 'cargo'");
if (count($docenteColumns) > 0) {
    echo "   ✓ cargo existe\n";
    $docente = App\Models\Docente::first();
    echo "   Ejemplo: {$docente->nombre} {$docente->apellidos} - Cargo: {$docente->cargo}\n";
}

echo "\n=== VERIFICACIÓN COMPLETADA ===\n";
