<?php

namespace App\Http\Controllers;

use App\Models\Materia;
use App\Models\Carrera;
use App\Http\Requests\StoreMateriaRequest;
use App\Http\Requests\UpdateMateriaRequest;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;

class MateriaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $materias = Materia::with(['carrera.facultad'])
            ->orderBy('nombre')
            ->paginate(10);

        return Inertia::render('Materias/Index', [
            'materias' => $materias,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $carreras = Carrera::with('facultad')
            ->where('activo', true)
            ->orderBy('nombre')
            ->get();

        return Inertia::render('Materias/Create', [
            'carreras' => $carreras,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMateriaRequest $request): RedirectResponse
    {
        Materia::create($request->validated());

        return redirect()->route('materias.index')
            ->with('success', 'Materia creada exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Materia $materia)
    {
        $materia->load(['carrera.facultad', 'grupos.docente.usuario']);

        return Inertia::render('Materias/Show', [
            'materia' => $materia,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Materia $materia)
    {
        $carreras = Carrera::with('facultad')
            ->where('activo', true)
            ->orderBy('nombre')
            ->get();

        $materia->load('carrera.facultad');

        return Inertia::render('Materias/Edit', [
            'materia' => $materia,
            'carreras' => $carreras,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMateriaRequest $request, Materia $materia): RedirectResponse
    {
        $materia->update($request->validated());

        return redirect()->route('materias.index')
            ->with('success', 'Materia actualizada exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Materia $materia): RedirectResponse
    {
        try {
            $materia->delete();
            return redirect()->route('materias.index')
                ->with('success', 'Materia eliminada exitosamente.');
        } catch (\Exception $e) {
            return redirect()->route('materias.index')
                ->with('error', 'No se puede eliminar la materia porque tiene grupos asociados.');
        }
    }
}
