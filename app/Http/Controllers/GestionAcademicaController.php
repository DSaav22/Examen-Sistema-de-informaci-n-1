<?php

namespace App\Http\Controllers;

use App\Models\GestionAcademica;
use App\Http\Requests\StoreGestionAcademicaRequest;
use App\Http\Requests\UpdateGestionAcademicaRequest;
use Inertia\Inertia;
use Carbon\Carbon;

class GestionAcademicaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $gestiones = GestionAcademica::orderBy('fecha_inicio', 'desc')
            ->paginate(10);

        return Inertia::render('Gestiones/Index', [
            'gestiones' => $gestiones,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Gestiones/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreGestionAcademicaRequest $request)
    {
        $validatedData = $request->validated();

        // Derivamos el año y periodo automáticamente desde la fecha_inicio
        $fechaInicio = Carbon::parse($validatedData['fecha_inicio']);
        $validatedData['anio'] = $fechaInicio->year;
        $validatedData['periodo'] = $fechaInicio->month <= 6 ? 'I' : 'II';

        GestionAcademica::create($validatedData);

        return redirect()->route('gestiones.index')
            ->with('success', 'Gestión académica creada exitosamente.');
    }    /**
     * Display the specified resource.
     */
    public function show(GestionAcademica $gestion)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(GestionAcademica $gestion)
    {
        return Inertia::render('Gestiones/Edit', [
            'gestion' => $gestion,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGestionAcademicaRequest $request, GestionAcademica $gestion)
    {
        $validatedData = $request->validated();

        // Derivamos el año y periodo automáticamente desde la fecha_inicio
        $fechaInicio = Carbon::parse($validatedData['fecha_inicio']);
        $validatedData['anio'] = $fechaInicio->year;
        $validatedData['periodo'] = $fechaInicio->month <= 6 ? 'I' : 'II';

        $gestion->update($validatedData);

        return redirect()->route('gestiones.index')
            ->with('success', 'Gestión académica actualizada exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(GestionAcademica $gestion)
    {
        $gestion->delete();

        return redirect()->route('gestiones.index')
            ->with('success', 'Gestión académica eliminada exitosamente.');
    }
}
