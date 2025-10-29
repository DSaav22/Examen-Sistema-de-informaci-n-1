<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GestionAcademica;
use App\Http\Requests\StoreGestionAcademicaRequest;
use App\Http\Requests\UpdateGestionAcademicaRequest;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class GestionAcademicaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $gestiones = GestionAcademica::orderBy('fecha_inicio', 'desc')
            ->paginate(10);

        return response()->json($gestiones, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreGestionAcademicaRequest $request): JsonResponse
    {
        $validatedData = $request->validated();

        // Derivamos el año y periodo automáticamente desde la fecha_inicio
        $fechaInicio = Carbon::parse($validatedData['fecha_inicio']);
        $validatedData['anio'] = $fechaInicio->year;
        $validatedData['periodo'] = $fechaInicio->month <= 6 ? 'I' : 'II';

        $gestion = GestionAcademica::create($validatedData);

        return response()->json([
            'message' => 'Gestión académica creada exitosamente',
            'gestion' => $gestion,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(GestionAcademica $gestion): JsonResponse
    {
        $gestion->load('grupos.materia', 'grupos.docente');

        return response()->json([
            'gestion' => $gestion,
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGestionAcademicaRequest $request, GestionAcademica $gestion): JsonResponse
    {
        $validatedData = $request->validated();

        // Derivamos el año y periodo automáticamente desde la fecha_inicio
        $fechaInicio = Carbon::parse($validatedData['fecha_inicio']);
        $validatedData['anio'] = $fechaInicio->year;
        $validatedData['periodo'] = $fechaInicio->month <= 6 ? 'I' : 'II';

        $gestion->update($validatedData);

        return response()->json([
            'message' => 'Gestión académica actualizada exitosamente',
            'gestion' => $gestion,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(GestionAcademica $gestion): JsonResponse
    {
        try {
            $gestion->delete();
            
            return response()->json([
                'message' => 'Gestión académica eliminada exitosamente',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'No se puede eliminar la gestión porque tiene grupos asociados',
                'error' => $e->getMessage(),
            ], 422);
        }
    }
}
