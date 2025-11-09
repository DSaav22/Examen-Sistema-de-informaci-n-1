<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make('Illuminate\Contracts\Console\Kernel');
$kernel->bootstrap();

use Illuminate\Http\Request;
use App\Http\Controllers\Api\HorarioController;

echo "=== PRUEBA DIRECTA: HorarioController::store ===\n\n";

// Primero, asegurar que el grupo tiene docente_id
$grupo = \App\Models\Grupo::find(11);
if (!$grupo) {
    echo "❌ No se encontró el grupo 11.\n";
    exit(1);
}

if (!$grupo->docente_id) {
    echo "Asignando docente_id=7 al grupo 11...\n";
    $grupo->docente_id = 7;
    $grupo->save();
    echo "✅ Docente asignado.\n\n";
}

echo "Grupo: {$grupo->nombre_grupo} (ID: {$grupo->id})\n";
echo "Docente ID: {$grupo->docente_id}\n\n";

// Limpiar horarios anteriores de prueba
\App\Models\Horario::where('grupo_id', 11)
    ->where('dia_semana', 1)
    ->where('hora_inicio', '>=', '12:00')
    ->delete();

echo "--- PRUEBA 1: Crear horario válido ---\n\n";

try {
    $controller = new HorarioController();
    
    $request = Request::create('/api/horarios', 'POST', [
        'grupo_id' => 11,
        'aula_id' => 6,
        'dia_semana' => 1,
        'hora_inicio' => '12:00',
        'hora_fin' => '14:00',
    ]);
    
    $response = $controller->store($request);
    $data = json_decode($response->getContent(), true);
    $status = $response->getStatusCode();
    
    echo "Status Code: $status\n";
    echo "Response:\n";
    print_r($data);
    
    if ($status === 201) {
        echo "\n✅ ¡HORARIO CREADO EXITOSAMENTE!\n";
        $horarioId = $data['horario']['id'];
        
        echo "\n--- PRUEBA 2: Intentar crear CONFLICTO DE DOCENTE ---\n\n";
        
        $request2 = Request::create('/api/horarios', 'POST', [
            'grupo_id' => 11,  // Mismo grupo (mismo docente)
            'aula_id' => 7,    // Diferente aula
            'dia_semana' => 1, // Mismo día
            'hora_inicio' => '13:00',  // Horario superpuesto
            'hora_fin' => '15:00',
        ]);
        
        $response2 = $controller->store($request2);
        $data2 = json_decode($response2->getContent(), true);
        $status2 = $response2->getStatusCode();
        
        echo "Status Code: $status2\n";
        echo "Response:\n";
        print_r($data2);
        
        if ($status2 === 422 && isset($data2['errors']['docente_id'])) {
            echo "\n✅ ¡VALIDACIÓN DE CONFLICTO FUNCIONÓ CORRECTAMENTE!\n";
            echo "   Mensaje: " . $data2['errors']['docente_id'][0] . "\n";
        } else {
            echo "\n❌ ERROR: La validación de conflicto no funcionó como se esperaba.\n";
        }
    } else {
        echo "\n❌ ERROR: No se pudo crear el horario inicial.\n";
    }
    
} catch (\Exception $e) {
    echo "\n❌ EXCEPCIÓN:\n";
    echo "   Mensaje: " . $e->getMessage() . "\n";
    echo "   Archivo: " . $e->getFile() . "\n";
    echo "   Línea: " . $e->getLine() . "\n";
}

echo "\n=== FIN DE PRUEBA ===\n";
