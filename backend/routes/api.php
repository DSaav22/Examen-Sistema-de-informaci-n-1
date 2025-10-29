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
});
