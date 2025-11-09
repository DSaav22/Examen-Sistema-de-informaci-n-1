<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\CargaHorariaImport; // Importaremos esto
use Exception;

class CargaHorariaController extends Controller
{
    /**
     * Importa la carga horaria desde un archivo Excel/CSV.
     */
    public function importar(Request $request)
    {
        // 1. Validar que el archivo exista
        if (!$request->hasFile('file')) {
            return response()->json(['error' => 'No se encontró ningún archivo.'], 422);
        }

        $file = $request->file('file');

        // 2. Validar la extensión
        $extensions = ['xlsx', 'xls', 'csv'];
        if (!in_array($file->getClientOriginalExtension(), $extensions)) {
            return response()->json(['error' => 'El archivo debe ser de tipo .xlsx, .xls o .csv'], 422);
        }

        // ***** INICIO DE LA MODIFICACIÓN CLAVE *****
        // Vamos a envolver todo en un try...catch genérico
        try {
            
            // Aquí llamamos a la importación
            Excel::import(new \App\Imports\CargaHorariaImport, $file);

            return response()->json(['message' => 'Carga horaria importada con éxito.'], 200);

        } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
             // Captura errores de validación del Excel (Error 422)
             $failures = $e->failures();
             $errors = [];
             foreach ($failures as $failure) {
                 $errors[] = "Fila " . $failure->row() . ": " . implode(', ', $failure->errors());
             }
             return response()->json([
                'error' => 'Error de validación en el archivo.', 
                'details' => $errors
            ], 422);

        } catch (\Exception $e) {
            // ***** ESTA ES LA PARTE IMPORTANTE *****
            // Captura CUALQUIER otro error (SQL, etc.) y lo muestra
            return response()->json([
                'error' => 'Error 500 Interno. Causa Raíz:',
                'message' => $e->getMessage(), // El error real
                'file' => $e->getFile(),         // El archivo que "crashó"
                'line' => $e->getLine(),         // La línea exacta del "crash"
                'trace' => $e->getTraceAsString() // Stack trace completo
            ], 500);
        }
        // ***** FIN DE LA MODIFICACIÓN CLAVE *****
    }
}
