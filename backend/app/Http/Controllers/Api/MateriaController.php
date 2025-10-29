<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Materia;
use App\Models\Carrera;
use App\Http\Requests\StoreMateriaRequest;
use App\Http\Requests\UpdateMateriaRequest;
use Illuminate\Http\JsonResponse;

class MateriaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $materias = Materia::with(['carrera.facultad'])
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
        $materia = Materia::create($request->validated());
        $materia->load(['carrera.facultad']);

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
        $materia->load(['carrera.facultad', 'grupos.docente.usuario']);

        return response()->json([
            'materia' => $materia,
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMateriaRequest $request, Materia $materia): JsonResponse
    {
        $materia->update($request->validated());
        $materia->load(['carrera.facultad']);

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
