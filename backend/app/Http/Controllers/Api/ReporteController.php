<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Horario;
use App\Models\GestionAcademica;
use App\Models\Aula;
use App\Models\Docente;
use App\Models\Asistencia;
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
                'grupo.materia.carreras:id,nombre', // Agregar relación de carreras
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

    /**
     * Reporte de Asistencia por Docente y Grupo
     */
    public function reporteAsistenciaDocente(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'docente_id' => 'nullable|integer|exists:docentes,id',
                'grupo_id' => 'nullable|integer|exists:grupos,id',
                'fecha_inicio' => 'nullable|date',
                'fecha_fin' => 'nullable|date|after_or_equal:fecha_inicio',
            ]);

            $query = Asistencia::with(['horario.grupo.materia', 'horario.grupo.docente.usuario'])
                ->join('horarios', 'asistencias.horario_id', '=', 'horarios.id')
                ->select('asistencias.*');

            if (isset($validated['docente_id'])) {
                $query->whereHas('horario.grupo', function ($q) use ($validated) {
                    $q->where('docente_id', $validated['docente_id']);
                });
            }
            if (isset($validated['grupo_id'])) {
                $query->where('horarios.grupo_id', $validated['grupo_id']);
            }
            if (isset($validated['fecha_inicio'])) {
                $query->whereDate('asistencias.created_at', '>=', $validated['fecha_inicio']);
            }
            if (isset($validated['fecha_fin'])) {
                $query->whereDate('asistencias.created_at', '<=', $validated['fecha_fin']);
            }

            $asistencias = $query->orderBy('asistencias.created_at', 'desc')->get();

            return response()->json($asistencias, 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error("Error en reporte de asistencia: " . $e->getMessage());
            return response()->json([
                'message' => 'Error al generar el reporte',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reporte de Aulas Disponibles
     */
    public function reporteAulasDisponibles(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'dia_semana' => 'required|integer|between:1,7',
                'hora_inicio' => 'required|date_format:H:i',
                'hora_fin' => 'required|date_format:H:i|after:hora_inicio',
            ]);

            // 1. Obtener todas las aulas
            $todasLasAulas = Aula::where('activo', true)->pluck('id');

            // 2. Obtener aulas OCUPADAS en ese rango
            $aulasOcupadas = Horario::where('dia_semana', $validated['dia_semana'])
                ->where(function ($query) use ($validated) {
                    $query->where('hora_inicio', '<', $validated['hora_fin'])
                          ->where('hora_fin', '>', $validated['hora_inicio']);
                })
                ->pluck('aula_id');

            // 3. Obtener la diferencia
            $aulasDisponiblesIds = $todasLasAulas->diff($aulasOcupadas);
            $aulasDisponibles = Aula::whereIn('id', $aulasDisponiblesIds)
                ->orderBy('edificio')
                ->orderBy('nombre')
                ->get();

            return response()->json($aulasDisponibles, 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error("Error en reporte de aulas disponibles: " . $e->getMessage());
            return response()->json([
                'message' => 'Error al generar el reporte',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
