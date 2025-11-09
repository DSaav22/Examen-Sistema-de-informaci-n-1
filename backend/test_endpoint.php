<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make('Illuminate\Contracts\Console\Kernel');
$kernel->bootstrap();

echo "🧪 PRUEBA DE ENDPOINT: GET /api/materias\n";
echo "==========================================\n\n";

try {
    // Simular request autenticado
    $user = App\Models\User::first();
    
    if (!$user) {
        echo "❌ No hay usuarios en la base de datos\n";
        exit(1);
    }
    
    Auth::login($user);
    echo "✅ Usuario autenticado: {$user->name}\n\n";
    
    // Crear instancia del controller
    $controller = new App\Http\Controllers\Api\MateriaController();
    
    // Simular request
    $request = Illuminate\Http\Request::create('/api/materias', 'GET');
    
    echo "🔄 Llamando a MateriaController@index...\n\n";
    
    // Reconectar antes de la consulta
    DB::reconnect();
    
    $response = $controller->index($request);
    
    echo "✅ RESPUESTA EXITOSA!\n";
    echo "Status: " . $response->getStatusCode() . "\n";
    
    $data = json_decode($response->getContent(), true);
    
    if (isset($data['data'])) {
        echo "Total de materias: " . count($data['data']) . "\n\n";
        
        if (count($data['data']) > 0) {
            $primera = $data['data'][0];
            echo "Primera materia:\n";
            echo "  Nombre: {$primera['nombre']}\n";
            echo "  Carreras: " . (isset($primera['carreras']) ? count($primera['carreras']) : 0) . "\n";
        }
    }
    
} catch (\Exception $e) {
    echo "❌ ERROR: " . $e->getMessage() . "\n";
    echo "Archivo: " . $e->getFile() . ":" . $e->getLine() . "\n\n";
    echo "Stack trace:\n";
    echo $e->getTraceAsString() . "\n";
}
