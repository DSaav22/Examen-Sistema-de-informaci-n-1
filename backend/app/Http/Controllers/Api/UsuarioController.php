<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class UsuarioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $usuarios = User::with('role')
            ->orderBy('name')
            ->paginate(10);

        return response()->json($usuarios, 200);
    }

    /**
     * Get form data (roles) for creating/editing a usuario.
     */
    public function formData(): JsonResponse
    {
        try {
            $roles = Role::orderBy('nombre')->get(['id', 'nombre', 'descripcion']);

            return response()->json([
                'roles' => $roles,
            ], 200);

        } catch (\Exception $e) {
            Log::error("Error al cargar datos para formulario usuario: " . $e->getMessage());
            return response()->json([
                'message' => 'Error al cargar los datos necesarios para el formulario.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email',
                'ci' => 'required|string|max:20|unique:users,ci',
                'telefono' => 'nullable|string|max:20',
                'rol_id' => 'required|integer|exists:roles,id',
                'password' => 'required|string|min:8|confirmed',
                'activo' => 'boolean',
            ]);

            // Hashear la contraseña
            $validated['password'] = Hash::make($validated['password']);
            
            // Establecer activo por defecto
            $validated['activo'] = $validated['activo'] ?? true;

            $usuario = User::create($validated);
            $usuario->load('role');

            return response()->json([
                'message' => 'Usuario creado exitosamente',
                'usuario' => $usuario,
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error("Error al crear usuario: " . $e->getMessage());
            return response()->json([
                'message' => 'Error al crear el usuario',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(User $usuario): JsonResponse
    {
        $usuario->load('role');

        return response()->json([
            'usuario' => $usuario,
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $usuario): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => [
                    'required',
                    'string',
                    'email',
                    'max:255',
                    Rule::unique('users', 'email')->ignore($usuario->id),
                ],
                'ci' => [
                    'required',
                    'string',
                    'max:20',
                    Rule::unique('users', 'ci')->ignore($usuario->id),
                ],
                'telefono' => 'nullable|string|max:20',
                'rol_id' => 'required|integer|exists:roles,id',
                'password' => 'nullable|string|min:8|confirmed',
                'activo' => 'boolean',
            ]);

            // Solo actualizar la contraseña si viene en el request
            if (!empty($validated['password'])) {
                $validated['password'] = Hash::make($validated['password']);
            } else {
                unset($validated['password']);
            }

            $usuario->update($validated);
            $usuario->load('role');

            return response()->json([
                'message' => 'Usuario actualizado exitosamente',
                'usuario' => $usuario,
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error("Error al actualizar usuario: " . $e->getMessage());
            return response()->json([
                'message' => 'Error al actualizar el usuario',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $usuario): JsonResponse
    {
        try {
            // Evitar que el usuario se elimine a sí mismo
            if (auth()->id() === $usuario->id) {
                return response()->json([
                    'message' => 'No puedes eliminar tu propio usuario',
                ], 403);
            }

            $usuario->delete();

            return response()->json([
                'message' => 'Usuario eliminado exitosamente',
            ], 200);

        } catch (\Exception $e) {
            Log::error("Error al eliminar usuario: " . $e->getMessage());
            return response()->json([
                'message' => 'Error al eliminar el usuario',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
