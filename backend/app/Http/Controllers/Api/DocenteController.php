<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Docente;
use App\Models\User;
use App\Http\Requests\StoreDocenteRequest;
use App\Http\Requests\UpdateDocenteRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class DocenteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $docentes = Docente::with('usuario.role')
            ->orderBy('codigo_docente')
            ->paginate(10);

        return response()->json($docentes, 200);
    }

    /**
     * Obtiene los datos necesarios para los formularios de crear/editar.
     */
    public function formData(): JsonResponse
    {
        try {
            // --- INICIO DE LA CORRECCIÓN ---
            // Buscamos usuarios ACTIVOS que NO tengan ya un perfil de docente.
            // Eliminamos el filtro de rol para permitir asignar el perfil
            // de docente a cualquier tipo de usuario (admin, coord, etc.).
            $usuariosDisponibles = User::whereDoesntHave('docente')
                ->where('activo', true)
                ->orderBy('name')
                ->get(['id', 'name', 'email']); // Solo traemos los campos necesarios

            // --- FIN DE LA CORRECCIÓN ---

            return response()->json([
                'usuarios' => $usuariosDisponibles,
            ], 200);

        } catch (\Exception $e) {
            Log::error("Error al cargar datos para formulario docente: " . $e->getMessage());
            return response()->json([
                'message' => 'Error al cargar los datos necesarios para el formulario.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDocenteRequest $request): JsonResponse
    {
        $docente = Docente::create($request->validated());
        $docente->load('usuario.role');

        return response()->json([
            'message' => 'Docente registrado exitosamente',
            'docente' => $docente,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Docente $docente): JsonResponse
    {
        $docente->load([
            'usuario.role',
            'grupos.materia',
            'grupos.gestionAcademica',
        ]);

        return response()->json([
            'docente' => $docente,
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDocenteRequest $request, Docente $docente): JsonResponse
    {
        $docente->update($request->validated());
        $docente->load('usuario.role');

        return response()->json([
            'message' => 'Docente actualizado exitosamente',
            'docente' => $docente,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Docente $docente): JsonResponse
    {
        try {
            $docente->delete();
            
            return response()->json([
                'message' => 'Docente eliminado exitosamente',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'No se puede eliminar el docente porque tiene grupos asignados',
                'error' => $e->getMessage(),
            ], 422);
        }
    }
}
