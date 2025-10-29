<?php

namespace App\Http\Controllers;

use App\Models\Horario;
use App\Models\Grupo;
use Illuminate\Http\Request;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Log;

class HorarioController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'grupo_id' => 'required|exists:grupos,id',
            'aula_id' => 'required|exists:aulas,id',
            'dia_semana' => 'required|integer|min:1|max:7',
            'hora_inicio' => 'required|date_format:H:i',
            'hora_fin' => 'required|date_format:H:i|after:hora_inicio',
        ]);

        // --- VALIDACIÓN MANUAL: Conflicto de Docente ---
        
        $nuevoInicio = $request->hora_inicio;
        $nuevoFin = $request->hora_fin;
        
        // 1. Obtenemos el docente_id del grupo que estamos intentando agendar
        $grupo = Grupo::find($request->grupo_id);
        $docenteId = $grupo->docente_id;

        // 2. Buscamos si existe un horario conflictivo para ESE docente en el MISMO día
        $conflictoDocente = Horario::where('dia_semana', $request->dia_semana)
            // Búsqueda de solapamiento de tiempo
            ->where(function ($query) use ($nuevoInicio, $nuevoFin) {
                $query->where('hora_inicio', '<', $nuevoFin)
                      ->where('hora_fin', '>', $nuevoInicio);
            })
            // Donde el horario pertenezca a un grupo de ESE MISMO docente
            ->whereHas('grupo', function ($query) use ($docenteId) {
                $query->where('docente_id', $docenteId);
            })
            ->exists(); // Solo necesitamos saber si existe (true/false)

        if ($conflictoDocente) {
            return redirect()->back()
                ->withErrors(['general' => '¡Conflicto de Horario! El docente ya tiene otra clase asignada en ese día y rango de horas. Por favor, selecciona otro horario.'])
                ->withInput();
        }
        
        // --- FIN VALIDACIÓN MANUAL ---

        // Bloque TRY...CATCH: Conflicto de Aula (detectado por PostgreSQL GIST)
        try {
            Horario::create($request->all());

            return redirect()->route('grupos.show', $request->grupo_id)
                ->with('success', 'Horario asignado con éxito.');

        } catch (QueryException $e) {
            // Código de error de PostgreSQL para "exclusion_violation"
            if ($e->getCode() === '23P01') {
                $errorMessage = '¡Conflicto de Horario! ';
                
                // Revisamos el nombre exacto de la restricción
                if (str_contains($e->getMessage(), 'horarios_no_overlap_aula')) {
                    $errorMessage .= 'El aula ya está ocupada en ese día y rango de horas. Por favor, selecciona otro horario o aula.';
                } else {
                    $errorMessage .= 'Se detectó un conflicto de exclusión. Verifica que no haya solapamiento de horarios.';
                }
                
                return redirect()->back()
                    ->withErrors(['general' => $errorMessage])
                    ->withInput();
            }

            // Otro error de base de datos
            Log::error('Error al crear horario: ' . $e->getMessage());
            return redirect()->back()
                ->withErrors(['general' => 'Error al guardar el horario: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Horario $horario)
    {
        $grupo_id = $horario->grupo_id;
        $horario->delete();
        
        return redirect()->route('grupos.show', $grupo_id)
            ->with('success', 'Horario eliminado con éxito.');
    }
}
