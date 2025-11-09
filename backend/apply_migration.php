<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== APLICANDO MIGRACIÓN MANUALMENTE CON SQL ===\n\n";

try {
    // Verificar si la columna ya existe
    $exists = DB::select("
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'horarios' 
        AND column_name = 'docente_id'
    ");
    
    if (count($exists) > 0) {
        echo "✅ La columna 'docente_id' ya existe. No se requiere migración.\n";
        exit(0);
    }
    
    echo "Ejecutando ALTER TABLE para añadir columna 'docente_id'...\n";
    
    // Añadir la columna docente_id
    DB::statement("
        ALTER TABLE horarios 
        ADD COLUMN docente_id BIGINT NULL
    ");
    
    echo "✅ Columna 'docente_id' añadida.\n\n";
    
    // Añadir la constraint de foreign key
    echo "Añadiendo constraint de foreign key...\n";
    
    DB::statement("
        ALTER TABLE horarios 
        ADD CONSTRAINT horarios_docente_id_foreign 
        FOREIGN KEY (docente_id) 
        REFERENCES docentes(id) 
        ON DELETE SET NULL
    ");
    
    echo "✅ Foreign key constraint añadida.\n\n";
    
    // Verificar que la migración se aplicó correctamente
    $columnas = DB::select("
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = 'horarios' 
        AND column_name = 'docente_id'
    ");
    
    if (count($columnas) > 0) {
        $col = $columnas[0];
        echo "✅ ¡MIGRACIÓN EXITOSA!\n";
        echo "   Columna: {$col->column_name}\n";
        echo "   Tipo: {$col->data_type}\n";
        echo "   Nullable: {$col->is_nullable}\n";
    }
    
    // Registrar la migración en la tabla migrations
    echo "\nRegistrando migración en la tabla 'migrations'...\n";
    
    $migrationExists = DB::table('migrations')
        ->where('migration', '2025_11_08_210052_add_docente_id_to_horarios_table')
        ->exists();
    
    if (!$migrationExists) {
        DB::table('migrations')->insert([
            'migration' => '2025_11_08_210052_add_docente_id_to_horarios_table',
            'batch' => DB::table('migrations')->max('batch') + 1
        ]);
        echo "✅ Migración registrada en la tabla 'migrations'.\n";
    } else {
        echo "⚠️  La migración ya estaba registrada.\n";
    }
    
} catch (\Exception $e) {
    echo "\n❌ ERROR:\n";
    echo "   " . $e->getMessage() . "\n";
    exit(1);
}

echo "\n=== FIN DE MIGRACIÓN ===\n";
