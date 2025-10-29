<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Horario;
use App\Models\Grupo;
use Illuminate\Http\Request;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class HorarioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $horarios = Horario::with([
            'grupo.materia',
            'grupo.docente.usuario',
            'aula',
        ])
        ->orderBy('dia_semana')
        ->orderBy('hora_inicio')
        ->paginate(10);

        return response()->json($horarios, 200);
    }

    /**
     * Get form data for creating a horario.
     */
    public function formData(): JsonResponse
    {
        $aulas = Aula::where('activo', true)
            ->orderBy('edificio')
            ->orderBy('nombre')
            ->get();

        return response()->json([
            'aulas' => $aulas,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validatedData = $request->validate([
                'grupo_id' => 'required|exists:grupos,id',
                'aula_id' => 'required|exists:aulas,id',
                'dia_semana' => 'required|integer|min:1|max:7',
                'hora_inicio' => 'required|date_format:H:i',
                'hora_fin' => 'required|date_format:H:i|after:hora_inicio',
            ]);

            $nuevoInicio = $validatedData['hora_inicio'];
            $nuevoFin = $validatedData['hora_fin'];
            $grupoId = $validatedData['grupo_id'];
            $diaSemanaInt = (int)$validatedData['dia_semana'];

            // Validación Manual Conflicto Docente
            $grupo = Grupo::find($grupoId);
            if (!$grupo) {
                return response()->json(['message' => 'Grupo no encontrado.'], 404);
            }
            $docenteId = $grupo->docente_id;

            $conflictoDocente = Horario::where('dia_semana', $diaSemanaInt)
                ->where(function ($query) use ($nuevoInicio, $nuevoFin) {
                    $query->where('hora_inicio', '<', $nuevoFin)
                          ->where('hora_fin', '>', $nuevoInicio);
                })
                ->whereHas('grupo', function ($query) use ($docenteId) {
                    $query->where('docente_id', $docenteId);
                })
                ->exists();

            if ($conflictoDocente) {
                throw ValidationException::withMessages([
                    'general' => '¡Conflicto de Horario! El docente ya tiene otra clase asignada en ese día y rango de horas.'
                ]);
            }

            // Intento de Creación (Conflicto Aula - DB GIST)
            $horario = Horario::create($validatedData);
            $horario->load('aula');

            return response()->json([
                'message' => 'Horario asignado con éxito.',
                'horario' => $horario
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'errors' => $e->errors(),
            ], 422);

        } catch (QueryException $e) {
            if ($e->getCode() === '23P01') {
                $errorMessage = '¡Conflicto de Horario! ';
                if (str_contains($e->getMessage(), 'horarios_no_overlap_aula')) {
                    $errorMessage .= 'El aula ya está ocupada en ese día y rango de horas.';
                } else {
                    $errorMessage .= 'Se detectó un conflicto de asignación.';
                }
                return response()->json(['message' => 'Conflicto detectado.','errors' => ['general' => $errorMessage]], 422);

            } else if ($e->getCode() === '22P02') {
                Log::error("Error de tipo de dato en HorarioController: " . $e->getMessage(), $request->all());
                return response()->json(['message' => 'Error interno: Tipo de dato inválido.','errors' => ['general' => 'Error al procesar los datos del horario.']], 500);
            }

            Log::error("Error DB en HorarioController@store: " . $e->getMessage());
            return response()->json([
                'message' => 'Error al guardar el horario.',
                'errors' => ['general' => 'Error del servidor.']
            ], 500);

        } catch (\Exception $e) {
            Log::error("Error inesperado en HorarioController@store: " . $e->getMessage());
            return response()->json([
                'message' => 'Ocurrió un error inesperado.',
                'errors' => ['general' => 'Error del servidor.']
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Horario $horario): JsonResponse
    {
        $horario->load([
            'grupo.materia.carrera',
            'grupo.docente.usuario',
            'grupo.gestionAcademica',
            'aula',
        ]);

        return response()->json([
            'horario' => $horario,
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateHorarioRequest $request, Horario $horario): JsonResponse
    {
        // Similar validación de conflictos que en store
        $grupo = Grupo::findOrFail($request->grupo_id ?? $horario->grupo_id);
        $docenteId = $grupo->docente_id;

        $nuevoInicio = $request->hora_inicio ?? $horario->hora_inicio;
        $nuevoFin = $request->hora_fin ?? $horario->hora_fin;
        $diaSemana = $request->dia_semana ?? $horario->dia_semana;

        $conflictoDocente = Horario::where('id', '!=', $horario->id)
            ->where('dia_semana', $diaSemana)
            ->where(function ($query) use ($nuevoInicio, $nuevoFin) {
                $query->where('hora_inicio', '<', $nuevoFin)
                      ->where('hora_fin', '>', $nuevoInicio);
            })
            ->whereHas('grupo', function ($query) use ($docenteId) {
                $query->where('docente_id', $docenteId);
            })
            ->exists();

        if ($conflictoDocente) {
            return response()->json([
                'message' => 'Conflicto de horario: El docente ya tiene una clase asignada en este horario.',
                'errors' => [
                    'dia_semana' => ['El docente ya tiene una clase asignada en este día y hora.'],
                ],
            ], 422);
        }

        try {
            $horario->update($request->validated());
            $horario->load(['grupo.materia', 'grupo.docente.usuario', 'aula']);

            return response()->json([
                'message' => 'Horario actualizado exitosamente',
                'horario' => $horario,
            ], 200);
        } catch (\Illuminate\Database\QueryException $e) {
            if (str_contains($e->getMessage(), 'horarios_no_overlap_aula')) {
                return response()->json([
                    'message' => 'Conflicto de horario: El aula ya está ocupada en ese día y horario.',
                    'errors' => [
                        'aula_id' => ['El aula ya está ocupada en ese día y horario.'],
                    ],
                ], 422);
            }

            return response()->json([
                'message' => 'Error al actualizar el horario',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Horario $horario): JsonResponse
    {
        try {
            $horario->delete();
            return response()->json(['message' => 'Horario eliminado con éxito.'], 200);

        } catch (\Exception $e) {
            Log::error("Error al eliminar horario {$horario->id}: " . $e->getMessage());
            return response()->json(['message' => 'Error al eliminar el horario.'], 500);
        }
    }
}
