<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Horario;
use App\Models\GestionAcademica;
use App\Models\Aula;
use App\Models\Docente;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ReporteController extends Controller
{
    /**
     * Get filtros para la parrilla de horarios
     */
    public function getFiltros(): JsonResponse
    {
        try {
            $gestiones = GestionAcademica::orderBy('anio', 'desc')
                ->orderBy('periodo', 'desc')
                ->get(['id', 'anio', 'periodo', 'activo']);

            $aulas = Aula::where('activo', true)
                ->orderBy('nombre')
                ->get(['id', 'nombre', 'edificio']);

            $docentes = Docente::with('usuario:id,name')
                ->where('activo', true)
                ->get(['id', 'usuario_id', 'codigo_docente']);

            return response()->json([
                'gestiones' => $gestiones,
                'aulas' => $aulas,
                'docentes' => $docentes,
            ], 200);

        } catch (\Exception $e) {
            Log::error("Error al cargar filtros de reportes: " . $e->getMessage());
            return response()->json([
                'message' => 'Error al cargar los filtros',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get horarios globales con filtros
     */
    public function getHorariosGlobal(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'gestion_id' => 'required|integer|exists:gestiones_academicas,id',
                'aula_id' => 'nullable|integer|exists:aulas,id',
                'docente_id' => 'nullable|integer|exists:docentes,id',
            ]);

            $query = Horario::with([
                'grupo.materia:id,sigla,nombre',
                'grupo.docente.usuario:id,name',
                'grupo.gestionAcademica:id,anio,periodo',
                'aula:id,nombre,edificio'
            ])
            ->whereHas('grupo', function ($q) use ($validated) {
                $q->where('gestion_academica_id', $validated['gestion_id']);
            });

            // Filtro opcional por aula
            if (isset($validated['aula_id'])) {
                $query->where('aula_id', $validated['aula_id']);
            }

            // Filtro opcional por docente
            if (isset($validated['docente_id'])) {
                $query->whereHas('grupo', function ($q) use ($validated) {
                    $q->where('docente_id', $validated['docente_id']);
                });
            }

            $horarios = $query->orderBy('dia_semana')
                ->orderBy('hora_inicio')
                ->get();

            return response()->json([
                'horarios' => $horarios,
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error("Error al obtener horarios globales: " . $e->getMessage());
            return response()->json([
                'message' => 'Error al obtener los horarios',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
