<?php

echo "=== PRUEBA HTTP: ASIGNAR HORARIO VÍA API ===\n\n";

// Datos de prueba (simulando lo que envía el frontend)
$datosHorario = [
    'grupo_id' => 11,  // El grupo que estás usando en el navegador
    'aula_id' => 6,     // AULA 111 (Cap: 50)
    'dia_semana' => 1,  // Lunes
    'hora_inicio' => '12:00',
    'hora_fin' => '14:00',
];

echo "Datos a enviar:\n";
print_r($datosHorario);
echo "\n";

// Inicializar cURL
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, 'http://127.0.0.1:8000/api/horarios');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($datosHorario));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json',
]);

echo "Enviando POST a http://127.0.0.1:8000/api/horarios...\n\n";

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

curl_close($ch);

echo "Código HTTP: $httpCode\n";
echo "Respuesta:\n";

$responseData = json_decode($response, true);
if ($responseData) {
    print_r($responseData);
} else {
    echo $response;
}

echo "\n";

if ($httpCode === 201) {
    echo "✅ ¡HORARIO CREADO EXITOSAMENTE VÍA API!\n";
    
    // Ahora intentamos crear un conflicto
    echo "\n--- Probando CONFLICTO DE DOCENTE ---\n\n";
    
    $datosConflicto = [
        'grupo_id' => 11,  // Mismo grupo (mismo docente)
        'aula_id' => 7,     // Diferente aula
        'dia_semana' => 1,  // Mismo día (Lunes)
        'hora_inicio' => '13:00',  // Horario superpuesto
        'hora_fin' => '15:00',
    ];
    
    echo "Intentando crear horario superpuesto:\n";
    print_r($datosConflicto);
    echo "\n";
    
    $ch2 = curl_init();
    curl_setopt($ch2, CURLOPT_URL, 'http://127.0.0.1:8000/api/horarios');
    curl_setopt($ch2, CURLOPT_POST, true);
    curl_setopt($ch2, CURLOPT_POSTFIELDS, json_encode($datosConflicto));
    curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch2, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Accept: application/json',
    ]);
    
    $response2 = curl_exec($ch2);
    $httpCode2 = curl_getinfo($ch2, CURLINFO_HTTP_CODE);
    curl_close($ch2);
    
    echo "Código HTTP: $httpCode2\n";
    echo "Respuesta:\n";
    
    $responseData2 = json_decode($response2, true);
    if ($responseData2) {
        print_r($responseData2);
    } else {
        echo $response2;
    }
    
    if ($httpCode2 === 422 && isset($responseData2['errors']['docente_id'])) {
        echo "\n✅ ¡VALIDACIÓN DE CONFLICTO FUNCIONÓ!\n";
        echo "   Mensaje: " . $responseData2['errors']['docente_id'][0] . "\n";
    } else {
        echo "\n⚠️  No se detectó el conflicto como se esperaba.\n";
    }
    
} elseif ($httpCode === 422) {
    echo "⚠️  Error de validación (esperado si ya existe un horario).\n";
    if (isset($responseData['errors'])) {
        echo "Errores:\n";
        foreach ($responseData['errors'] as $field => $messages) {
            echo "  - $field: " . implode(', ', $messages) . "\n";
        }
    }
} else {
    echo "❌ ERROR: Código HTTP $httpCode\n";
}

echo "\n=== FIN DE PRUEBA HTTP ===\n";
