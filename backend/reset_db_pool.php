<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make('Illuminate\Contracts\Console\Kernel');
$kernel->bootstrap();

echo "🔄 REINICIANDO POOL DE CONEXIONES DE POSTGRESQL\n";
echo "==============================================\n\n";

try {
    // 1. Desconectar
    DB::disconnect();
    echo "✅ Desconectado de PostgreSQL\n";
    
    // 2. Purgar el pool interno de Laravel
    DB::purge('pgsql');
    echo "✅ Pool de Laravel purgado\n";
    
    // 3. Reconectar forzando nueva conexión
    DB::reconnect('pgsql');
    echo "✅ Reconectado a PostgreSQL\n\n";
    
    // 4. Verificar que la tabla existe
    $exists = DB::select("SELECT to_regclass('public.carrera_materia')");
    echo "🔍 Verificando tabla carrera_materia: ";
    echo ($exists[0]->to_regclass !== null) ? "✅ EXISTE\n\n" : "❌ NO EXISTE\n\n";
    
    // 5. Probar la consulta problemática
    echo "🧪 Probando consulta con Materia::with('carreras')...\n";
    
    $materia = App\Models\Materia::with('carreras')->first();
    
    if ($materia) {
        echo "✅ ¡ÉXITO! Materia: {$materia->nombre}\n";
        echo "✅ Carreras cargadas: " . $materia->carreras->count() . "\n\n";
    } else {
        echo "⚠️ No hay materias\n\n";
    }
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    echo "✅ POOL DE CONEXIONES REINICIADO EXITOSAMENTE\n";
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    echo "👉 Ahora reinicia tu servidor Laravel:\n";
    echo "   php artisan serve\n\n";
    
} catch (\Exception $e) {
    echo "\n❌ ERROR: " . $e->getMessage() . "\n";
    echo "Archivo: " . $e->getFile() . ":" . $e->getLine() . "\n";
}
