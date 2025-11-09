<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MateriaController;
use App\Http\Controllers\Api\AulaController;
use App\Http\Controllers\Api\DocenteController;
use App\Http\Controllers\Api\GestionAcademicaController;
use App\Http\Controllers\Api\GrupoController;
use App\Http\Controllers\Api\HorarioController;
use App\Http\Controllers\Api\UsuarioController;
use App\Http\Controllers\Api\ReporteController;
use App\Http\Controllers\Api\ImportController;
use App\Http\Controllers\Api\AsistenciaController;
use App\Http\Controllers\Api\CargaHorariaController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Rutas públicas de autenticación
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Rutas protegidas con Sanctum
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Materias
    Route::apiResource('materias', MateriaController::class);
    Route::get('/materias-form-data', [MateriaController::class, 'formData']);

    // Aulas
    Route::apiResource('aulas', AulaController::class);

    // Usuarios (solo Admin)
    Route::apiResource('usuarios', UsuarioController::class);
    Route::get('/usuarios-form-data', [UsuarioController::class, 'formData']);

    // Docentes
    Route::apiResource('docentes', DocenteController::class);
    Route::get('/docentes-form-data', [DocenteController::class, 'formData']);
    Route::get('/docentes/export/excel', [DocenteController::class, 'exportExcel']);
    Route::get('/docentes/export/pdf', [DocenteController::class, 'exportPdf']);

    // Importación masiva (Administrador y Coordinador)
    Route::post('/importar/docentes', [ImportController::class, 'importDocentes']);
    Route::post('/importar/carga-horaria', [CargaHorariaController::class, 'importar']);

    // Asistencia (Docentes)
    Route::get('/asistencia/hoy', [AsistenciaController::class, 'clasesDeHoy']);
    Route::post('/asistencia/registrar', [AsistenciaController::class, 'registrarAsistencia']);
    Route::post('/asistencia/registrar-qr', [AsistenciaController::class, 'registrarAsistenciaQr']);

    // Gestiones Académicas
    Route::apiResource('gestiones', GestionAcademicaController::class);

    // Grupos
    Route::apiResource('grupos', GrupoController::class);
    Route::get('/grupos-form-data', [GrupoController::class, 'formData']);

    // Horarios
    Route::apiResource('horarios', HorarioController::class);
    Route::get('/horarios-form-data', [HorarioController::class, 'formData']);

    // Reportes
    Route::get('/reportes/horarios-filtros', [ReporteController::class, 'getFiltros']);
    Route::get('/reportes/horarios-global', [ReporteController::class, 'getHorariosGlobal']);
    Route::get('/reportes/asistencia-docente', [ReporteController::class, 'reporteAsistenciaDocente']);
    Route::get('/reportes/aulas-disponibles', [ReporteController::class, 'reporteAulasDisponibles']);
});
