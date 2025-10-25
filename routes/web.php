<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MateriaController;
use App\Http\Controllers\AulaController;
use App\Http\Controllers\DocenteController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Rutas de Materias (Coordinador y Admin)
    Route::middleware('role:coordinador,administrador')->group(function () {
        Route::resource('materias', MateriaController::class);
        Route::resource('aulas', AulaController::class);
    });

    // Rutas de Docentes (Solo Admin)
    Route::middleware('role:administrador')->group(function () {
        Route::resource('docentes', DocenteController::class);
    });
});

require __DIR__.'/auth.php';
