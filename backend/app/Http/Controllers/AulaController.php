<?php

namespace App\Http\Controllers;

use App\Models\Aula;
use App\Http\Requests\StoreAulaRequest;
use App\Http\Requests\UpdateAulaRequest;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;

class AulaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $aulas = Aula::orderBy('edificio')
            ->orderBy('nombre')
            ->paginate(10);

        return Inertia::render('Aulas/Index', [
            'aulas' => $aulas,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Aulas/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAulaRequest $request): RedirectResponse
    {
        Aula::create($request->validated());

        return redirect()->route('aulas.index')
            ->with('success', 'Aula creada exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Aula $aula)
    {
        $aula->load(['horarios.grupo.materia', 'horarios.grupo.docente.usuario']);

        return Inertia::render('Aulas/Show', [
            'aula' => $aula,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Aula $aula)
    {
        return Inertia::render('Aulas/Edit', [
            'aula' => $aula,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAulaRequest $request, Aula $aula): RedirectResponse
    {
        $aula->update($request->validated());

        return redirect()->route('aulas.index')
            ->with('success', 'Aula actualizada exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Aula $aula): RedirectResponse
    {
        try {
            $aula->delete();
            return redirect()->route('aulas.index')
                ->with('success', 'Aula eliminada exitosamente.');
        } catch (\Exception $e) {
            return redirect()->route('aulas.index')
                ->with('error', 'No se puede eliminar el aula porque tiene horarios asociados.');
        }
    }
}
