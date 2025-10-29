<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Aula;
use App\Http\Requests\StoreAulaRequest;
use App\Http\Requests\UpdateAulaRequest;
use Illuminate\Http\JsonResponse;

class AulaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $aulas = Aula::orderBy('edificio')
            ->orderBy('nombre')
            ->paginate(10);

        return response()->json($aulas, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAulaRequest $request): JsonResponse
    {
        $aula = Aula::create($request->validated());

        return response()->json([
            'message' => 'Aula creada exitosamente',
            'aula' => $aula,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Aula $aula): JsonResponse
    {
        $aula->load(['horarios.grupo.materia', 'horarios.grupo.docente.usuario']);

        return response()->json([
            'aula' => $aula,
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAulaRequest $request, Aula $aula): JsonResponse
    {
        $aula->update($request->validated());

        return response()->json([
            'message' => 'Aula actualizada exitosamente',
            'aula' => $aula,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Aula $aula): JsonResponse
    {
        try {
            $aula->delete();
            
            return response()->json([
                'message' => 'Aula eliminada exitosamente',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'No se puede eliminar el aula porque tiene horarios asociados',
                'error' => $e->getMessage(),
            ], 422);
        }
    }
}
