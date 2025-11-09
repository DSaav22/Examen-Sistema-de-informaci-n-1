<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Materia;
use App\Models\Carrera;
use App\Http\Requests\StoreMateriaRequest;
use App\Http\Requests\UpdateMateriaRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class MateriaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $materias = Materia::with(['carreras.facultad'])
            ->orderBy('nombre')
            ->paginate(10);

        return response()->json($materias, 200);
    }

    /**
     * Get form data (carreras) for creating a materia.
     */
    public function formData(): JsonResponse
    {
        $carreras = Carrera::with('facultad')
            ->where('activo', true)
            ->orderBy('nombre')
            ->get();

        return response()->json([
            'carreras' => $carreras,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMateriaRequest $request): JsonResponse
    {
        $validated = $request->validated();
        
        // Extraer carreras si viene en el request
        $carreras = $validated['carreras'] ?? [];
        unset($validated['carreras']);
        
        // Crear la materia
        $materia = Materia::create($validated);
        
        // Asociar carreras si hay
        if (!empty($carreras)) {
            foreach ($carreras as $carreraData) {
                $materia->carreras()->attach($carreraData['carrera_id'], [
                    'semestre_sugerido' => $carreraData['semestre_sugerido'] ?? null,
                    'obligatoria' => $carreraData['obligatoria'] ?? true,
                ]);
            }
        }
        
        $materia->load(['carreras.facultad']);

        return response()->json([
            'message' => 'Materia creada exitosamente',
            'materia' => $materia,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Materia $materia): JsonResponse
    {
        $materia->load(['carreras.facultad', 'grupos.docente.usuario']);

        return response()->json([
            'materia' => $materia,
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMateriaRequest $request, Materia $materia): JsonResponse
    {
        $validated = $request->validated();
        
        // Extraer carreras si viene en el request
        $carreras = $validated['carreras'] ?? [];
        unset($validated['carreras']);
        
        // Actualizar la materia
        $materia->update($validated);
        
        // Sincronizar carreras si hay
        if (!empty($carreras)) {
            $sync = [];
            foreach ($carreras as $carreraData) {
                $sync[$carreraData['carrera_id']] = [
                    'semestre_sugerido' => $carreraData['semestre_sugerido'] ?? null,
                    'obligatoria' => $carreraData['obligatoria'] ?? true,
                ];
            }
            $materia->carreras()->sync($sync);
        }
        
        $materia->load(['carreras.facultad']);

        return response()->json([
            'message' => 'Materia actualizada exitosamente',
            'materia' => $materia,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Materia $materia): JsonResponse
    {
        try {
            $materia->delete();
            
            return response()->json([
                'message' => 'Materia eliminada exitosamente',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'No se puede eliminar la materia porque tiene grupos asociados',
                'error' => $e->getMessage(),
            ], 422);
        }
    }
}
