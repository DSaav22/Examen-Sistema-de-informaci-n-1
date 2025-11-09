<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Grupo;
use App\Models\Materia;
use App\Models\Docente;
use App\Models\GestionAcademica;
use App\Models\Carrera;
use App\Models\Aula;
use App\Http\Requests\StoreGrupoRequest;
use App\Http\Requests\UpdateGrupoRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class GrupoController extends Controller
{
    /**
     * Display a listing of the resource.
     * CRÍTICO: Cargar Docente y Gestión Académica para la vista de tarjetas
     */
    public function index(Request $request): JsonResponse
    {
        $grupos = Grupo::with([
            'materia',
            'docente.usuario', // Nombre del Docente
            'gestionAcademica', // Nombre de la Gestión
            'horarios', // Conteo de Horarios
        ])
        ->orderBy('nombre_grupo')
        ->paginate($request->get('per_page', 10));

        return response()->json($grupos, 200);
    }

    /**
     * Get form data for creating a grupo.
     */
    public function formData(): JsonResponse
    {
        $materias = Materia::with('carreras')
            ->where('activo', true)
            ->orderBy('nombre')
            ->get();

        $docentes = Docente::with('usuario')
            ->whereHas('usuario', function ($query) {
                $query->where('activo', true);
            })
            ->get();

        $gestiones = GestionAcademica::orderBy('fecha_inicio', 'desc')
            ->get();

        $aulas = Aula::orderBy('nombre')
            ->get();

        $carreras = Carrera::where('activo', true)
            ->orderBy('nombre')
            ->get();

        // Añadimos grupos con la relación materia cargada (eager-loading)
        $grupos = Grupo::with('materia')
            ->orderBy('nombre_grupo')
            ->get();

        return response()->json([
            'materias' => $materias,
            'docentes' => $docentes,
            'gestiones' => $gestiones,
            'aulas' => $aulas,
            'carreras' => $carreras,
            'grupos' => $grupos,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreGrupoRequest $request): JsonResponse
    {
        $grupo = Grupo::create($request->validated());
        $grupo->load(['materia.carreras', 'docente.usuario', 'gestionAcademica']);

        return response()->json([
            'message' => 'Grupo creado exitosamente',
            'grupo' => $grupo,
        ], 201);
    }

    /**
     * Display the specified resource.
     * Responde a: GET /api/grupos/{grupo}
     */
    public function show(Grupo $grupo): JsonResponse
    {
        try {
            // Cargar todas las relaciones necesarias para la página Grupos/Show.jsx
            $grupo->load([
                'materia.carreras',       // Para la tarjeta "Materia"
                'docente.usuario',        // Para la tarjeta "Docente"
                'gestionAcademica',       // Para la tarjeta "Gestión"
                'horarios',               // Para la tabla "Horarios Asignados"
                'horarios.aula'           // Para ver el nombre del aula en la tabla
            ]);

            // Devolver directamente con clave 'data' para consistencia con el frontend
            return response()->json([
                'data' => $grupo
            ], 200);

        } catch (\Exception $e) {
            Log::error("Error al cargar grupo {$grupo->id}: " . $e->getMessage());
            return response()->json([
                'message' => 'Error al cargar los detalles del grupo.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGrupoRequest $request, Grupo $grupo): JsonResponse
    {
        $grupo->update($request->validated());
        $grupo->load(['materia.carreras', 'docente.usuario', 'gestionAcademica']);

        return response()->json([
            'message' => 'Grupo actualizado exitosamente',
            'grupo' => $grupo,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Grupo $grupo): JsonResponse
    {
        try {
            $grupo->delete();
            
            return response()->json([
                'message' => 'Grupo eliminado exitosamente',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'No se puede eliminar el grupo porque tiene horarios asociados',
                'error' => $e->getMessage(),
            ], 422);
        }
    }
}
