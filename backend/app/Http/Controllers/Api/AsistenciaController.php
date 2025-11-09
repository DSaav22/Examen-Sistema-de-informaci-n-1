<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Horario;
use App\Models\Asistencia;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AsistenciaController extends Controller
{
    /**
     * Obtener las clases de hoy para el docente autenticado
     */
    public function clasesDeHoy(): JsonResponse
    {
        try {
            $user = auth()->user();

            // Verificar que el usuario tenga un docente asociado
            if (!$user->docente) {
                return response()->json([
                    'message' => 'El usuario no tiene un perfil de docente asociado.',
                    'clases' => []
                ], 200);
            }

            $docenteId = $user->docente->id;

            // Obtener día de la semana actual (Lunes = 1, Domingo = 7)
            $diaActual = Carbon::now()->dayOfWeekIso;

            // Mapear día numérico a nombre
            $diasSemana = [
                1 => 'Lunes',
                2 => 'Martes',
                3 => 'Miércoles',
                4 => 'Jueves',
                5 => 'Viernes',
                6 => 'Sábado',
                7 => 'Domingo',
            ];

            $diaNombre = $diasSemana[$diaActual];

            // Obtener horarios del docente para el día de hoy
            $horarios = Horario::with(['grupo.materia', 'grupo.gestionAcademica', 'aula'])
                ->whereHas('grupo', function ($query) use ($docenteId) {
                    $query->where('docente_id', $docenteId);
                })
                ->where('dia_semana', $diaActual) // Usar número en lugar de nombre
                ->orderBy('hora_inicio')
                ->get();

            // Verificar asistencia para cada horario
            $clases = $horarios->map(function ($horario) {
                $asistencia = Asistencia::where('horario_id', $horario->id)
                    ->whereDate('fecha', Carbon::today())
                    ->first();

                return [
                    'id' => $horario->id,
                    'materia' => [
                        'sigla' => $horario->grupo->materia->sigla ?? 'N/A',
                        'nombre' => $horario->grupo->materia->nombre ?? 'Sin materia',
                    ],
                    'grupo' => [
                        'nombre' => $horario->grupo->nombre ?? 'Sin grupo',
                    ],
                    'aula' => [
                        'nombre' => $horario->aula->nombre ?? 'Sin aula',
                        'edificio' => $horario->aula->edificio ?? '',
                    ],
                    'hora_inicio' => $horario->hora_inicio,
                    'hora_fin' => $horario->hora_fin,
                    'dia_semana' => $horario->dia_semana,
                    'asistencia_registrada' => $asistencia ? true : false,
                    'asistencia' => $asistencia ? [
                        'id' => $asistencia->id,
                        'estado' => $asistencia->estado,
                        'metodo_registro' => $asistencia->metodo_registro,
                        'fecha' => $asistencia->fecha,
                        'hora_registro' => $asistencia->hora_registro,
                    ] : null,
                ];
            });

            return response()->json([
                'dia' => $diaNombre,
                'fecha' => Carbon::now()->format('Y-m-d'),
                'clases' => $clases,
            ], 200);

        } catch (\Exception $e) {
            Log::error("Error al obtener clases de hoy: " . $e->getMessage());
            return response()->json([
                'message' => 'Error al obtener las clases de hoy',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Registrar asistencia para un horario específico
     */
    public function registrarAsistencia(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'horario_id' => 'required|integer|exists:horarios,id',
            ]);

            $horarioId = $validated['horario_id'];
            $user = auth()->user();

            // Verificar que el usuario tenga un docente asociado
            if (!$user->docente) {
                return response()->json([
                    'message' => 'El usuario no tiene un perfil de docente asociado.'
                ], 403);
            }

            $docenteId = $user->docente->id;

            // Obtener el horario y verificar que pertenece al docente
            $horario = Horario::with('grupo')->findOrFail($horarioId);

            if ($horario->grupo->docente_id !== $docenteId) {
                return response()->json([
                    'message' => 'No tienes permiso para registrar asistencia en este horario.'
                ], 403);
            }

            // Verificar si ya existe asistencia registrada para hoy
            $asistenciaExistente = Asistencia::where('horario_id', $horarioId)
                ->whereDate('fecha', Carbon::today())
                ->first();

            if ($asistenciaExistente) {
                return response()->json([
                    'message' => 'Ya has registrado tu asistencia para esta clase hoy.',
                    'asistencia' => $asistenciaExistente
                ], 200);
            }

            // Verificar que sea el día correcto de la clase
            $diaActual = Carbon::now()->dayOfWeekIso;
            $diasSemana = [
                1 => 'Lunes',
                2 => 'Martes',
                3 => 'Miércoles',
                4 => 'Jueves',
                5 => 'Viernes',
                6 => 'Sábado',
                7 => 'Domingo',
            ];
            $diaNombre = $diasSemana[$diaActual];

            // Comparar usando el número del día en lugar del nombre
            if ($horario->dia_semana !== $diaActual) {
                return response()->json([
                    'message' => 'Esta clase no corresponde al día de hoy.',
                    'dia_clase' => $diasSemana[$horario->dia_semana] ?? 'Desconocido',
                    'dia_actual' => $diaNombre,
                ], 422);
            }

            // Validar ventana de tiempo (30 minutos después de la hora de inicio)
            $horaActual = Carbon::now();
            $horaInicio = Carbon::parse($horario->hora_inicio);
            $horaLimite = $horaInicio->copy()->addMinutes(30);

            if ($horaActual->lt($horaInicio) || $horaActual->gt($horaLimite)) {
                return response()->json([
                    'message' => 'Solo puedes registrar asistencia dentro de los 30 minutos posteriores al inicio de la clase.',
                    'hora_inicio' => $horaInicio->format('H:i'),
                    'hora_limite' => $horaLimite->format('H:i'),
                    'hora_actual' => $horaActual->format('H:i'),
                    'fuera_de_ventana' => true,
                ], 422);
            }

            // Crear registro de asistencia
            $asistencia = Asistencia::create([
                'horario_id' => $horarioId,
                'fecha' => Carbon::today(),
                'hora_registro' => Carbon::now()->format('H:i:s'),
                'estado' => 'presente',
                'metodo_registro' => 'digital',
            ]);

            return response()->json([
                'message' => 'Asistencia registrada exitosamente',
                'asistencia' => $asistencia
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            Log::error("Error al registrar asistencia: " . $e->getMessage());
            return response()->json([
                'message' => 'Error al registrar la asistencia',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Registrar asistencia mediante código QR
     * Sistema seguro con validación de aula y ventana de tiempo
     */
    public function registrarAsistenciaQr(Request $request): JsonResponse
    {
        try {
            // Validar datos de entrada
            $validated = $request->validate([
                'horario_id' => 'required|integer|exists:horarios,id',
                'aula_id_qr' => 'required|integer|exists:aulas,id',
            ]);

            $user = auth()->user();

            // Verificar que el usuario tenga un docente asociado
            if (!$user->docente) {
                return response()->json([
                    'error' => 'El usuario no tiene un perfil de docente asociado.'
                ], 403);
            }

            $docenteId = $user->docente->id;

            // Obtener el horario con relaciones necesarias
            $horario = Horario::with(['grupo', 'aula'])->find($validated['horario_id']);

            if (!$horario) {
                return response()->json([
                    'error' => 'Horario no encontrado.'
                ], 404);
            }

            // VALIDACIÓN 1: Pertenencia - El horario debe pertenecer al docente
            if ($horario->grupo->docente_id !== $docenteId) {
                return response()->json([
                    'error' => 'No estás autorizado para registrar asistencia en esta clase.'
                ], 403);
            }

            // VALIDACIÓN 2: Día Correcto - La clase debe ser hoy
            $diaActual = Carbon::now()->dayOfWeekIso;
            if ($horario->dia_semana !== $diaActual) {
                $diasSemana = [
                    1 => 'Lunes', 2 => 'Martes', 3 => 'Miércoles',
                    4 => 'Jueves', 5 => 'Viernes', 6 => 'Sábado', 7 => 'Domingo'
                ];
                return response()->json([
                    'error' => 'Esta clase no corresponde al día de hoy. Esta clase es los ' . ($diasSemana[$horario->dia_semana] ?? 'N/A') . '.'
                ], 422);
            }

            // VALIDACIÓN 3: Lugar Correcto (QR) - Debe escanear el QR del aula correcta
            if ($horario->aula_id !== $validated['aula_id_qr']) {
                return response()->json([
                    'error' => 'Aula incorrecta. Debes escanear el código QR del aula ' . ($horario->aula->nombre ?? 'asignada') . '.',
                    'aula_esperada' => $horario->aula->nombre ?? 'N/A',
                    'aula_escaneada' => \App\Models\Aula::find($validated['aula_id_qr'])->nombre ?? 'Desconocida'
                ], 422);
            }

            // VALIDACIÓN 4: Ventana de Tiempo - 15 minutos antes y después de la hora de inicio
            $horaActual = Carbon::now();
            $horaInicio = Carbon::parse($horario->hora_inicio);
            $ventanaInicio = $horaInicio->copy()->subMinutes(15);
            $ventanaFin = $horaInicio->copy()->addMinutes(15);

            if ($horaActual->lt($ventanaInicio) || $horaActual->gt($ventanaFin)) {
                return response()->json([
                    'error' => 'Estás fuera del horario permitido para marcar asistencia. Solo puedes marcar entre 15 minutos antes y 15 minutos después del inicio de clase.',
                    'hora_inicio_clase' => $horaInicio->format('H:i'),
                    'ventana_permitida' => $ventanaInicio->format('H:i') . ' - ' . $ventanaFin->format('H:i'),
                    'hora_actual' => $horaActual->format('H:i'),
                ], 422);
            }

            // VALIDACIÓN 5: Duplicados - No puede marcar dos veces el mismo día
            $asistenciaExistente = Asistencia::where('horario_id', $validated['horario_id'])
                ->whereDate('fecha', Carbon::today())
                ->first();

            if ($asistenciaExistente) {
                return response()->json([
                    'error' => 'Ya has registrado tu asistencia para esta clase hoy.',
                    'hora_registro_previo' => $asistenciaExistente->hora_registro
                ], 422);
            }

            // ✅ TODAS LAS VALIDACIONES PASARON - Crear registro de asistencia
            $asistencia = Asistencia::create([
                'horario_id' => $validated['horario_id'],
                'fecha' => Carbon::today(),
                'hora_registro' => Carbon::now()->format('H:i:s'),
                'estado' => 'presente',
                'metodo_registro' => 'qr', // Indicar que fue por QR
            ]);

            return response()->json([
                'message' => '✅ Asistencia registrada exitosamente',
                'asistencia' => $asistencia,
                'clase' => [
                    'materia' => $horario->grupo->materia->nombre ?? 'N/A',
                    'aula' => $horario->aula->nombre ?? 'N/A',
                    'hora' => $horario->hora_inicio
                ]
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Datos inválidos',
                'details' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            Log::error("Error al registrar asistencia por QR: " . $e->getMessage());
            return response()->json([
                'error' => 'Error al registrar la asistencia',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}
