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

class GrupoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $grupos = Grupo::with([
            'materia.carrera',
            'docente.usuario',
            'gestionAcademica',
        ])
        ->orderBy('nombre_grupo')
        ->paginate(10);

        return response()->json($grupos, 200);
    }

    /**
     * Get form data for creating a grupo.
     */
    public function formData(): JsonResponse
    {
        $materias = Materia::with('carrera')
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

        return response()->json([
            'materias' => $materias,
            'docentes' => $docentes,
            'gestiones' => $gestiones,
            'aulas' => $aulas,
            'carreras' => $carreras,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreGrupoRequest $request): JsonResponse
    {
        $grupo = Grupo::create($request->validated());
        $grupo->load(['materia.carrera', 'docente.usuario', 'gestionAcademica']);

        return response()->json([
            'message' => 'Grupo creado exitosamente',
            'grupo' => $grupo,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Grupo $grupo): JsonResponse
    {
        $grupo->load([
            'materia.carrera.facultad',
            'docente.usuario',
            'gestionAcademica',
            'horarios.aula',
        ]);

        return response()->json([
            'grupo' => $grupo,
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGrupoRequest $request, Grupo $grupo): JsonResponse
    {
        $grupo->update($request->validated());
        $grupo->load(['materia.carrera', 'docente.usuario', 'gestionAcademica']);

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
