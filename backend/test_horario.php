<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Horario;
use App\Models\Grupo;

echo "=== PRUEBA DE CREACIÓN DE HORARIO CON DOCENTE_ID ===\n\n";

// 1. Obtener el primer grupo que tenga docente_id
$grupo = Grupo::whereNotNull('docente_id')->first();

if (!$grupo) {
    echo "❌ No hay grupos con docente_id asignado.\n";
    echo "   Asignando docente_id=7 al grupo 11...\n";
    $grupo = Grupo::find(11);
    if ($grupo) {
        $grupo->docente_id = 7;
        $grupo->save();
        echo "✅ Docente asignado al grupo.\n\n";
    } else {
        echo "❌ No se encontró el grupo 11.\n";
        exit(1);
    }
}

echo "Grupo seleccionado: {$grupo->nombre_grupo} (ID: {$grupo->id})\n";
echo "Docente ID del grupo: {$grupo->docente_id}\n\n";

// 2. Verificar si ya existe un horario para este grupo los Lunes a las 08:00
$horarioExistente = Horario::where('grupo_id', $grupo->id)
    ->where('dia_semana', 1) // Lunes
    ->where('hora_inicio', '08:00')
    ->first();

if ($horarioExistente) {
    echo "⚠️  Ya existe un horario para este grupo los Lunes a las 08:00\n";
    echo "   Eliminando horario anterior para hacer la prueba limpia...\n";
    $horarioExistente->delete();
    echo "✅ Horario anterior eliminado.\n\n";
}

// 3. Intentar crear un nuevo horario
try {
    echo "Creando nuevo horario con datos:\n";
    $datosHorario = [
        'grupo_id' => $grupo->id,
        'aula_id' => 6, // AULA 111
        'docente_id' => $grupo->docente_id,
        'dia_semana' => 1, // Lunes
        'hora_inicio' => '08:00',
        'hora_fin' => '10:00',
    ];
    
    print_r($datosHorario);
    
    $horario = Horario::create($datosHorario);
    
    echo "\n✅ ¡HORARIO CREADO EXITOSAMENTE!\n";
    echo "   ID del horario: {$horario->id}\n";
    echo "   Grupo: {$horario->grupo_id}\n";
    echo "   Aula: {$horario->aula_id}\n";
    echo "   Docente ID: {$horario->docente_id}\n";
    echo "   Día: {$horario->dia_semana} (Lunes)\n";
    echo "   Hora: {$horario->hora_inicio} - {$horario->hora_fin}\n";
    
    echo "\n--- Ahora probamos la validación de CONFLICTO DE DOCENTE ---\n\n";
    
    // 4. Intentar crear OTRO horario con el MISMO docente en el MISMO día/hora
    echo "Intentando crear conflicto: mismo docente (ID: {$grupo->docente_id}), Lunes 08:00-10:00...\n";
    
    $conflicto = Horario::where('docente_id', $grupo->docente_id)
        ->where('dia_semana', 1)
        ->where(function ($query) {
            $query->where('hora_inicio', '<', '10:00')
                  ->where('hora_fin', '>', '08:00');
        })
        ->exists();
    
    if ($conflicto) {
        echo "✅ ¡VALIDACIÓN FUNCIONÓ! Se detectó el conflicto de docente.\n";
        echo "   El sistema debe rechazar la creación del segundo horario.\n";
    } else {
        echo "❌ ERROR: No se detectó el conflicto de docente.\n";
    }
    
} catch (\Exception $e) {
    echo "\n❌ ERROR AL CREAR HORARIO:\n";
    echo "   Mensaje: " . $e->getMessage() . "\n";
    echo "   Archivo: " . $e->getFile() . "\n";
    echo "   Línea: " . $e->getLine() . "\n";
}

echo "\n=== FIN DE PRUEBA ===\n";
