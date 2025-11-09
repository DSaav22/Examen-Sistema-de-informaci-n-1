<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Imports\CargaHorariaImport;
use App\Imports\DocentesImport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;

class ImportController extends Controller
{
    /**
     * Importar docentes desde archivo CSV/Excel
     */
    public function importDocentes(Request $request): JsonResponse
    {
        try {
            // Validar que se envió un archivo
            $request->validate([
                'file' => 'required|file|extensions:csv,xlsx,xls|max:2048',
            ], [
                'file.required' => 'Debe seleccionar un archivo.',
                'file.extensions' => 'El archivo debe ser CSV, XLSX o XLS.',
                'file.max' => 'El archivo no debe superar los 2MB.',
            ]);

            $file = $request->file('file');

            // Crear instancia del importador
            $import = new DocentesImport();

            // Ejecutar importación
            Excel::import($import, $file);

            // Obtener resultados
            $created = $import->getCreatedCount();
            $updated = $import->getUpdatedCount();
            $errors = $import->getErrors();

            // Verificar si hubo errores durante la importación
            if (!empty($errors)) {
                return response()->json([
                    'message' => 'Importación completada con errores',
                    'created' => $created,
                    'updated' => $updated,
                    'errors' => $errors,
                ], 207); // 207 Multi-Status
            }

            return response()->json([
                'message' => 'Importación completada exitosamente',
                'created' => $created,
                'updated' => $updated,
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);

        } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
            $failures = $e->failures();
            $errors = [];

            foreach ($failures as $failure) {
                $errors[] = [
                    'row' => $failure->row(),
                    'attribute' => $failure->attribute(),
                    'errors' => $failure->errors(),
                    'values' => $failure->values(),
                ];
            }

            return response()->json([
                'message' => 'Errores de validación en el archivo',
                'errors' => $errors,
            ], 422);

        } catch (\Exception $e) {
            Log::error("Error al importar docentes: " . $e->getMessage());
            
            return response()->json([
                'message' => 'Error al importar el archivo',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Importar carga horaria desde archivo CSV/Excel
     */
    public function importCargaHoraria(Request $request): JsonResponse
    {
        try {
            // Validar que se envió un archivo
            $request->validate([
                'file' => 'required|file|extensions:csv,xlsx,xls|max:5120', // 5MB para archivos grandes
            ], [
                'file.required' => 'Debe seleccionar un archivo.',
                'file.extensions' => 'El archivo debe ser CSV, XLSX o XLS.',
                'file.max' => 'El archivo no debe superar los 5MB.',
            ]);

            $file = $request->file('file');

            // Crear instancia del importador
            $import = new CargaHorariaImport();

            // Ejecutar importación
            Excel::import($import, $file);

            // Obtener resumen de la importación
            $summary = $import->getImportSummary();

            // Verificar si hubo errores durante la importación
            if (!empty($summary['errors'])) {
                return response()->json([
                    'message' => 'Importación completada con advertencias',
                    'imported' => $summary['imported'],
                    'skipped' => $summary['skipped'],
                    'errors' => $summary['errors'],
                ], 207); // 207 Multi-Status
            }

            return response()->json([
                'message' => 'Carga horaria importada exitosamente',
                'imported' => $summary['imported'],
                'skipped' => $summary['skipped'],
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);

        } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
            $failures = $e->failures();
            $errors = [];

            foreach ($failures as $failure) {
                $errors[] = [
                    'row' => $failure->row(),
                    'attribute' => $failure->attribute(),
                    'errors' => $failure->errors(),
                    'values' => $failure->values(),
                ];
            }

            return response()->json([
                'message' => 'Errores de validación en el archivo',
                'errors' => $errors,
            ], 422);

        } catch (\Exception $e) {
            Log::error("Error al importar carga horaria: " . $e->getMessage());
            
            return response()->json([
                'message' => 'Error al importar el archivo',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
