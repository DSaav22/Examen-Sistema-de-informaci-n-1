<?php

namespace App\Http\Controllers;

use App\Models\Grupo;
use App\Models\Materia;
use App\Models\Docente;
use App\Models\GestionAcademica;
use App\Http\Requests\StoreGrupoRequest;
use App\Http\Requests\UpdateGrupoRequest;
use Inertia\Inertia;

class GrupoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $grupos = Grupo::with([
            'materia:id,nombre,codigo',
            'docente.usuario:id,name',
            'gestionAcademica:id,nombre'
        ])->paginate(10);

        return Inertia::render('Grupos/Index', [
            'grupos' => $grupos,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $materias = Materia::select('id', 'nombre', 'codigo')
            ->where('activo', true)
            ->orderBy('nombre')
            ->get();

        $docentes = Docente::with('usuario:id,name')
            ->where('activo', true)
            ->get()
            ->map(function ($docente) {
                return [
                    'id' => $docente->id,
                    'nombre' => $docente->usuario->name,
                    'especialidad' => $docente->especialidad,
                ];
            });

        $gestiones = GestionAcademica::select('id', 'nombre')
            ->orderBy('fecha_inicio', 'desc')
            ->get();

        return Inertia::render('Grupos/Create', [
            'materias' => $materias,
            'docentes' => $docentes,
            'gestiones' => $gestiones,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreGrupoRequest $request)
    {
        Grupo::create($request->validated());

        return redirect()->route('grupos.index')
            ->with('success', 'Grupo creado exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Grupo $grupo)
    {
        // Cargar las relaciones del grupo
        $grupo->load([
            'materia:id,nombre,codigo',
            'docente.usuario:id,name',
            'gestionAcademica:id,nombre'
        ]);

        // Obtener los horarios ya asignados a este grupo
        $horarios = $grupo->horarios()
            ->with('aula:id,nombre,edificio')
            ->orderBy('dia_semana')
            ->orderBy('hora_inicio')
            ->get();

        // Obtener todas las aulas disponibles para el formulario
        $aulas = \App\Models\Aula::select('id', 'nombre', 'edificio', 'capacidad')
            ->where('activo', true)
            ->orderBy('edificio')
            ->orderBy('nombre')
            ->get();

        return Inertia::render('Grupos/Show', [
            'grupo' => $grupo,
            'horarios' => $horarios,
            'aulas' => $aulas,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Grupo $grupo)
    {
        $materias = Materia::select('id', 'nombre', 'codigo')
            ->where('activo', true)
            ->orderBy('nombre')
            ->get();

        $docentes = Docente::with('usuario:id,name')
            ->where('activo', true)
            ->get()
            ->map(function ($docente) {
                return [
                    'id' => $docente->id,
                    'nombre' => $docente->usuario->name,
                    'especialidad' => $docente->especialidad,
                ];
            });

        $gestiones = GestionAcademica::select('id', 'nombre')
            ->orderBy('fecha_inicio', 'desc')
            ->get();

        // Cargar las relaciones del grupo
        $grupo->load([
            'materia:id,nombre,codigo',
            'docente.usuario:id,name',
            'gestionAcademica:id,nombre'
        ]);

        return Inertia::render('Grupos/Edit', [
            'grupo' => $grupo,
            'materias' => $materias,
            'docentes' => $docentes,
            'gestiones' => $gestiones,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGrupoRequest $request, Grupo $grupo)
    {
        $grupo->update($request->validated());

        return redirect()->route('grupos.index')
            ->with('success', 'Grupo actualizado exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Grupo $grupo)
    {
        $grupo->delete();

        return redirect()->route('grupos.index')
            ->with('success', 'Grupo eliminado exitosamente.');
    }
}
